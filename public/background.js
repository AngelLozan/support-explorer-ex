chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed background script.");
});

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "contentScript") {
        console.log("Listener for port added")
        port.onDisconnect.addListener(function() {
            let query = { url: '*://app.falcon.io/*' };
            chrome.tabs.query(query, (tabs) => {
                if (tabs.length === 0) {
                    console.log("No Falcon tabs open or API call response too slow.")
                    return;
                }
                let tabId = tabs[0].id;
                chrome.tabs.reload(tabId);
                console.log("Content script has been disconnected. Reloaded tab.")
            });
        })
    }
})



// API calls to alarms are to periodically unhide content when tab is active. 
//Listener gets message from popup.js when appropriate button is clicked, clears previous alarms and sets new one.

chrome.runtime.onMessage.addListener((request) => {

    if (request.action == "15") {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create("fifteen", { periodInMinutes: 0.25 })
            console.log("15 second refresh on")
        })
    }

    if (request.action == "30") {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create("thirty", { periodInMinutes: 0.5 })
            console.log("30 second refresh on");
        })
    }

    if (request.action == "45") {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create("fourty", { periodInMinutes: 0.75 })
            console.log("45 second refresh on")
        })
    }

    if (request.action == "60") {
        chrome.alarms.clearAll(() => {
            chrome.alarms.create("sixty", { periodInMinutes: 1 })
            console.log("60 second refresh on")
        })
    }

    if (request.action == "off") {
        chrome.alarms.clearAll();
        chrome.action.setBadgeText({ text: '' });
        console.log("Auto refresh turned off")
    }
})

// Alarm interval. Set to 45 seconds here.
//chrome.alarms.create('refresh_Feeds', { periodInMinutes: 0.5 });

// Timer to call reload on interval. Looks for url match pattern and calls injected script. 
chrome.alarms.onAlarm.addListener(() => {
    let query = { url: '*://app.falcon.io/*' };

    chrome.tabs.query(query, (tabs) => {
        if (tabs.length === 0) {
            console.log("No Falcon tabs open or API call response too slow.")
            return;
        }
        let tabId = tabs[0].id;
        // Need this function to call reload
        chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            files: ['reload.js'],
        })
        console.log("Alarm fired, good job.");

    })

});


//Updates all the feeds when the tab is reloaded and when entering and exiting feed items. Specific to urls that contain "falcon.io". 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /app.falcon.io/.test(tab.url)) {
        chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: ['reload.js'],
            })
            .then(() => {
                console.log("Feeds reloaded. Enter/Exit comment.");
            })
            .catch(err => console.log(err));
    }
});

// Scrapes Unread feed item for number of unread items every time reload script is injected. Sets badge text based number of unread items (new tweets/comments/ect.)
chrome.runtime.onMessage.addListener((request) => {
    if (request.action == "updateBadge") {
        if(request.message == undefined){
            chrome.action.setBadgeText({ text: '' });
        } else if (request.message <= 0){
           chrome.action.setBadgeText({ text: '' });
        } else if(request.message > 2) {
            chrome.action.setBadgeBackgroundColor({color: "#f25252"});
            chrome.action.setBadgeText({ text: String(request.message) }) ;
        } else {
            chrome.action.setBadgeBackgroundColor({color: "#ACCEF7"});
            chrome.action.setBadgeText({ text: String(request.message) }) ;
        }
        console.log('Badge set');
    }
});




