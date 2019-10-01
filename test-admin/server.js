const PORT=3001;
var express=require('express');
const http=require('http');
var socketIO=require('socket.io');
var app=express();
app.use(express.static('./'));
const server=http.createServer(app);
const io=socketIO(server,{path:'/ws'});
io.on('connection',function(socket){
console.log("websocket connected");
socket.on('ferret',function(name,word,fn){
fn(name+' says '+word);	
})
socket.on('remote-call', function(name,fn){
console.log('name: ', name);
console.log('name.action: ',name.action);
fn('hi');	
})
socket.on('disconnect', function(){
console.log('websocket closed');	
})
})


	
server.listen(PORT, function(){
console.log(PORT);
})
