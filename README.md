# CSE Hackathon Support Explorer 

The first ever Customer Support (CS) dept. hackathon, and the very first CS department hackathon project that involves code. This project showcases the multi-talented department that is one of the important customer facing teams here at Exodus. While this tool is internal, it allows the team, as top leadership has mentioned, `to deliver value to our customers faster`.

This project creates an internal tool. A block explorer extension designed to fit the needs of a 100+ person team and reduce support latency. Search a transaction or address and the tool will match that address/TX with the correct chain out of 61 chains for searching addresses and 31 chains for searching transactions. More will/can be added.  


![Support Explorer Icon](https://github.com/AngelLozan/Block-Explorer-Hackathon-Idea-2/blob/main/public/SearchExo.png?raw=true)

## Installation

Run npm install upon cloing to your desired local directory.

Build with `npm run build`

*With the current version, please do not run an audit force fix. This demands different permissions to be set in order to comply with the CSP.*

(After build) Open chrome://extensions or brave://extension and upload the unpacked extension. 

## Use Case

See this section of Coda for reference: https://coda.io/d/Customer-Support-Hackathon_deARNEw7ms9/Browser-Extension-Support-Tool_suYtf#_luH-i.


## Authors

- Jamie M.
- Scott L. 

To Do: 

- Edge case for special characters to exclude? Exclude string under certain length (ex. Accidental typing in search box takes you to blockchair
- HBAR TX regex create.
