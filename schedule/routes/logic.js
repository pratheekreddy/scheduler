"use strict";
var express = require('express');
var router = express.Router();
var uuid=require('uuid');

router.post('/insert', (req, res) => {
	var connection=req.db;
	var values = req.body.array;

	var tag=[]
	for(let i=0;i<values.length;i++){

	tag[i]=value[i][0]
	}
	
	var tags = tag.map(d => `'${d}'`).join(',');
	
	var select='select TAG_ID,concat(TAG1,concat(TAG2,concat(TAG3,concat(TAG4,concat(TAG5,concat(TAG6,TAG7)))))) as tag from N_SCHEDULE_TAG_MASTER where concat(TAG1,concat(TAG2,concat(TAG3,concat(TAG4,concat(TAG5,concat(TAG6,TAG7))))))= in('+tags+')';
	console.log(select)
	
	connection.exec(select,(err, results) => {
		if(err){
			console.log(err)
		}else{
			if(results.length!=0){
				
			}else{
				var table1=[]
				for(let i=0;i<tag.length;i++){
				    table1[i]=tag[i].split(',')
				    table1[i].push(uuid.v4())
				    table1[i].push('domain')
				    table1[i].push('011')
				}
				console.log(table1)
				//insert
				let insert='INSERT INTO N_SCHEDULE_TAG_MASTER (TAG1,TAG2,TAG3,TAG4,TAG5,TAG6,TAG7,TAG8,TAG_ID,TAG_DOM,MANDT) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
				connection.prepare(insert,(err,statement)=>{
				if(!err){
				statement.exec(values, (err1, results) => {
										if (!err1) {
											console.log(results);
										//	res.send(results);
										} else {
											console.log(err1 );
											res.send(err1);
										}
									});
							}
							else{
								console.log(err);
								res.send('error in prepere');
							}
						});
			}
		}
	})

	
});
module.exports = router;