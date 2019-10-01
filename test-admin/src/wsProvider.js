// https://github.com/apapacy/rpc-lesson/blob/master/src/wsProvider.js
import io from 'socket.io-client';

const socket = io({path: '/ws', transports: ['websocket']});

export default (action, collection, payload = {})=> 
new Promise((resolve, reject)=> {
socket.emit('remote-call', {action, collection, payload},(response)=>{
if(response.error){
reject(response);	
}else{
alert(response);
resolve({data:[{id:1}],total:1});	
}
}) 
})
