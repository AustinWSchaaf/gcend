chrome.action.onClicked.addListener(function(tab) {
    chrome.action.setTitle({tabId: tab.id, title: "GCEND:" + tab.id});
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: 'run'}, (res) => {
            console.log(res);
            if (res === 'on') {
                chrome.action.setBadgeText({text: 'ON'});
                chrome.action.setBadgeBackgroundColor({color: "green"});
            }
            if (chrome.runtime.lastError) {console.log(chrome.runtime.lastError);}
        });
    });
    
    console.log('clicked');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (message === 'off') {
        chrome.action.setBadgeText({text: 'DONE'});
        chrome.action.setBadgeBackgroundColor({color: "red"});
        chrome.tabs.create({active: true, url: "https://gcend.com"}, (res)=> {
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });
        setTimeout(finished, 1000);
    }
    sendResponse('complete');
    if (chrome.runtime.lastError) {};
    return true;
});

function finished() {
    chrome.action.setBadgeText({text: ''});
    chrome.action.setBadgeBackgroundColor({color: "red"});
}
