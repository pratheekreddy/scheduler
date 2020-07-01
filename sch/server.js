"use strict";
var http = require("http");
var port = process.env.PORT || 3000;
const CronTime = require('cron').CronTime;
const cronjob = require('cron').CronJob;
// const passport = require('passport');
var express = require("express");
// var xsenv = require("@sap/xsenv");
var bodyParser = require('body-parser');
// const HDBConn = require("@sap/hdbext");
const async = require("async");

const app = express();
app.use(bodyParser.json());

//-----------------------------------------------------------------------------------------------------

  var complete=function(){
      console.log('stopped...........');
  }

  var task=function(desc,time,key){
  	console.log(key+'---description---'+desc+'--time zone--'+time);
  }
const gjob = new Map();

app.post('/create', (req, res) => {
	
	var time=req.body.time;
	var key=req.body.key;
	var zone=req.body.zone;
	var desc=req.body.desc;
	var status=req.body.status;
	
	let ljob = new cronjob(time,function() {
                //console.log('this is function 1 and task '+time);
                task(desc,zone,key)
              }, complete, status, zone);
    var date =new Date();
    date=Date.now();
    let key1=key+'-'+date;
    gjob.set(key1,ljob);
    var response={
    	'jobid':key1,
    	'time':time
    };
	res.send(response);
	console.log('job created..'+key1);
 
})

app.post('/action', (req, res) => {
	let key=req.body.key ; //input -key+timestamp
	let act=req.body.action; //input -start or stop
//	console.log(key.toString()+'    '+act)
	if(act=='start'){
		gjob.get(key).start();
		console.log(key+'...started');
		var response={
			'key':key,
			'status':'started'
		};
		res.send(response);
	}
	else if(act=='stop'){
		gjob.get(key).stop();
		console.log(key+'....stopped');
		var response={
			'key':key,
			'status':'stopped'
		};
		res.send(response);
	}
	else{
		res.send('invalid action');
	}

})


app.post('/delete', (req, res) => {
	
	let key=req.body.key;
	
	for(let i=0;i<key.length;i++){
		gjob.get(key[i]).stop();
	let s=gjob.delete(key[i]);
	if(s==true){
		res.send('deleted sucessfully');
	}else{
		res.send('job doesnot exist');
	}
	}
})


app.get('/list', (req, res) => {
	
	let list=req.query.list; // input- start,all,stop
	let l=[];
	 if(list=='start')
	{
		console.log('list of running jobs');
		let i=1;
		var response;
		for(let key of gjob.keys()){
			if(gjob.get(key).running==true){
				console.log(i+'.........');
				i++;
				response={
					'key':key,
					'cronTime':gjob.get(key).cronTime.source,
					'lastExecution':gjob.get(key).lastDate(),
					'nextExecution':gjob.get(key).nextDates(1)
				};
				console.log(gjob.get(key).cronTime.source +' time ')
				console.log(key+' last executed date '+gjob.get(key).lastDate()+' next scheduled date '+gjob.get(key).nextDates(1))
				l.push(response)
			}
		}
	}
	else if(list=='stop'){
		let i=1;
		console.log('list of paused jobs');
		var response;
		for(let key of gjob.keys()){
			if(gjob.get(key).running==false){
				console.log(i+'.........');
				i++;
				response={
					'key':key,
					'cronTime':gjob.get(key).cronTime.source,
					'lastExecution':gjob.get(key).lastDate()
				};
				console.log(key+' is stopped');
				console.log(' last executed date '+gjob.get(key).lastDate());
				l.push(response);
			}
		}
	}
	else{			console.log('all jobs...........');
	let i=1;
	var response;
		for(let key of gjob.keys()){
				console.log(i+'.........');
				i++;
				response={
					'key':key,
					'cronTime':gjob.get(key).cronTime.source,
					'status':gjob.get(key).running,
					'lastExecution':gjob.get(key).lastDate(),
					'nextExecution':gjob.get(key).nextDates(1)
				};
				let {lastExecution,nextExecution}=response
				console.log(key+' last executed date '+lastExecution+' next scheduled date '+nextExecution);
				l.push(response);
		}
	}
	res.send(l);

})

app.post('/set', (req, res) => {
let	time=req.body.time;
let	key=req.body.key;
	time=time.toString();
	gjob.get(key).setTime(new CronTime(time));
	var response={
		'key':key,
		'new time':time
	};
	res.send(response);
})

app.post('/call', (req, res) => {
	let key=req.body.key;
	
	for(let i=0;i<key.length;i++){
    gjob.get(key[i]).fireOnTick();
}
	res.send('job fired');
})

app.post('/add', (req, res) => {
	
	let key=req.body.key;
	for(let i=0;i<key.length;i++){
    gjob.get(key[i]).addCallback(()=>console.log('callback added'));
}
	res.send('callback added');
	
})

app.post('/pop', (req, res) => {
	
	let key=req.body.key;
	for(let i=0;i<key.length;i++){
    gjob.get(key[i])._callbacks.pop();
}
	res.send('callback deleted');
	
})

app.listen(port, function () {
	console.log('myapp is using Node.js version: ' + process.version);
	console.log('myapp listening on port ' + port);
});