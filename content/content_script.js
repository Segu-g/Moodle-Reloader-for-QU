/*!
 * content_script.js v1.0.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 */

// namespace for this extension.
var Chrome_Extension = {};

// param parser
Chrome_Extension.getParams=(url)=>{
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params_dict = {};
    let match;
    while(match = regex.exec(url)){
        params_dict[match[1]] = match[2];
    }
    return params_dict;
}

// define course data Object
Chrome_Extension.course_data = Chrome_Extension.getParams(location.href);
Chrome_Extension.course_data.name = document.title.indexOf("コース: ")===0 ? document.title.substring(5):document.title ;
Chrome_Extension.url=location.href
Chrome_Extension.load_Date= {
    day:(new Date()).getDay(),
    hours:(new Date()).getHours(),
    minutes:(new Date()).getMinutes(),
    seconds: (new Date()).getSeconds()
}


// check whether the course is registerd or not.
Chrome_Extension.check_storage = ()=>{
    chrome.runtime.sendMessage(
        {mode: "get_storage", id: Chrome_Extension.course_data.id},
        function(response) {
            if(response.success){
                console.log(response)
                if(response["storage"]!=undefined&&response["storage"].length!=0){
                    console.log("This course is already registerd.");
                    console.log(response["storage"])
                    for(course_time in response["storage"]){
                        if(response["storage"][course_time].activated){
                            Chrome_Extension.wait_reload(response["storage"][course_time]);
                        }
                    }
                }else{
                    console.log("This course is not registerd.");
                    if(window.confirm("This course is not registerd. \n Do you go options page?")){
                        Chrome_Extension.register_course();
                    }
                }
            }else{
                console.log("fatal error happened in check_storage.");
            }
        }
    );
}


// wait until the course start.
Chrome_Extension.wait_reload = (course_data)=>{
    var load_Date = Chrome_Extension.load_Date;
    var course_Date=course_data.time;
    // console.log(load_Date);
    // console.log(course_Date);

    // calculate date1 - date2
    function calculate_sec_difference(date1,date2){
        var total_seconds_of_date1 = date1.hours * 3600 + date1.minutes * 60 + (date1.seconds|0);
        var total_seconds_of_date2 = date2.hours * 3600 + date2.minutes * 60 + date2.seconds|0;
        return  ((date1.day -date2.day + 7) %7) *86400 + total_seconds_of_date1-total_seconds_of_date2
    }

    if(Chrome_Extension.load_Date.day!=course_Date.day){
        if(!window.confirm("This course do not open today.\n Do you want to reload this course?")){
            return ;
        }
    }else if(calculate_sec_difference(course_Date,load_Date) <= 0){
        return;
    }
    let wait_time=calculate_sec_difference(course_Date,load_Date)*1000+10000;
    //prevent session timeout.
    const interval_time = (1000*60*30);
    var count = Math.floor(wait_time/interval_time);
    Interval_id = setInterval(function(){
        Chrome_Extension.reload_page();
        if(count-- == 0){
            clearInterval(Interval_id);
        }
    },interval_time);
    setTimeout(Chrome_Extension.reload_page,wait_time);
    console.log(course_Date.hours+"時"+course_Date.minutes+"分に更新を予定しました．")
}


// reload moodle page in background.
Chrome_Extension.reload_page = ()=>{
    chrome.runtime.sendMessage(
        {mode: "reload_page", url: Chrome_Extension.url},
        function(response){
            if(response.success){
                console.log("successed to reload moodle.");
            }else{
                console.log("faild to reload moodle.");
                alert("Sorry, faild to reload moodle. \nPlease reload this page manually.");
            }
        }
    );
}


// jump to setting page.
Chrome_Extension.register_course = ()=>{
    chrome.runtime.sendMessage(
        {mode: "options_page", id: Chrome_Extension.course_data.id, name: Chrome_Extension.course_data.name},
        function(response){
            if(response.success){
                console.log("successed to the options page.");
            }else{
                console.log("faild to open the options page.");
            }
        }
    );
}



//main
console.log(Chrome_Extension.course_data);
Chrome_Extension.check_storage();
