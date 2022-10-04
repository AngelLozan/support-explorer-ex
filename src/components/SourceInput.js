/* global chrome */
import React from 'react';
import { useState } from 'react';
import '../styles/App.css';
import logo from './fella.png';
import eth from './eth.svg';
import xrp from './xrp.svg';
import btc from './btc.svg';


function SourceInput() {

    //const SEARCH_URL = 'https://blockchair.com/search?q=';

    const [showResults, setShowResults] = useState(); //@dev Used to hide or show results in popup. Inactive until search activated. 
    const [imgSrc, setImgSrc] = useState(); //@dev Used to set the URL for the iframe depending on regex match. Where to search the transaction hash. 
    const [imgUrl, setImgUrl] = useState();

    //@dev Used for populating UI response from Exodude image on popup when empty string is searched. 
    const emojis = ['✌️ Enter query', '🤔 I\'m listening', '🦾 I find things', '🚀 To the moon\!', '🤙 Query vibez', '🖖 Search ser', '👋 Hi there', '👾 Can I help?', '🧠 Query me', '🌈 Enter search', '✨ Shiny searches', '💫 Find a tx here'];
    const getRandomEmoji = () => {
        return emojis[~~(Math.random() * emojis.length)]
    };

    const link = async () => {
        chrome.tabs.create({ active: false, url: imgUrl })
    }

    const foundText = async () => {
        var snackbar = await document.getElementById("snackbar");
        snackbar.innerText = "I found one! Click the asset icon to open the explorer."
        snackbar.className = "show";
        setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); }, 1800);
    }


//@dev This will be the function to loop the dictionary and take the source variable as the hash. 
    async function hashDictionary(hash) {
     let chain = false;
     let hashRegex;
     let coinIcon;

     //@dev Dictionary for tx regexes, search parameters, chain and can add addresses.

     let hashRegexs = {
         "bitcoin": "^[0-9a-f]{64}$:btc",
         "ethereum": "^0x[0-9a-fA-F]{64}$:eth",
         "tezos": "^o[a-zA-Z0-9]{50}:tezos",
         "cardano":"9A-HJ-NP-Za-km-z]+:ada",
         "cardano":"addr1[a-z0-9]+:ada",
         "monero":"4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$:xmr",
         "stellar":"^G[A-Z0-9]{55}$:xlm",
         "ripple":"r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz]{27,35}$:xrp",

     }

     for (let keys in hashRegexs) {
         //@dev keys are the chains
         hashRegex = hashRegexs[keys].split(':')[0]; //@dev Get regex

         let regex = new RegExp(hashRegex, 'gi'); //@dev formats as regex.

         if (regex.test(hash)) {
             chain = keys;
             coinIcon = hashRegexs[keys].split(':')[1]; //@dev Get coin icon
             console.log("Coin icon is for: ", chain);
         } else {
             console.log("Not the right chain", keys);
         }
     };

 }


    const search = async () => {
        let source = document.getElementById('sourceInput').value
        console.log(source.length)

        if (source === null || source === undefined || !source) {
            var x = await document.getElementById("snackbar");
            x.innerText = `${getRandomEmoji()}`;
            x.className = "show";
            setTimeout(function() { x.className = x.className.replace("show", ""); }, 1100);
        } else if (/^0x[a-fA-F0-9]{40}$/.test(source)) {
            // Ethereum address
            //chrome.tabs.create({active: true, url: 'https://blockscan.com/address/' + source})
            let address = 'https://blockchair.com/search?q=' + source;
            console.log("setting Eth add.")
            await setImgSrc(eth);
            await setImgUrl(address);
            foundText();
            setShowResults(true);
        } else if (/^0x([A-Fa-f0-9]{64})$/.test(source)) {
            // Ethereum transaction
            //chrome.tabs.create({active: true, url: 'https://blockscan.com/tx/' + source})
            let address = 'https://blockscan.com/tx/' + source;
            console.log("setting Eth tx.")
            await setImgUrl(address);
            await setImgSrc(eth);
            foundText();
            setShowResults(true);
        } else if (/^r[1-9A-HJ-NP-Za-km-z]{25,33}$/.test(source)) {
            // XRP address
            //chrome.tabs.create({active: true, url: 'https://xrpscan.com/account/' + source})
            let address = 'https://blockchair.com/search?q=' + source;
            await setImgUrl(address);
            await setImgSrc(xrp);
            foundText();
            setShowResults(true);
        } else if (/^[A-F0-9]{64}$/.test(source)) {
            // XRP transaction
            //chrome.tabs.create({active: true, url: 'https://xrpscan.com/tx/' + source})
            let address = 'https://xrpscan.com/tx/' + source;
            await setImgUrl(address);
            await setImgSrc(xrp);
            foundText();
            setShowResults(true);
        } else {
            var x = await document.getElementById("snackbar");
            x.innerText = "😥 No results found for that query. Click me to reset."
            x.className = "show";
            setTimeout(function() { x.className = x.className.replace("show", ""); }, 1800);
            console.log('Not a valid address or transaction ID')
        }
    }

    return (
        <div className='sourceInputContainer'>
        <h2>Support Explorer</h2>
        <a href="" tabIndex="-1" title="Exodude loves you">
        <img class="animated bounce" style={{ width: "auto" , height:"2em" }} src={logo} />
        </a>
        <input autoFocus id='sourceInput' className='sourceInput' placeholder='Address or Transaction ID' tabIndex="1" selected></input>
        <button class = "searchBtn" onClick={search} tabIndex="2">Search</button> 

        {showResults && <div> 
        <br/>
        <a href={imgUrl} onClick={link} title="Chain icon(s)"> <img class="animated bounce" style={{ width: "auto" , height:"4em", marginBottom:"10px" }} src={imgSrc} /> </a> </div> }
        

        <div id="snackbar"></div>
    </div>
    )
}

export default SourceInput