const http = require('http')
const fs = require('fs')
const express = require ('express')
var path = require('path');
var ws = require("ws")
const mustache = require("mustache-express");
const { json } = require('express');
const eventEmitter = require("events").EventEmitter;
var app = express()
app.use(express.static('public'));
app.engine('html', mustache(__dirname + '/partials', '.mst'));
app.set('view engine', 'html');
app.disable('view cache');
const port = 80
try{
    var server = app.listen(port, (error) => {
        if(error){
            console.log("Something went wrong...", error)
        } else {
            console.log("Server is listening on port ", port)
        }
    })
    
}
catch(e){
    console.log(e);
}
// set up to listen on a port

app.get('/', (req, res) => {
    console.log("hello")
    res.render("index",{});
})
app.get("/host", function(req,res){
    var {name,code} = req.query;
    console.log(code);
    res.render("host",{name,code:code});

})
app.get("/join",function(req,res){
    var {name,code} = req.query;
    res.render("joiner",{name,code:code});
})
var allRooms = {};
var roomChanges = {};
var wsServer = new ws.Server({server:server});
wsServer.on('connection', function connection(ws) {
    try{
  function listener(msg){
    if(ws.OPEN){
      console.log(msg);
      ws.send(msg)
    }
  }
  function close(){
    if(ws.OPEN){
      console.log("closed event listener call,client closing at room id: " + ws.classroomID);
      ws.send(JSON.stringify({type:"close"}));
      ws.terminate();
    }
  }

  function initializationFunctions(){
      function initializeRole(message){
        console.log(typeof ws.isHost);
        ws.isHost = (message=="true");
      }
      function initializeRoomCode(message){
        ws.roomID = message;
        console.log("id",message);
        if(ws.isHost){
          handleCreateRoom(message);
        }else{
          handleJoinRoom(message)
        }
    
      }
      
      return [initializeRole,initializeRoomCode];
  }

  var initializationSequence = initializationFunctions();
  var step = 0;
  ws.on('message', function incoming(message) {
    //console.log("message:" +message);
    if(step< initializationSequence.length){
      initializationSequence[step](message);
      step++;
    }
    else{
      if(ws.isHost){
        hostChange(message);

      }
      else{
        joinerChange(message);
     
      }
    }
  });

function joinerChange(message){
    var packet = {
        isHost:false,
        ...(JSON.parse(message)),//use parse to convert the string to an object
  }
allRooms[ws.roomID].eventEmitter.emit("broadcast",JSON.stringify(packet));
}

  function hostChange(message){
      var packet = {
            isHost:true,
            ...(JSON.parse(message)),
      }
    allRooms[ws.roomID].eventEmitter.emit("broadcast",JSON.stringify(packet));
  }
  function handleCreateRoom(message){
    console.log(message);
    if(allRooms[message]){console.log( "attempting to create from ID" + message+", this code room already exist"); ws.send(JSON.stringify({type:"error"}));}
else{
      allRooms[message] = {};
      allRooms[message].changes = [];
      allRooms[message].eventEmitter = new eventEmitter();
      allRooms[message].eventEmitter.on("broadcast",listener);
   
    }
  }
  function handleJoinRoom(message){
   // console.log(allRooms);
    if(!allRooms[message]){ console.log( "coderoom not open"); return ws.terminate()}
    else{
      allRooms[message].eventEmitter.on("broadcast",listener);
      allRooms[message].eventEmitter.on("close",close)
    }
    //console.log(allRooms);
  }
  ws.on("close", function(){
      
    if(ws.isHost === undefined){return};
    if(ws.isHost){allRooms[ws.roomID].eventEmitter.emit("close");    allRooms[ws.roomID].eventEmitter.removeListener("broadcast",listener)//remove it from chat roomdelete allRooms[ws.roomID];
        delete allRooms[ws.roomID];
    }   
    else{
      if(allRooms[ws.roomID]){

      
      allRooms[ws.roomID].eventEmitter.removeListener("broadcast",listener)//remove it from chat room
      allRooms[ws.roomID].eventEmitter.removeListener("close",close)//remove it from chat room}
      }
    }

  })
}
catch(e){
    console.log(e);
}

});