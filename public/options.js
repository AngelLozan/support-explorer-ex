/* global chrome */

document.addEventListener('DOMContentLoaded', async () => {
    const image = document.getElementById('falcon');
    const button = document.getElementById('reload');

    document.getElementsByTagName('button')[0].focus();

    //These functions are what grab the timer time set and feed it to local storage. Calls change timer when element changes and thereby sends message to background. 
    let timer;

    let timerEl = document.getElementById('timer');

    chrome.storage.local.get(['timer'], result => timerEl.value = result.timer);
    timerEl.onchange = changeTimer;


    //@dev The event that clicks the load button in the popup.html file and calls the execute fuction from above which runs the injected script reload.js. Importantly, only runs in Falcon tab.
    document.getElementById('reload').addEventListener('click', execute);

    //@dev Moved chrome logic for this inside async function as API was too slow on occassion. 
    await getPageInfo(image, button);

});

//@dev Function to display page information properly and asynchronously.

async function getPageInfo(img, button){

    const query = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(query)
    console.log(tabs);
    try {

        //These set the popup.html elements to the found strings and images in the functions below.
        img.src = chrome.runtime.getURL('fella.png');
        button.innerText = await disable(tabs[0].title, tabs[0].url);
    } catch (e) {
        console.log("Reloader options.js error: ", e);
    }

}

//@dev Functionality behind drop down menu for timer. Stores value so persistent after closing extension (to remind you what interval you set).
//@dev Sends message to background based on your selection. 

function changeTimer(e) {
    chrome.storage.local.set({ timer: e.target.value }, () => console.log('Timer set: ' + e.target.value));
    chrome.runtime.sendMessage({ action: e.target.value });
    var x = document.getElementById("snackbar");
    if (e.target.value == "off") {
        x.innerText = "Ok, I've turned the timer " + e.target.value
    } else {
        x.innerText = "Ok, I've set a timer for " + e.target.value + " seconds"
    }
    // Add the "show" class to DIV
    x.className = "show";
    // After 1.5 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 1500);
}

//@dev Get's tabID so that you can use it in execute() function to specify where to run reload.js on click of the "load element" (see above DOMContentLoaded)
//@dev Fires only after opening popup and calling reload from popup

async function getTabId() {
    try {
        let queryOptions = { active: true, currentWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        if (/app.falcon.io/.test(tab.url)) {
            let tabD = tab.id;
            return tabD;
        } else {
            return;
        }
    } catch (e) {
        alert("Lost context, refresh the extension on brave://extensions to restore.");
        console.log(e);
    }
};

async function execute() {
    const tabId = await getTabId();

    var found = false;
    var tabbId;

try {
    if (tabId == null) {

        chrome.windows.getAll({ populate: true }, function(windows) {
            windows.forEach(function(window) {
                window.tabs.forEach(function(tab) {
                    if (tab.url.search("https://app.falcon.io/") > -1) {
                        found = true;
                        tabbId = tab.id;
                    }
                })
            })
            if (found == false) {
                chrome.tabs.create({ active: true, url: "https://app.falcon.io/#/engage/overview" });
            } else {
                chrome.tabs.update(tabbId, { selected: true });
                var x = document.getElementById("snackbar");

                x.innerText = `Falcon is now open in your other window ${getRandomEmoji()}`

                // Add the "show" class to DIV
                x.className = "show";
                // After 1.5 seconds, remove the show class from DIV
                setTimeout(function() { x.className = x.className.replace("show", ""); }, 1500);
            }
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['reload.js'],
        });
        var x = document.getElementById("snackbar");
        x.innerText = "Boop!";
        // Add the "show" class to DIV
        x.className = "show";
        // After 1.5 seconds, remove the show class from DIV
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 800);
    };
} catch(e) {
    console.log(e);
}
    
};

// These functions query the tab title and determine the text of the popup button, the exodude image and what-tab-you're-on string, respectively. 

const disable = async (tabTitle, tabUrl) => {
    let text;

    if (tabTitle.includes('Social Media Management') === true || tabUrl.includes('falcon.io') === true) {
        text = 'Reload';
    } else {
        text = 'Go to Falcon';
    }

    return text;
}



//These emoji arrays help the functions generate a random emoji and display it depending on if you're on falcon or not. 

const emojis = ['✌️', '💯', '🦾', '🚀', '🤙', '🖖', '👋', '👾', '🌤', '🌈', '✨', '💫', '💎', '🫶', '🫵'];

const wrongEmojis = ['⛔️', '🛑', '🚫', '🚩', '❌'];


const getRandomNoEmoji = () => {
    return wrongEmojis[~~(Math.random() * wrongEmojis.length)]
};

const getRandomEmoji = () => {
    return emojis[~~(Math.random() * emojis.length)]
};