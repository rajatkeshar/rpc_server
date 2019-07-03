const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const httpCall = require('./httpCall')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//var RPC = ["40.84.190.109:22000", "104.214.75.244:22000", "13.66.7.222:22000", "40.74.237.182:22000", "13.66.54.153:22000"]
var RPC = ["52.170.31.29:22000", "40.127.0.188:22000", "51.145.102.229:22000", "104.46.228.248:22000"];
//var RPC = ["0.0.0.0:22000", "0.0.0.0:22006", "0.0.0.0:22012", "0.0.0.0:22018", "0.0.0.0:22024"]

//app.all('/api/node/rpc', async (request, response)=> {
app.all('/', async (request, response)=> {

	console.log(request.headers);
	var ip = RPC[Math.floor(Math.random() * RPC.length)];
	//console.log("ip:", ip);
	var args = request.body;
	//console.log(args);
	var result = await httpCall.call('POST', 'http://'+ip, args);
	//console.log(result);
	response.json(result);
});

app.listen(5000, () => {
    console.log("server is running at 5000");
});
