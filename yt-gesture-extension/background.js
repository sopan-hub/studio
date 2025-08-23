
// This service worker manages the state of the extension.
// It keeps track of which tabs have gesture control enabled.

let activeTabs = new Set();

// Listen for a click on the extension's icon in the toolbar.
chrome.action.onClicked.addListener(async (tab) => {
  // Toggle the activation state for the current tab.
  if (activeTabs.has(tab.id)) {
    // If it's active, deactivate it.
    activeTabs.delete(tab.id);
    // Update the icon and title to reflect the inactive state.
    await chrome.action.setIcon({ path: "icons/icon128.png", tabId: tab.id });
    await chrome.action.setTitle({ title: "Enable Gesture Control", tabId: tab.id });
  } else {
    // If it's inactive, activate it.
    activeTabs.add(tab.id);
    // Update the icon and title to reflect the active state.
    await chrome.action.setIcon({ path: "icons/icon-active.png", tabId: tab.id });
    await chrome.action.setTitle({ title: "Disable Gesture Control", tabId: tab.id });
  }

  // Execute the content script. This script acts as a bridge to inject the main
  // logic into the webpage. It will either inject for the first time or message
  // the already-injected script to toggle its state.
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch (err) {
    console.error(`Failed to execute script: ${err}`);
  }
});

// Clean up the activeTabs set when a tab is closed to prevent memory leaks.
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId);
});
