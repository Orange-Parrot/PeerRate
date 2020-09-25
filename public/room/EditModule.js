const EditModule = (function(){
    
    return{

    }
})()
const ConnectionModule = (function(){
    
    var ws = new WebSocket("ws://"+window.location.hostname
    +':'+window.location.port
    );


    ws.onopen= function(){
        console.log(Constant.code);
        ws.send(Constant.isHost);//this script file is agonistic about its own status.
        //Server differtiate host and client by rendering different data onto different html
        ws.send(Constant.code);
        if(!Constant.isHost){
            ws.send(JSON.stringify({type:"partnername",payload:Constant.name}))//joiner send name immedietely after joining
            //host send name after joiner sent their name, in the handler
        }
        
    }
    const handlers = (function(){
        function receiveDragAdd(data){
            window.dispatchEvent(new CustomEvent("partner-draggadd",{detail:data}))
        }
        function receiveNextForm(data){
            window.dispatchEvent(new Event("partner-nextform"))
        }
        function receivePartnerName(name){
            document.querySelector(".partner-name").innerHTML=name;
            if(Constant.isHost){
                ws.send(JSON.stringify({type:"partnername",payload:Constant.name}))
            }
        }
        return{
            "dragadd":receiveDragAdd,
            "nextform":receiveNextForm,
            "partnername":receivePartnerName,
        }
    })()
    ws.onerror = function(e){
        console.log(e);
    }
    function receiveData(message){
        if(message.type === "error"||message.type === "close"){
            alert("error",JSON.stringify(message));
        }
        if(message.type==="dragadd"){
            ADDEDCARDINDEX++;
        }
        if(message.isHost == Constant.isHost){return}//differentiate messages, discard if sent by this client
        console.log(message.type);
        handlers[message.type](message.payload);
    }
    ws.onmessage = function(e){

    let message = e.data;
    console.log(e.data);
    var pos, text;

    receiveData(JSON.parse(e.data));
    //handlers[data.charAt(0)](data.slice(1));//use the first letter to distinguish message type, and pass the rest of the string to the handler function
    }
    function sendDragAdd(data){
        var content = JSON.stringify({
            type:"dragadd",
            payload:data
        });
        console.log(content);
        ws.send(content)//must send a string, else it would be sent as [Object object]
    }
    function sendNextForm(data){
        var content = JSON.stringify({
            type:"nextform"
        });
        console.log(content);
        ws.send(content)//must send a string, else it would be sent as [Object object]
    }
    (function selfEvent(){
        window.addEventListener("addcard",function(data){
            console.log(data);
            sendDragAdd(data.detail);
        })
        window.addEventListener("nextform",function(data){
            
            sendNextForm(data.detail);
        })
    })()


    return{

    }
})()