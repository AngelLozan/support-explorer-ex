/* global chrome */
import React from 'react'
import '../styles/App.css'
import logo from './fella.png';


function SourceInput() {

    //@dev Used for populating UI response from Exodude image on popup when empty string is searched. 
    const emojis = ['✌️ Enter query', '🤔 I\'m listening', '🦾 I find things', '🚀 To the moon\!', '🤙 Query vibez', '🖖 Search ser', '👋 Hi there', '👾 Can I help?', '🧠 Query me', '🌈 Enter search', '✨ Shiny searches', '💫 Find a tx here'];
    const getRandomEmoji = () => {
        return emojis[~~(Math.random() * emojis.length)]
    };

    async function search() {
        let source = document.getElementById('sourceInput').value
        console.log(source.length)

        if (source === null || source === undefined || !source) {
            var x = await document.getElementById("snackbar");
            x.innerText = `${getRandomEmoji()}`;
            x.className = "show";
            setTimeout(function() { x.className = x.className.replace("show", ""); }, 1800);
        } else if (/^0x[a-fA-F0-9]{40}$/.test(source)){
            // Ethereum address
            chrome.tabs.create({active: true, url: 'https://blockscan.com/address/' + source})
        }
        else if (/^0x([A-Fa-f0-9]{64})$/.test(source)){
            // Ethereum transaction
            chrome.tabs.create({active: true, url: 'https://blockscan.com/tx/' + source})
        }
        else if (/^r[1-9A-HJ-NP-Za-km-z]{25,33}$/.test(source)){
            // XRP address
            chrome.tabs.create({active: true, url: 'https://xrpscan.com/account/' + source})
        }
        else if (/^[A-F0-9]{64}$/.test(source)){
            // XRP transaction
            chrome.tabs.create({active: true, url: 'https://xrpscan.com/tx/' + source})
        }
        else {
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
        <img class="animated bounce" style={{ width: "auto" , height:"2em" }}src={logo} />
        </a>
        <input autoFocus id='sourceInput' className='sourceInput' placeholder='Address or Transaction ID' tabIndex="1" selected></input>
        <button class = "searchBtn" onClick={search} tabIndex="2">Search</button> 
        <div id="snackbar"></div>
    </div>
  )
}

export default SourceInput