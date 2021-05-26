/*!
 * event.js. v1.0.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */


const INTERVAL = 5000;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Receive message"+ request.mode +".");
        switch (request.mode) {
            case "get_storage":
                get_storage(sendResponse,request.id);
                break;
            case "reload_page":
                reload_page(sendResponse,request.url);
                break;
            case "options_page":
                options_page(sendResponse,request.id,request.name);
                break;
            default:
            console.log("Error: Unkown request.")
            console.log(request);
            sendResponse({"success":false});
        }
        return true;
    }
);

function get_storage(sendResponse,id){
    chrome.storage.sync.get([id,],function(item){
        console.log("send" +item);
        console.log(item);
        console.log(id);
        sendResponse({"success":true,"storage":item[id]});
    })
}

function reload_page(sendResponse,url){
    chrome.tabs.create({"url": url, active: false},tab=>{
        setTimeout(function(){
            chrome.tabs.remove(tab.id);
            sendResponse({success:true});
        },INTERVAL);
    });
}

function options_page(sendResponse,id,name){
    chrome.tabs.create({ 'url': 'chrome-extension://'+ chrome.runtime.id +'/options/options.html?id='+id+"&name="+encodeURI(name)});
    sendResponse({success:true});
}
