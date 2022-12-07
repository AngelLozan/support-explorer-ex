/* global chrome */


chrome.runtime.connect({ name: "contentScript" });


//@dev Instantiates function to inject button once page content is loaded.
const buttonScript = async () => {
    try {
        // let topBar = await document.querySelector("#mainUIView > div > ui-view > div.engage-nav-bar.eyas-background-white.eyas-border--bottom.eyas-layout.eyas-layout--middle.eyas-pr20.eyas-pl20.eyas-z-lowest > div.engage-navigation-view");

        let navBar = await document.querySelector("#falcon-sidebar-menu > nav > div > brandwatch-logo");

        let reloadButton = document.createElement("button");
        reloadButton.id = "reload";

        reloadButton.innerText = "♻️";

        navBar.parentNode.insertBefore(reloadButton, navBar.nextSibling);
        //topBar.replaceChild(reloadButton, topBar.childNodes[4]);


        reloadButton.focus();

        document.getElementById("reload").addEventListener("click", refresher);

        console.log("button injected! YAY");
    } catch (e) {
        alert("Oh no, the reload button didn't load! 🥲 Try refreshing the page and check your connection.")
        console.log("No button or timeout too short! ", e);
    }
};

//@dev Since page content loads after DOM and Window, check for loading element and if present set timeout to clear observer. 

function waitForDiv(querySelector, timeout) {
    return new Promise((resolve, reject) => {
        var timeoutSet = false;
        if (document.querySelectorAll(querySelector).length) return resolve();
        const observer = new MutationObserver(() => {
            if (document.querySelectorAll(querySelector).length) {
                observer.disconnect();
                if (timeoutSet !== false) clearTimeout(timeoutSet);
                return resolve();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        if (timeout) {
            timeoutSet = setTimeout(() => {
                observer.disconnect();
                reject();
            }, timeout);
        }
    });
}

waitForDiv("#falcon-sidebar-menu > nav > div > brandwatch-logo", 60000).then(buttonScript).catch(() => {
    alert("Button was unable to load after 60 seconds. I'll try refreshing the tab now. If that doesn't work, refresh the tab and check your internet connection.");
});



//@dev Edge case to account for, slow loading. First solution below. Mutation observer alternative verbiage (same ultimate effect but will load faster. 

// const buttonInject = async () => {
// 	let loading = document.getElementById("falcon-app-loader");

// 	if (loading) {
// 		setTimeout(() => buttonScript(), 10000);
// 		console.log("waiting on load button");
// 	} else {
// 		buttonScript();
// 		console.log("button script fired");
// 	}
// };

// //@dev Calls the above on load as defined in the manifest. 

// buttonInject();

// async function refresher() {
//     let buttonArray = await Array.from(
//         document.querySelectorAll(
//             "[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div:nth-child(2) > button:nth-child(1)"
//         )
//     );
//     await buttonArray.forEach((element) => clickIt(element));

//     let titleArray = await Array.from(
//         document.querySelectorAll(
//             "[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > span, [id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > fang-badge > div"
//         )
//     );

//     try {
//         setTimeout(() => findNumber(titleArray), 2000);
        
//     } catch (error) {
//         console.log("Error in refresher function: ", error);
//     }
// }

// function clickIt(e) {
//     e.click();
// }

// function findNumber(titleArray) {
//     let number;
//     for (var i = 0; i < titleArray.length; i++) {
//         if (titleArray[i].innerText == "Unread") {
//             let item = titleArray[i + 1];
//             number = item.innerText;
//         }
//     }

//     chrome.runtime.sendMessage({
//         action: "updateBadge",
//         message: number,
//     });
// }