/* global chrome */
import React from 'react';
import { useState } from 'react';
import '../styles/App.css';
import logo from './fella.png';
import eth from './eth.svg';
import xrp from './xrp.svg';
import btc from './btc.svg';


function SourceInput() {

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
        var x = await document.getElementById("snackbar");
        x.innerText = "I found one! Click the asset icon to open the explorer."
        x.className = "show";
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 1800);
    }

    const search = async () => {
        let source = document.getElementById('sourceInput').value
        console.log(source.length)

        if (source === null || source === undefined || !source) {
            var x = await document.getElementById("snackbar");
            x.innerText = `${getRandomEmoji()}`;
            x.className = "show";
            setTimeout(function() { x.className = x.className.replace("show", ""); }, 1800);
        } else if (/^0x[a-fA-F0-9]{40}$/.test(source)) {
            // Ethereum address
            //chrome.tabs.create({active: true, url: 'https://blockscan.com/address/' + source})
            let address = 'https://blockscan.com/address/' + source;
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
            let address = 'https://xrpscan.com/account/' + source;
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
        <a href={imgUrl} onClick={link} title="Chain icons"> <img class="animated bounce" style={{ width: "auto" , height:"2em" }} src={imgSrc} /> </a> </div> }
        

        <div id="snackbar"></div>
    </div>
    )
}

export default SourceInput