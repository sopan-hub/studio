
let activeTabs = new Set();

chrome.action.onClicked.addListener(async (tab) => {
  if (activeTabs.has(tab.id)) {
    // If active, deactivate it
    activeTabs.delete(tab.id);
    await chrome.action.setIcon({ path: "icons/icon128.png", tabId: tab.id });
    await chrome.action.setTitle({ title: "Enable Gesture Control", tabId: tab.id });
  } else {
    // If inactive, activate it
    activeTabs.add(tab.id);
    await chrome.action.setIcon({ path: "icons/icon-active.png", tabId: tab.id });
    await chrome.action.setTitle({ title: "Disable Gesture Control", tabId: tab.id });
  }

  // Execute the content script, which will either inject for the first time
  // or message the already-injected page script to toggle its state.
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch (err) {
    console.error(`Failed to execute script: ${err}`);
  }
});

// Clean up when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId);
});
