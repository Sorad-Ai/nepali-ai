// global.d.ts
export {};

declare global {
  interface Window {
    gameIframe: HTMLIFrameElement | null; // Declare the custom property
  }
}
