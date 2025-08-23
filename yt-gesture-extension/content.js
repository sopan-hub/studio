
// This content script runs in an "isolated world" separate from the page's JavaScript.
// Its primary purpose is to inject the main logic script ('page.js') into the
// actual page's context, allowing it to interact with the DOM and use libraries
// loaded via CDN, like MediaPipe.

(function() {
  // Check if the script has already been injected to avoid duplication.
  // This is important because the extension icon can be clicked multiple times.
  if (window.hasGestureControlInjected) {
    // If it's already there, just send a message to the page script to toggle its state (on/off).
    window.postMessage({ type: 'TOGGLE_GESTURE_CONTROL' }, '*');
    return;
  }
  // Mark that the script has been injected.
  window.hasGestureControlInjected = true;

  // Create a <script> element to inject the main logic file.
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('page.js');
  script.type = 'module'; // Use 'module' to allow for import/export syntax.
  (document.head || document.documentElement).appendChild(script);

  // Create a <link> element to inject the CSS for the cursor and instruction panel.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('overlay.css');
  (document.head || document.documentElement).appendChild(link);

  console.log("Gesture Control: Content script loaded and injected page resources.");
})();
