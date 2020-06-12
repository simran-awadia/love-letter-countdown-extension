chrome.browserAction.onClicked.addListener(generateCount);

function generateCount() {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    function (tabs) {
      var tab = tabs[0];
      // send the message to the content script with the id of
      // the current tab to generate the counts
      chrome.tabs.sendMessage(tab.id, { message: "generate count" });
    }
  );
}
