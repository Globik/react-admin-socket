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
		
var fake_user_list=[
{id:1,email:"a@ya.ru",first_name:"a",last_name:"b",avatar:"s.png"},
{id:2,email:"b@ya.ru",fist_name:"b",last_name:"c",avatar:"c.png"},
{id:3,email:"c@ya.ru",first_name:"c",last_name:"d",avatar:"d.jpg"}];
	
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
//d.total=dbody.per_page;// чисто захардкожено, че там реакт админ требует , ожидает какие данные?
//d.data=dbody.data;
//d.data=[];
// delete all users from nusers
await User.destroy({truncate:true});
let us=await User.bulkCreate(dbody.data, {returning: true});
console.log("SRESULT: ", us[0].id);
//d.total=us.length;
d.data=us;
d.total=us.length;
us.forEach(function(el,i){
//d.data.push({id:el.id,avatar:el.avatar});	
})
fn(d);
}catch(e){fn(e);}	
})
socket.on('disconnect', function(){
console.log('websocket closed');	
})
})

sequelize.authenticate().then(()=>{
console.log('connection has been established successfully.');
User.sync({force: false}).then(()=>{
	/*
User.destroy({truncate:true}).then(r=>{
console.log('res: ',r);//NaN

User.bulkCreate(fake_user_list,{returning:true}).then((result)=>{
console.log("RESULT: ", result[0].id);

result.forEach(function(el,i){console.log("BRRRESULT: ", el.id," ", el.email)})	
}).catch(e=>{console.log("er2: ",e);});
}).catch(e=>{
console.log('ERROR: ',e);
});
*/

console.log('table created');// for a development mode is OK и для тестового задания тоже окей	
})
	
}).catch(err =>{
console.log('unable to connect to the database: ', err);	
})
	

	
server.listen(PORT, function(){
console.log(PORT);
})
