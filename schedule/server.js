/*eslint no-console: 0*/
"use strict";

var http = require("http");
var port = process.env.PORT || 3000;
const CronTime = require('cron').CronTime;
const cronjob = require('cron').CronJob;
const passport = require('passport');
var express = require("express");
var xsenv = require("@sap/xsenv");
var bodyParser = require('body-parser');
const HDBConn = require("@sap/hdbext");
const async = require("async");

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

const app = express();
app.use(
	HDBConn.middleware(hanaOptions.hana)
);

app.use(bodyParser.json());
app.use("/logic", require("./routes/logic"));
var task = function () {
	//task1()
	//  console.log(db)
	console.log('this is function 1 and task ');

}

//var task1=function(params) {
// console.log('call '+params);
//}

var complete = function () {
	console.log('stopped...........');
}

var update = function (x, y, conn) {

	x = x.toLowerCase();
	y = y.toLowerCase();
	let qu;
	qu = "update N_SCHEDULE_JOBCREATE set created=1,status=0 where jobtype='" + y + "' and module='" + x + "'";


	conn.exec(qu, (err1, results) => {
		if (!err1) {
			console.log(results);
			//	insert(x,y,conn);
		} else {
			console.log(err1 );
		}
	});



}

// var job = new cronjob(first,task, complete, false, 'Asia/Kolkata');
var gjobarr = {};

app.get('/create', (req, res) => {
	// var Jtype=req.body.type;
	console.log('create started...');
	var rs;
	var conn = req.db;
	var query =
		'SELECT JOBTYPE,	MODULE,CRONTIME,STARTTIME,STOPTIME,PARAMS,ENABLED,CREATED FROM "N_SCHEDULE_JOBCREATE"';
	conn.exec(query, (err11, results) => {
		if (!err11) {
			console.log(results[0]);
			rs = results;
			for (let i = 0; i < rs.length; i++) {
				var en = rs[i]['ENABLED'];
				var cr = rs[i]['CREATED'];
				if (en == 1 && cr == 0) {
					var time = rs[i]['CRONTIME'];
					var params = rs[i]['PARAMS'];
					var mod = rs[i]['MODULE'];
					var type = rs[i]['JOBTYPE'];
					console.log(type);
					switch (type) {
					case 'procedure':
						var ljob = new cronjob(time, function () {
							console.log('CALL "exhdb_bms.stored_procedure.' + rs[i]['PARAMS']+' cron time-'+rs[i]['CRONTIME']);
							//task1(params);
						}, complete, false, 'Asia/Kolkata');
					//	update(mod, type, conn);
						ljob.start();
						gjobarr[mod] = ljob;

						break;
					case 'URL':
						console.log('case 2.....' + time);
						var ljob = new cronjob(time, task, complete, false, 'Asia/Kolkata');
						gjobarr[mod] = ljob;
						update(mod, type, conn);

						// res.send('job created');
						break;
					default:
						console.log('default');
					}
				} else {
					console.log('already created');
					//	res.send('all jobs are already created');
				}
			}
			res.send('job created');
		} else {
			console.log(err11);
		}
	});

});

app.get('/list', (req, res) => {
	let conn=req.db;
	let qu="SELECT * FROM N_SCHEDULE_JOBCREATE";
	conn.exec(qu, (err1, results) => {
		if (!err1) {
			console.log(results);
			res.send(results);
		} else {
			console.log(err1);
		}
	});
	console.log(gjobarr);
})

//TOD: API TO DELETE JOB COMPLETLY 
 app.get('/delete', (req, res) => {
 	res.send('yet to implement');
 });

var updateflag = function (x, y, f, conn) {
	// x = x.toLowerCase();
	// y = y.toLowerCase();
	let qu = "update N_SCHEDULE_JOBCREATE set status=" + f + " where jobtype='" + y + "' and module='" +x + "'";
	conn.exec(qu, (err1, results) => {
		if (!err1) {
			console.log(results);
		} else {
			console.log(err1);
		}
	});
}

app.get('/start', (req, res) => {
	var mod = req.body.mod;
	//global.db=req.body.db
	var type = req.body.type;
	var conn = req.db;
	console.log(mod);
	gjobarr[mod].start();
	   updateflag(mod,type,1,conn);
	res.send('cron started');
})

app.get('/stop', (req, res) => {

	var mod = req.body.mod;
	var type = req.body.type;
	var conn = req.db;
	gjobarr[mod].stop();

	   updateflag(mod,type,0,conn);
	res.send('cron stopped');

})


app.get('/set', (req, res) => {
	var time = req.body.time;
	var mod = req.body.mod;
	console.log(time);
	time = time.toString();
	//TODO:IMPLEMENT UPDATE OF CRONTIME IN JOBS ENTITY. --> TAKE IT NEXT CHANGES
	gjobarr[mod].setTime(new CronTime(time));
	res.send('time changes');
});

app.listen(port, function () {
	console.log('myapp is using Node.js version: ' + process.version); //new line
	console.log('myapp listening on port ' + port);
});