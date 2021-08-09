// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({tasks: []}, 
                          function() {
                            console.log("This is the runtime.onInstalled event firing, it will initialize storage.sync with a 'tasks' array");
                            chrome.storage.sync.get(function(result){console.log(result)});//retrieve storage.sync records and print to console
                      });
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
