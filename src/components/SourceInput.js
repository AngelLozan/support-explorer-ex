/* global chrome */
import { useEffect } from 'react';
import '../styles/App.css';
import logo from './fella.png';
import spinner from './spinner-solid.svg';
import searchIcon from './magnifying-glass-solid.svg';
import validateSolAddress from './solana.js';
import validateSignature from './solSignature.js';
//import getAlgoData from './algoTx.js';
//import verifyTezTx from './tezTx.js';

function SourceInput() {


    //@dev Used for populating UI response from Exodude image on popup when empty string is searched. 
    const emojis = ['✌️ Enter query', '🤔 I\'m listening', '🦾 I find things', '🚀 To the moon!', '🤙 Query vibez', '🖖 Search ser', '👋 Hi there', '👾 Can I help?', '🧠 Query me', '🌈 Enter search', '✨ Shiny searches', '💫 Find a tx here'];
    const getRandomEmoji = () => {
        return emojis[~~(Math.random() * emojis.length)]
    };

//@dev Checks for tab open matching the URL or source (as part of the URL). Redirects/focuses on to that tab if opened, regardless of window.
    const existingTabCheck = async (URL, source) => {
       var found = false;
       var tabId;
       let focusedTab;
       let currentTab;

       try {
          await chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
               currentTab = tabs[0];
               if (currentTab.url.search(URL) > -1 || currentTab.url.search(source) > -1) {
                   focusedTab = currentTab;
               }
           });

          await chrome.windows.getAll({ populate: true }, function(windows) {
               windows.forEach(function(window) {
                   window.tabs.forEach(function(tab) {
                       if (tab.url.search(URL) > -1 || tab.url.search(source) > -1) {
                           found = true;
                           tabId = tab.id;
                       }
                   })
               })
               if (found == false) {
                   chrome.tabs.create({ active: true, url: URL + source });
               } else if (focusedTab == currentTab) {
                   var snackbar = document.getElementById("snackbar");
                   snackbar.innerText = "You're currently there ✅";
                   snackbar.className = "show";
                   snackbar.style.right = "50%";
                    setTimeout(function() { 
                        snackbar.className = snackbar.className.replace("show", ""); 
                        snackbar.style.right = snackbar.style.right.replace("50%", "60%")
                    }, 1500);
               } else {
                   chrome.tabs.update(tabId, { selected: true });
                   var snackbar = document.getElementById("snackbar");
                   snackbar.innerText = 'The explorer is now open in your other window 👀';
                   snackbar.className = "show";
                   snackbar.style.right = "20%";
                   setTimeout(function() { 
                        snackbar.className = snackbar.className.replace("show", ""); 
                        snackbar.style.right = snackbar.style.right.replace("20%", "60%")
                    }, 2500);
               }
           });
       } catch (e) {
           console.log(e);
       }
   }

   const lookUpText = async () => {
     var snackbar = await document.getElementById("snackbar");
        snackbar.innerText = "Multiple ⛓ Opening a new minimized window with explorers."
        snackbar.className = "show";
        snackbar.style.right = "10%";
        setTimeout(function() { 
            snackbar.className = snackbar.className.replace("show", ""); 
            snackbar.style.right = snackbar.style.right.replace("10%", "60%")
        }, 3000);
        
 }

    const noCoinText = async () => {
        var snackbar = await document.getElementById("snackbar");
        snackbar.innerText = "🤔 No results found. Click me to reset."
        snackbar.className = "show";
        snackbar.style.right = "40%";
        setTimeout(function() { 
            snackbar.className = snackbar.className.replace("show", ""); 
            snackbar.style.right = snackbar.style.right.replace("40%", "60%")
        }, 1500);
        console.log('Not a valid address or transaction ID')
    }

