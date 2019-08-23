const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const CronJob = require('cron').CronJob;
const httpCall = require('./httpCall');
const config = require('./config.json');

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const RPC_PREFIX = 'http://';
const RPC_IP = config.RPC_SERVER;
var count = 0;
var ip = RPC_IP[count];
var RPC_URL = RPC_PREFIX + ip;

app.all('/', async (request, response)=> {

	const args = request.body;
	const res = await httpCall.call('POST', RPC_URL, args);
	response.json(res);
});

const job = new CronJob('*/30 * * * * *', async ()=> {
	console.log('Started Cron At:', new Date());
	RPC_URL = RPC_PREFIX + ip;
	var res = await httpCall.call('POST', RPC_URL, { jsonrpc: '2.0', id: 2, method: 'net_listening', params: [] });
	console.log("net_listening res: ", RPC_URL, res);
	if(!res.result) {
		count ++;
		ip = RPC_IP[count];
	}
	if(!res.result && RPC_IP.length == count) {
		count = 0;
		ip = RPC_IP[count];
	}
});
job.start();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

app.listen(8081, () => {
    console.log("server is running at 8081");
});
