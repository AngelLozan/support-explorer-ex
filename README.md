# CSE Hackathon Support Explorer 

The first ever Customer Support (CS) dept. hackathon, and the very first CS department hackathon project that involves code. This project showcases the multi-talented department that is one of the important customer facing teams here at Exodus. While this tool is internal, it allows the team, as top leadership has mentioned, `to deliver value to our customers faster`.

This project creates an internal tool. A block explorer extension designed to fit the needs of a 100+ person team and improve support latency. Search a transaction or address and the tool will match that address/TX with the correct chain out of 32 chains. 


![Support Explorer Icon](https://github.com/AngelLozan/Block-Explorer-Hackathon-Idea-2/blob/main/public/SearchExo.png?raw=true)

## Installation

Run npm install upon cloing to your desired local directory.

Build with `npm run build`

(After build) Open chrome://extensions or brave://extension and upload the unpacked extension. 

## Use Case

See this section of Coda for reference: https://coda.io/d/Customer-Support-Hackathon_deARNEw7ms9/Browser-Extension-Support-Tool_suYtf#_luH-i.


## Authors

Jamie M.
Scott L. 

To Do: 

- Edge case for special characters to exclude? Exclude string under certain length (ex. Accidental typing in search box takes you to blockchair
- Tron TX (and others) identified by final regex. How to mitigate? 
- HBAR TX regex create.
