const PORT=3001;
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const reqwest = require('request-promise-native');
const API_URL = "https://reqres.in/api/users?page=2";// hardcoded here,  надеюсь, я правильно понял задание
// какое задание, такое и решение
const DB_URL = "postgress://globik:null@localhost:5432/test";

const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'globik', null, {dialect:'postgres',host:'localhost',pool:{max:5,min:0,acquire:30000,idle:10000}});
const User=sequelize.define('nusers',{ // nuser! Not user! hardcoded
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey:true},
		email:{
		type:Sequelize.STRING	
		},
		first_name:{
		type:Sequelize.STRING	
		},
		last_name:{
		type:Sequelize.STRING	
		},
		avatar:{
		type:Sequelize.STRING	
		}});
		

const app=express();
app.use(express.static('./'));//default index.html , no template engine for the time being!
const server = http.createServer(app);
const io = socketIO(server,{path:'/ws'});
io.on('connection', function(socket){
console.log("websocket connected");

socket.on('remote-call', async function(name,fn){
console.log('name: ', name);
console.log('name.action: ',name.action);//hardcoded
try{
let body = await reqwest({url: API_URL, method:"get"});
let dbody=JSON.parse(body);
let d={};

// delete all users from nusers
await User.destroy({truncate:true});
let us=await User.bulkCreate(dbody.data, {returning: true});

d.data=us;
d.total=us.length;

fn(d);// socketio callback with data
}catch(e){fn(e);}	
})
socket.on('disconnect', function(){
console.log('websocket closed');	
})
})

sequelize.authenticate().then(()=>{
console.log('connection has been established successfully.');
User.sync({force: false}).then(()=>{

console.log('table created');// for a development mode is OK и для тестового задания тоже окей	
})
	
}).catch(err =>{
console.log('unable to connect to the database: ', err);	
})
	

	
server.listen(PORT, function(){
console.log(PORT);
})
