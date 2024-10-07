"use client";

import React, { useState, useRef, useEffect } from 'react';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import { detectFist } from './model1'; // Import the fist detection function
import { NextPage } from 'next'; // Import NextPage type
import { Hands, Results } from '@mediapipe/hands'; // Import the types from Mediapipe

// Define the props type for your component
interface HomePageProps {
  searchParams?: {
    showControlsOnly?: string; // Optional query parameter
  };
}

// Define the component as a NextPage with specific props
const HomePage: NextPage<HomePageProps> = ({ searchParams }) => {
  const showControlsOnly = searchParams?.showControlsOnly === 'true'; // Handle the prop from search params
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(true);
  const [accuracyText, setAccuracyText] = useState("");
  const [gestureText, setGestureText] = useState("");
  const [showLandmarksOnly, setShowLandmarksOnly] = useState(false);
  const [isModel1Checked, setIsModel1Checked] = useState(false); // Checkbox for Model 1

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (showControlsOnly) {
      // If only controls are to be shown, we skip the camera setup
      return;
    }

    let camera: { start: () => void; stop: () => void } | null = null;
    let hands: Hands | null = null;

    const startCamera = async () => {
      setIsProcessing(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          videoRef.current.onloadedmetadata = async () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;

              hands = new Hands({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
              });

              hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.6,
              });

              hands.onResults((results: Results) => { // Specify Results type
                if (hands && canvasRef.current && videoRef.current) {
                  const canvasCtx = canvasRef.current.getContext('2d');
                  if (canvasCtx) {
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    canvasCtx.translate(canvasRef.current.width, 0);
                    canvasCtx.scale(-1, 1);

                    if (!showLandmarksOnly) {
                      canvasCtx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                      );
                    }

                    if (results.multiHandLandmarks) {
                      for (const landmarks of results.multiHandLandmarks) {
                        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 1 });

                        let gestureDetected = 'None'; // Default to "None"
                        if (isModel1Checked) { // When checkbox is checked, use Model 1 (fist detection)
                          const isFist = detectFist(landmarks);
                          gestureDetected = isFist ? 'Jump' : 'None';

                          // key press
                          if (gestureDetected === 'Jump') {
                            const iframe = window.gameIframe; // Access the globally stored iframe reference
                            
                            if (iframe && iframe.contentWindow) {
                              iframe.focus();
                              
                              // Directly dispatch the keydown event within the iframe's context
                              iframe.contentWindow.document.dispatchEvent(new KeyboardEvent('keydown', {
                                key: ' ',
                                code: 'Space',
                                keyCode: 32,
                                bubbles: true,
                              }));
                              console.log('h');
                            }
                          }
                        }

                        if (showAccuracy) {
                          const confidenceScore = results.multiHandedness[0]?.score;
                          const confidence = confidenceScore !== undefined ? Math.round(confidenceScore * 100) : 0;
                          setAccuracyText(`Confidence: ${confidence}%`);
                          setGestureText(`Gesture: ${gestureDetected}`);
                        } else {
                          setAccuracyText('');
                          if (isModel1Checked) {
                            console.log(`Gesture: ${gestureDetected}`);
                          }
                        }
                      }

                      if (showAccuracy && !results.multiHandedness.length) {
                        setAccuracyText('Hands Not Detected.');
                        setGestureText('');
                      }
                    }
                    canvasCtx.restore();
                  }
                }
              });

              const CameraUtils = await import('@mediapipe/camera_utils');
              camera = new CameraUtils.Camera(videoRef.current, {
                onFrame: async () => {
                  if (hands && videoRef.current) {
                    await hands.send({ image: videoRef.current });
                  }
                },
                width: 640,
                height: 480,
              });

              camera.start();
            }
          };
        }
      }
      setIsProcessing(false);
    };

    const stopCamera = () => {
      setIsProcessing(true);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (hands) {
        hands.close();
        hands = null; 
      }

      if (camera) {
        camera.stop();
        camera = null; 
      }
      setIsProcessing(false);
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOn, showAccuracy, showLandmarksOnly, isModel1Checked, showControlsOnly]);

  // Render the full component if `showControlsOnly` is false
  return (
    <div>
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={isCameraOn}
            onChange={() => setIsCameraOn(prev => !prev)}
            disabled={isProcessing}
          />
          On/Off       
        </label>

        <label>
          <input
            type="checkbox"
            checked={showAccuracy}
            onChange={() => setShowAccuracy(prev => !prev)}
            disabled={!isCameraOn || isProcessing}
          />
          Show text
        </label>

        <label>
          <input
            type="checkbox"
            checked={showLandmarksOnly}
            onChange={() => setShowLandmarksOnly(prev => !prev)}
            disabled={!isCameraOn || isProcessing}
          />
          Video
        </label>

        <label>
          <input
            type="checkbox"
            checked={isModel1Checked}
            onChange={() => setIsModel1Checked(prev => !prev)}
            disabled={!isCameraOn || isProcessing}
          />
          Gesture
        </label>
      </div>

      {isProcessing && <p>Processing...</p>}
      <div style={{ position: 'relative' }} className='camera'>
        {isCameraOn && (
          <>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ width: '100%' }} />
          </>
        )}
        {showAccuracy && (accuracyText || gestureText) && (
          <p style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '20px',
          }}>
            {accuracyText}
            {gestureText && <><br />{gestureText}</>}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
