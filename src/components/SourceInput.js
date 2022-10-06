/* global chrome */
import { useEffect } from 'react';
import '../styles/App.css';
import logo from './fella.png';
import searchIcon from './magnifying-glass-solid.svg';
import validateSolAddress from './solana.js';
import validateSignature from './solSignature.js';

function SourceInput() {

    //@dev Used for populating UI response from Exodude image on popup when empty string is searched. 
    const emojis = ['✌️ Enter query', '🤔 I\'m listening', '🦾 I find things', '🚀 To the moon!', '🤙 Query vibez', '🖖 Search ser', '👋 Hi there', '👾 Can I help?', '🧠 Query me', '🌈 Enter search', '✨ Shiny searches', '💫 Find a tx here'];
    const getRandomEmoji = () => {
        return emojis[~~(Math.random() * emojis.length)]
    };


    const noCoinText = async () => {
        var snackbar = await document.getElementById("snackbar");
        snackbar.innerText = "😥 No results found. Click me to reset."
        snackbar.className = "show";
        setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 1800);
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
    //@dev After 1.5 seconds, remove the show class from DIV
    setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 1000);
}

//@dev Have not yet matched regex and url for these. 
// "algorand":"^[A-Z2-7]{58}$:algo", //@dev Just the address so far. Needs TX regex. 
// "tezos": "^o[a-zA-Z0-9]{50}:tezos", //@dev Only tx so far. 

    const search = async () => {
        let source = await document.getElementById('sourceInput').value
        console.log(source.length)

        if (source === null || source === undefined || !source) {
            var snackbar = await document.getElementById("snackbar");
            snackbar.innerText = `${getRandomEmoji()}`;
            snackbar.className = "show";
            setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 900);
        } else if (/^0x[a-fA-F0-9]{40}$/g.test(source)) {
            // EVM address
            chrome.tabs.create({active: true, url: 'https://debank.com/profile/' + source})
        } else if (/^0x([A-Fa-f0-9]{64})$/g.test(source)) {
            // EVM transaction
            chrome.tabs.create({active: true, url: 'https://blockscan.com/tx/' + source})
        } else if (/^r[1-9A-HJ-NP-Za-km-z]{25,33}$/g.test(source)) {
            // XRP address
            chrome.tabs.create({active: true, url: 'https://xrpscan.com/account/' + source})
        } else if (/^[A-F0-9]{64}$/g.test(source)) {
            // XRP transaction
            chrome.tabs.create({active: true, url: 'https://xrpscan.com/tx/' + source})
        } else if (await validateSolAddress(source) === true) {
            // SOL address
            chrome.tabs.create({active: true, url: 'https://solscan.io/account/' + source})
        } else if (await validateSignature(source)) {
            // SOL TX
            chrome.tabs.create({active: true, url: 'https://solscan.io/tx/' + source})
        } else if (/^T[A-Za-z1-9]{33}$/g.test(source)) {
            //TRX address
            chrome.tabs.create({active: true, url: 'https://tronscan.org/#/address/' + source})
        } else if (/^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-([a-z]{5}))?$/.test(source)) {
            //HBAR address
            chrome.tabs.create({active: true, url: 'https://app.dragonglass.me/hedera/accounts/' + source})
        } else if (/^[0-9a-f]{64}$|^[1-9A-HJ-NP-Za-km-z]+|^addr1[a-z0-9]+|4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$|^G[A-Z0-9]{55}$|^ltc[a-zA-Z0-9]{5,88}|^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$|^[7X][a-km-zA-HJ-NP-Z1-9]{26,33}$|^[9AD][a-km-zA-HJ-NP-Z1-9]{26,33}$|^([qp][qpzry9x8gf2tvdw0s3jn54khce6mua7l]{40,120}|^(bitcoincash)?[qp][qpzry9x8gf2tvdw0s3jn54khce6mua7l]{40,120})$|^bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87}|3[a-km-zA-HJ-NP-Z1-9]{25,34})$/g.test(source)){
            //Search blockchair for most of the other chains out of the total 18 chains provided.
            chrome.tabs.create({active: true, url: 'https://blockchair.com/search?q=' + source})
        } 
        //else if () {
            //@dev Placeholder for Algo TX
            //chrome.tabs.create({active: true, url: '' + source}) 
        //} else if () {
            //@dev Placeholder for Algo address
            //chrome.tabs.create({active: true, url: '' + source}) 
        //} else if () {
            //@dev Placeholder for tezo TX/address
            //chrome.tabs.create({active: true, url: 'https://tzstats.com/' + source}) 
        //} 
        else if (/^[0-9a-fA-F]{64}$/g.test(source)) {
            //blockchair tx general
            chrome.tabs.create({active: true, url: 'https://blockchair.com/search?q=' + source})
        } 
        else {
            noCoinText();
        }
    }

//@dev Calls the onload listener to populate the snackbar with a GM or the time greeting from Exodude. 
useEffect(() => {
    document.addEventListener('DOMContentLoaded', getTimeTitle())
    console.log("Loaded and triggered title")
}, []);

    return (
        
        <div class="wrapper">
        <form class="flex" action="https://blockchair.com/search" method="get" id="ExplorerAppForm">
            <a href="" class="extension__logo animated bounce" id="logo" tabindex="-1"> <img class="extension__logo--image" src={logo} alt="Exodude of course!" tite="exodude loves you" /></a>
            <input autoFocus id="sourceInput" class="extension__input" placeholder="Search a Transaction or Address for 32 different blockchains" data-toggle="tooltip" title="Search a Transaction or Address for 32 different blockchains." tabindex="1"></input>
            <button onClick={search} class="extension__search-btn" data-toggle="tooltip" place="embeded" title="Search for transactions, addresses, blocks, and even embedded text data." tabindex="2">
                <img class="landing__search-icon" alt="A magnifying glass" src={searchIcon}/>
            </button>
        </form>

        <div id="snackbar"></div>
        </div>
    )
}

export default SourceInput