function getTimeTitle() {
    var snackbar = document.getElementById("snackbar");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (time >= "12:00:00" && time <= "17:00:00") {
        snackbar.innerText = "Good Afternoon! 🚀";
    } else if (time >= "17:00:01" && time <= "23:59:59") {
        snackbar.innerText = "Good Evening! 🌙";
    } else {
        snackbar.innerText = "GM! 🌤️"
    }
    snackbar.className = "show";
    setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 1000);
}

    const search = async () => {
        let source = await document.getElementById('sourceInput').value
        console.log(source.length)


        if (source === null || source === undefined || !source) {
            var snackbar = await document.getElementById("snackbar");
            snackbar.innerText = `${getRandomEmoji()}`;
            snackbar.className = "show";
            setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 900);
        } else if (/^tz[a-z0-9]{34}$|^o[a-z0-9]{50}$/gi.test(source)){ 
            //@dev Tezos address or transaction respectively.
            //chrome.tabs.create({active: true, url: 'https://tzstats.com/' + source}) 
            await existingTabCheck('https://tzstats.com/', source);
        } else if (/^[A-Z2-7]{58}$/g.test(source)) {
            //@dev Placeholder for Algo address
            //chrome.tabs.create({active: true, url: 'https://algoexplorer.io/address/' + source})
            await existingTabCheck('https://algoexplorer.io/address/', source) 
        } else if (/^[A-Z2-7]{52}$/g.test(source)) {
            //@dev Placeholder for Algo TX
            //chrome.tabs.create({active: true, url: 'https://algoexplorer.io/tx/' + source}) 
            await existingTabCheck('https://algoexplorer.io/tx/', source);
        } else if (/^0x[a-fA-F0-9]{40}$/g.test(source)) {
            //@dev EVM address
            //chrome.tabs.create({active: true, url: 'https://debank.com/profile/' + source})
            await existingTabCheck('https://debank.com/profile/', source);
        } else if (/^0x([A-Fa-f0-9]{64})$/g.test(source)) {
            //@dev EVM transaction
            //chrome.tabs.create({active: true, url: 'https://blockscan.com/tx/' + source})
            await existingTabCheck('https://blockscan.com/tx/', source);
        } else if (/^r[1-9A-HJ-NP-Za-km-z]{25,33}$/g.test(source)) {
            //@dev XRP address
            //chrome.tabs.create({active: true, url: 'https://xrpscan.com/account/' + source})
            await existingTabCheck('https://xrpscan.com/account/', source);
        } else if (await validateSolAddress(source) === true) {
            //@dev SOL address
            //chrome.tabs.create({active: true, url: 'https://solscan.io/account/' + source})
            await existingTabCheck('https://solscan.io/account/', source);
        } else if (await validateSignature(source)) {
            //@dev SOL TX
            //chrome.tabs.create({active: true, url: 'https://solscan.io/tx/' + source})
            await existingTabCheck('https://solscan.io/tx/', source);
        } else if (/^(cosmos)[a-z0-9]{39}$/g.test(source)) { 
            //@dev Atom Address
            //chrome.tabs.create({active: true, url: 'https://atomscan.com/accounts/' + source})
            await existingTabCheck('https://atomscan.com/accounts/', source);
        } else if (/^(bnb1)[a-z0-9]{38}$/g.test(source)) {
            //@dev BNB Beacon Address
            //chrome.tabs.create({active: true, url: 'https://binance.mintscan.io/account/' + source})
            await existingTabCheck('https://binance.mintscan.io/account/', source);
        } else if (/^T[A-Za-z1-9]{33}$/g.test(source)) {
            //@dev TRX address
            //chrome.tabs.create({active: true, url: 'https://tronscan.org/#/address/' + source})
            await existingTabCheck('https://tronscan.org/#/address/', source);
        } else if (/^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-([a-z]{5}))?$/.test(source)) {
            //@dev HBAR address
            //chrome.tabs.create({active: true, url: 'https://app.dragonglass.me/hedera/accounts/' + source})
            await existingTabCheck('https://app.dragonglass.me/hedera/accounts/', source);
        } else if (/^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-([a-z]{5}))?@?/.test(source)) {
            //@dev HBAR TXID
            const hbarID = source.replace(/[^a-zA-Z0-9]/g, "")
            //chrome.tabs.create({active: true, url: 'https://app.dragonglass.me/hedera/transactions/' + hbarID})
            await existingTabCheck('https://app.dragonglass.me/hedera/transactions/', hbarID);
        } else if (/^[1-9A-HJ-NP-Za-km-z]{59}$|^(addr1)[a-z0-9]+/g.test(source)) {
            //@dev Ada addresses
            await existingTabCheck('https://cardanoscan.io/address/',source)
        } else if (/4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$|^G[A-Z0-9]{55}$|^ltc[a-zA-Z0-9]{5,88}$|^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$|^[7X][a-km-zA-HJ-NP-Z1-9]{26,33}$|^[9AD][a-km-zA-HJ-NP-Z1-9]{26,33}$|^([qp][qpzry9x8gf2tvdw0s3jn54khce6mua7l]{40,120}|(bitcoincash)?[qp][qpzry9x8gf2tvdw0s3jn54khce6mua7l]{40,120})$|^bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})$|^1[a-km-zA-HJ-NP-Z1-9]{25,34}(?!\/)$|^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/g.test(source)){
            //@dev Most chains addresses. Needs to stay last so other regex's work. Includes LTC, XLM, DASH, DOGE, XMR, BCH and BTC derivations.
            //chrome.tabs.create({active: true, url: 'https://blockchair.com/search?q=' + source})
            await existingTabCheck('https://blockchair.com/search?q=', source);
        } else if (/^[0-9a-fA-F]{64}$/g.test(source)) {
            //@dev Transaction Window for Multiple chains (So far: Tron, ATOM, UTXOs, BNB beacon chain, XRP, ADA)
            let urlArray = [('https://blockchair.com/search?q=' + source),('https://tronscan.org/#/transaction/' + source),('https://binance.mintscan.io/txs/' + source),('https://atomscan.com/transactions/' + source), ('https://xrpscan.com/tx/' + source), ('https://cardanoscan.io/transaction/'+ source)];
            //@dev Opens new, unfocused and minimized window with all the tabs in array and matching the source.
            await lookUpText();
            chrome.windows.create({ focused: false, state: "minimized", url: urlArray });
        } else {
            noCoinText();
        }
        
    }

//@dev Loading div for reference, not implemented. Css present. <div id="loading" class="loading"><img src={spinner} />

//@dev Calls the onload listener to populate the snackbar with a GM or the time greeting from Exodude. 
useEffect(() => {
    document.addEventListener('DOMContentLoaded', getTimeTitle())

}, []);

    return (
        
        <div class="wrapper">
        <form class="flex" action="https://blockchair.com/search" method="get" id="ExplorerAppForm">
            <a href="" class="extension__logo animated bounce" id="logo" tabindex="-1"> <img class="extension__logo--image" src={logo} alt="Exodude of course!" tite="exodude loves you" /></a>
            <input autoFocus id="sourceInput" class="extension__input" placeholder="Search a Transaction or Address for 50 different blockchains" data-toggle="tooltip" title="Search a Transaction or Address for 50 different blockchains." tabindex="1"></input>
            <button onClick={search} class="extension__search-btn" data-toggle="tooltip" place="embeded" title="Search for transactions, addresses, blocks, and even embedded text data." tabindex="2">
                <img class="landing__search-icon" alt="A magnifying glass" src={searchIcon}/>
            </button>
        </form>


        <div id="snackbar"></div>
        </div>
    )
}

export default SourceInput