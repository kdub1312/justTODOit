// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//HOW TO UPLOAD TO CHROME WEB STORE:
//https://developer.chrome.com/webstore/publish

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    //STORAGE.SYNC
    chrome.storage.sync.set({tasks: []}, 
                          function() {
                            console.log("This is the runtime.onInstalled event firing, it will initialize storage.sync with a 'tasks' array");
                            chrome.storage.sync.get(function(result){console.log(result)});//retrieve storage.sync records and print to console
                      });
    
//    chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});
    
    //https://stackoverflow.com/questions/31126156/chrome-extensions-saving-multiple-ids-into-chrome-storage
    //https://stackoverflow.com/questions/11922964/how-do-i-view-the-storage-of-a-chrome-extension-ive-installed
    
    
    //https://stackoverflow.com/questions/7168362/run-script-each-time-chrome-extension-icon-clicked
    //chrome.browserAction.onClicked.addListener(function(tab) { console.log('icon clicked') });
    //https://stackoverflow.com/questions/31307514/chrome-extensions-icon-on-click/31308640
    
});
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {schemes: ['https']}//removed hostEquals: 'developer.chrome.com'
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });            
