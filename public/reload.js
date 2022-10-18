async function refresher() {

    let buttonArray = await Array.from(document.querySelectorAll("[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div:nth-child(2) > button:nth-child(1)"));
    await buttonArray.forEach(element => clickIt(element));

    let titleArray = await Array.from(document.querySelectorAll("[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > span, [id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > fang-badge > div"));


    try {

        setTimeout(() => findNumber(titleArray), 2000);

    } catch (error) {
        console.log('Error in refresher function: ', error);
    }
}

function clickIt(e) {
    e.click();
}

function findNumber(titleArray) {
    let number;
    for (var i = 0; i < titleArray.length; i++) {
        if (titleArray[i].innerText == "Unread") {
            let item = titleArray[i + 1];
            number = item.innerText;
        }
    }

    chrome.runtime.sendMessage({
        action: "updateBadge",
        message: number
    })
}

refresher();