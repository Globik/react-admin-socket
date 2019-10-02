const PORT=3001;
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const reqwest = require('request-promise-native');
const API_URL = "https://reqres.in/api/users?page=2";// hardcoded here,  надеюсь, я правильно понял задание
const DB_URL = "postgress://globik:null@localhost:5432/test";
// какое задание, такое и решение
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'globik', null, {dialect:'postgres',host:'localhost'});
const User=sequelize.define('nusers',{ // nuser! Not user!
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
console.log('name.action: ',name.action);
try{
let body = await reqwest({url: API_URL, method:"get"});
let dbody=JSON.parse(body);
let d={};
d.total=dbody.per_page;// чисто захардкожено, че там реакт админ требует , ожидает какие данные?
d.data=dbody.data;
//Users.destroy
// Это чистая порнография, в реальной жизни такой цикл c DB навряд ли кто применяет. Но задание есть задание.
// Я вообще в шоке
/*
d.data.forEach(function(el,i){
console.log('el: ',el);
Users.create({email: el.email, first_name: el.first_name, last_name: el.last_name, avatar: el.avatar}).then((data)=>{
console.log('data:', data);	
}).catch(err=>{console.log(err);})	
})
*/

User.create({email: d.data[0].email}).then(d=>{console.log(d)}).catch(er=>{console.log(er);})

fn(d);
}catch(e){fn(e);}	
})
socket.on('disconnect', function(){
console.log('websocket closed');	
})
})

sequelize.authenticate().then(()=>{
console.log('connection has been established successfully.');
User.sync({force: true}).then(()=>{
console.log('table created');// for a development mode is OK и для тестового задания тоже окей	
})
	
}).catch(err =>{
console.log('unable to connect to the database: ', err);	
})
	

	
server.listen(PORT, function(){
console.log(PORT);
})
