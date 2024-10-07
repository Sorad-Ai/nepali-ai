import { NormalizedLandmark } from '@mediapipe/hands';

/**
 * Detects if the hand is in a fist gesture except for the thumb.
 * Returns true if the landmarks of fingers (index, middle, ring, pinky) are below their respective knuckles.
 */
export function detectFist(landmarks: NormalizedLandmark[]): boolean {
  // Ensure that all required landmarks are available
  if (landmarks.length < 21) return false;

  // Check if landmarks 8, 12, 16, 20 (fingertips) are below landmarks 5, 9, 13, 17 (knuckles)
  const isFist =
    landmarks[8].y > landmarks[5].y &&  // Index finger
    landmarks[12].y > landmarks[9].y &&  // Middle finger
    landmarks[16].y > landmarks[13].y && // Ring finger
    landmarks[20].y > landmarks[17].y;   // Pinky finger

  return isFist;
}
