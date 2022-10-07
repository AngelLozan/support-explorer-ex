/* global chrome */

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


   export default existingTabCheck;