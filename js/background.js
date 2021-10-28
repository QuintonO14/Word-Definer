var words;
//Get content script message and setup extension badge for the popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    words = request
    chrome.browserAction.setBadgeText({text: `${words.length}`})
    chrome.browserAction.setBadgeBackgroundColor({color : "rgb(50, 150, 220)"})
    sendResponse(words)
    return true; 
});

//Execute script for any active tab is selected
chrome.tabs.onActivated.addListener(function(active) {
    chrome.tabs.executeScript(active.tabId, {
      file: "js/script.js",
    }, () => {
      let error = chrome.runtime.lastError
      if(error !== undefined) {
        chrome.browserAction.setBadgeText({text: null})
      }
    })
});

//Execute script for any tab that is being updated
chrome.tabs.onUpdated.addListener(function(active) {
    chrome.tabs.executeScript(active.tabId, {
      file: "js/script.js",
    }, () => {
      error = chrome.runtime.lastError
      if(error !== undefined) {
        chrome.browserAction.setBadgeText({text: null})
      }
    })
});




