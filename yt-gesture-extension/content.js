
// This script is injected into the webpage but runs in an isolated world.
// Its purpose is to inject the main logic script ('page.js') into the actual page's context
// so it can interact with the DOM and load other libraries like MediaPipe.

(function() {
  // Check if the script has already been injected to prevent duplicates
  if (window.hasGestureControlInjected) {
    // If it is, toggle the existing controller instead of re-injecting
    window.postMessage({ type: 'TOGGLE_GESTURE_CONTROL' }, '*');
    return;
  }
  window.hasGestureControlInjected = true;

  // Inject the main logic script into the page
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('page.js');
  script.type = 'module'; // Use module type for modern JS features
  (document.head || document.documentElement).appendChild(script);

  // Inject the CSS for the overlay elements (cursor, instruction panel)
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('overlay.css');
  (document.head || document.documentElement).appendChild(link);

  console.log("Gesture Control content script loaded and injected page resources.");
})();
