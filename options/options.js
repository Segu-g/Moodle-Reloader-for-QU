/*!
 * options.js. v1.0.0
 *
 * Copyright (c) 2020 Segu
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 *
 * This page uses the CSP version of vue.
 * https://github.com/vuejs/vue/tree/csp/dist/vue.js
 *
 * Vue.js v1.0.28-csp
 * (c) 2016 Evan You
 * Released under the MIT License.
 */


function set_course(id,name,time,activated){
    chrome.storage.sync.get([id],function(result){
        if(Object.keys(result).length==0){
            chrome.storage.sync.set({[id]:[{name: name, time: time ,activated:activated}]},function(){
                page.drow_time_table(document.getElementById("timetable"));
            });
        }else{
            var flag=true;
            for(let num in result[id]){
                let target=result[id][num];
                if(target.time.hours==time.hours&&target.time.minutes==time.minutes&&target.time.day==time.day){
                    flag=false;
                    break;
                }
            }
            if(flag){
                result[id].push({name: name, time: time ,activated:activated})
                chrome.storage.sync.set({[id]:result[id]},function(){
                    page.drow_time_table(document.getElementById("timetable"));
                });
            }
        }
    });
}

function sync_get_all_courses(callback){
    chrome.storage.sync.get(null,callback);
}

function del_course(id,name,time){
    chrome.storage.sync.get([id],function(result){
        for(let num in result[id]){
            let target=result[id][num];
            if(target.time.hours==time.hours&&target.time.minutes==time.minutes&&target.time.day==time.day){
                result[id].splice(num,1);
            }
        }
        console.log(result[id]);
        chrome.storage.sync.set({[id]:result[id]},function(){
            page.drow_time_table(document.getElementById("timetable"));
        });
    });
}

function change_course(id,name,old_time,new_time){
    chrome.storage.sync.get([id],function(result){
        for(let num in result[id]){
            let target=result[id][num];
            if(target.time.hours==old_time.hours&&target.time.minutes==old_time.minutes&&target.time.day==old_time.day){
                result[id][num].time.day=new_time.day;
                result[id][num].time.hours=new_time.hours;
                result[id][num].time.minutes=new_time.minutes;
            }
        }
        console.log(result[id]);
        chrome.storage.sync.set({[id]:result[id]},function(){
            page.drow_time_table(document.getElementById("timetable"));
        });
    });
}

function getParams(url){
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params_dict = {};
    let match;
    while(match = regex.exec(url)){
        params_dict[match[1]] = match[2];
    }
    return params_dict;
}


document.onscroll = (e) => {
  this.position = document.documentElement.scrollTop || document.body.scrollTop;
}
params_obj=getParams(decodeURI(location.href))


var header = new Vue({
    el: '#header',
    data: {
        modes:[
            "Settings",
            "Registration",
            "Description"
        ],
        title: "Moodel Reloader for QU",
        accordion:false
    },
    methods:{
        move: function (mode){
            page.mode = mode;
            this.accordion = false;
            page.drow_time_table(document.getElementById("timetable"));
        }
    }
})


