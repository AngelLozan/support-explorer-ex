async function refresher() {
    let buttonArray = await Array.from(
        document.querySelectorAll(
            "[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div:nth-child(2) > button:nth-child(1)"
        )
    );

    console.log("Button array is: ", buttonArray);

    await buttonArray.forEach((element) => clickIt(element));

    let titleArray = await Array.from(
        document.querySelectorAll(
            "[id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > span, [id^='cdk-drop-list'] > engage-feed > engage-feed-toolbar > section > div.ui-flex > fang-badge > div"
        )
    );

    console.log('title array is: ', titleArray);

    try {
        //await findNumber(titleArray);
        setTimeout(() => findNumber(titleArray), 2000);
        
    } catch (error) {
        console.log("Error in refresher function: ", error);
    }
}

function clickIt(e) {
    e.click();
}

async function findNumber(titleArray) {

    let number;
    for (var i = 0; i < titleArray.length; i++) {
        if (titleArray[i].innerText == "Unread") {
            let item = await titleArray[i + 1];
            number = item.innerText;
        }
    }

    chrome.runtime.sendMessage({
        action: "updateBadge",
        message: number
    });
}

refresher();