var page = new Vue({
    el: '#page',
    data: {
        Registration: {
            tab_state: "Register",
            day_options:[
                {text: "Sun.", value: 0},
                {text: "Mon.", value: 1},
                {text: "Tue.", value: 2},
                {text: "Wed.", value: 3},
                {text: "Thu.", value: 4},
                {text: "Fri.", value: 5},
                {text: "Sat.", value: 6}
            ],
            course_data:{
                id: null,
                name: null,
                day: null,
                hours: null,
                minutes: null,
                new_day: null,
                new_hours: null,
                new_minutes: null,
                error: false
            }
        },
        courses:{},
        mode: "Description"
    },
    methods: {
        format_checker:function(time){
            return (0<=time.Hours<24 && 0<=time.minutes<60 && 0<=time.day<7);
        },
        drow_time_table: function (canvas){
            function callback(courses_obj){
                var day_x = [100,170,240,310,380,450,520,590];
                var day_str = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var context=canvas.getContext('2d');
                var canvas_height=canvas.height;
                var canvas_width = canvas.width;
                context.clearRect(0, 0, canvas_width, canvas_height);
                for(let hour=7; hour<21; hour++){
                    context.font = "15px serif";
                    context.fillStyle = '#666';
                    context.fillText(hour+":00", 5, (hour-7)*30+40)
                }
                for(let i = 0; i < 7; i++){
                    context.fillStyle = '#666';
                    context.font = "15px serif";
                    context.strokeStyle = '#666';
                    context.fillText(day_str[i], day_x[i]-15, 20)
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(day_x[i],40);
                    context.lineTo(day_x[i],canvas_height-20);
                    context.stroke();
                    for(let hour=7; hour<21; hour++){
                        context.fillStyle = '#666';
                        context.beginPath();
                        let radius=2;
                        let startAngle= 0;
                        let endAngle = 2*Math.PI;
                        context.arc(day_x[i], (hour -7)*30 +40, radius, startAngle, endAngle, 0);
                        context.fill();
                    }
                }
                function time2pos(time){
                    return 40+((Number(time.hours)-7)*60+Number(time.minutes))*(canvas_height-60)/(13*60);
                }
                for(let course in courses_obj){
                    for(let data in courses_obj[course]){
                        let time=courses_obj[course][data].time;
                        let name=courses_obj[course][data].name;
                        let activated=courses_obj[course][data].activated;


                        if((7 <= time.hours < 22) || (time.hours == 22 && time.minutes==0)){
                            console.log(name);
                            context.beginPath();
                            let day=time.day;
                            let hour=time.hours;
                            let minute=time.minutes;
                            let radius=5;
                            let startAngle= 0;
                            context.fillStyle = '#00bfff';
                            let endAngle = 2*Math.PI;
                            context.arc(day_x[day],time2pos(time), radius, startAngle, endAngle, 0);
                            context.fill();
                        }
                    }
                    page.courses=courses_obj;
                }
            }
            sync_get_all_courses(callback);
        },
        show: function (event){
            var rect = event.target.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            var day_x = [100,170,240,310,380,450,520,590];
            var canvas_height= event.target.clientHeight;
            var canvas_width = event.target.clientWidth;
            console.log(x +" " +y);
            var i=0;
            var x_diff=0;
            var y_diff=0;
            for(i=0;i<7;i++){
                x_diff=Math.abs(day_x[i]-x);
                if(x_diff<=10){
                    break;
                }
            }
            console.log("day:"+i);
            if(i==7){
                return;
            }
            function time2pos(time){
                return 40+((Number(time.hours)-7)*60+Number(time.minutes))*(canvas_height-60)/(13*60);
            }
            var day_courses= this.sorted_courses_list[i];
            for(i in day_courses){
                console.log(day_courses[i]);
                console.log(time2pos(day_courses[i].time));
                y_diff = Math.abs(time2pos(day_courses[i].time)-y)
                console.log(i+"diff:"+x_diff+" "+ y_diff);
                if(Math.sqrt(x_diff**2+y_diff**2)<=10){
                    this.Registration.course_data.id=day_courses[i].id;
                    this.Registration.course_data.name=day_courses[i].name;
                    this.Registration.course_data.day=day_courses[i].time.day;
                    this.Registration.course_data.hours=day_courses[i].time.hours;
                    this.Registration.course_data.minutes=day_courses[i].time.minutes;
                    this.Registration.tab_state="Registerd";
                    return ;
                }
            }
        },
        register_course:function(){
            var id = this.Registration.course_data.id;
            var name = this.Registration.course_data.name;
            var day = this.Registration.course_data.day;
            var hours = Number(this.Registration.course_data.hours);
            var minutes = Number(this.Registration.course_data.minutes);
            if(id==undefined||
                name==undefined||
                day==undefined||
                hours==undefined||
                minutes==undefined){
                alert("Invalid input");
                return;
            }

            console.log("id:"+id);
            console.log("name:"+name);
            var time={
                day:Number(day),
                hours:Number(hours),
                minutes:Number(minutes)
            }
            if(!this.format_checker(time)){
                alert("The given time is not appropriate.");
                return;
            }
            console.log(time);
            set_course(id,name,time,true);
            alert("Registerd "+name);
            this.init_course_hold();
        },
        re_register_course:function(){
            var old_time={
                day:this.Registration.course_data.day,
                hours:this.Registration.course_data.hours,
                minutes:this.Registration.course_data.minutes
            };
            if(this.Registration.course_data.new_day==undefined||
                this.Registration.course_data.new_hours==undefined||
                this.Registration.course_data.new_minutes==undefined
            ){
                alert("Invalid input");
                return;
            }
            var new_time={
                day:Number(this.Registration.course_data.new_day),
                hours:Number(this.Registration.course_data.new_hours),
                minutes:Number(this.Registration.course_data.new_minutes)
            }
            if(!this.format_checker(new_time)){
                alert("The given time is not appropriate.");
                return;
            }
            change_course(
                this.Registration.course_data.id,
                this.Registration.course_data.name,
                old_time,new_time
            );
            alert("Registerd "+name);
            this.init_course_hold();

        },
        deleat_course:function(){
            var time={
                day:this.Registration.course_data.day,
                hours:this.Registration.course_data.hours,
                minutes:this.Registration.course_data.minutes
            }
            del_course(
                this.Registration.course_data.id,
                this.Registration.course_data.name,
                time
            );
            this.init_course_hold();
        },
        init_course_hold:function(){
            page.Registration.course_data.id=null;
            this.Registration.course_data.name=null;
            this.Registration.course_data.day=0;
            this.Registration.course_data.hours=0;
            this.Registration.course_data.minutes=0;
            page.Registration.tab_state="Register";
        },
    },
    computed:{
        sorted_courses_list: function(){
            let ret=[[],[],[],[],[],[],[]];
            for(let id in this.courses){
                for(let index in this.courses[id]){
                    ret[this.courses[id][index].time.day].push(this.courses[id][index]);
                    ret[this.courses[id][index].time.day][ret[this.courses[id][index].time.day].length-1].id=id;
                }
            }
            for(let i = 0; i < 7; i++){
                ret[i].sort(function(a,b){
                    function encode_min(time){
                        return time.hours*60-time.minutes;
                    }
                    return encode_min(a.time)-encode_min(b.time);
                })
            }
            return ret
        }
    }
})


if(params_obj.id){
    page.mode="Registration";
    page.Registration.course_data.id=params_obj.id;
    page.Registration.course_data.name=params_obj.name;
    page.drow_time_table(document.getElementById("timetable"));
}
