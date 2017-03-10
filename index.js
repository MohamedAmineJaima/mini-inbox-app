// Dependencies
var http = require('http')
, express = require('express')
, app = express()
, server = http.createServer(app)
, io = require('socket.io')(server);


var bodyParser = require('body-parser');

var path = require('path');



// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Public Files
app.use(express.static(path.join(__dirname, 'www')));

// Template Engine Pug/EJS
app.set('view engine', 'ejs');

// Views Directory
app.set('views', 'www');

// FB chat API

var fs = require("fs");
var login = require("facebook-chat-api");

var credentials = {email: "EMAIL", password: "PASSWORD"};



// Routes


app.get('/', function(req, res){

  login(credentials, (err, api) => {
    if(err) return console.error(err);

    api.getThreadList(1,21, 'inbox' , (err,arr) => {

      //console.log(JSON.stringify(arr));

      var participantIDs = [];

      //console.log(arr[0]["participants"][0]);

      for (var i =0; i <  arr.length ; i++) {
        // array[i] = arr[i]['participantIDs'][0];
        participantIDs[i] = arr[i]['participantIDs'][0];
        
      }

      api.getUserInfo(participantIDs, (err, obj) => {
        if(err) return console.error(err);

          //console.log(obj);
          res.render('inbox',{
            names : obj,
            ids : participantIDs,
            thread : arr


          });

        });



    });

    //fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
  });

});

app.post('/search',function(req,res){

  //req.query.q


    var friends = JSON.parse(fs.readFileSync('friends.json', 'utf8'));

    
    var results = [];

    for(i=0;i<friends.length;i++){
      if(friends[i].fullName.toLowerCase().includes(req.body.key)){

        results.push({id:friends[i].userID,name:friends[i].fullName});

      }
    }

    //console.log(friends);

    res.send(results);


});

app.post('/contactClicked',function(req,res){

    login(credentials, (err, api) => {

    if(err) return console.error(err);

    

    api.getThreadInfo(req.body.id,function(err,info){


      //console.log(info['participantIDs'][1]);

      var obj = {fbid:info['participantIDs'][1],threadID:info['participantIDs'][0],messageCount:info['messageCount']}

      res.send(obj);



    });


  });

  

});

app.get('/:fbid?',function(req,response){

  login(credentials, (err, api) => {

    if(err) return console.error(err);

    var date = new Date();
    var timestamp = date.getTime();

    //console.log("threadID : "+req.query.threadID);
    //console.log("messageCount - 10: "+(req.query.messageCount -10));

    

    // api.setOptions({listenEvents: true});
    api.setOptions({selfListen: true});

    var stopListening = api.listen(function(err, event) {
      if(err) return console.error(err);

      api.markAsRead(event.threadID, (err) => {
        if(err) console.error(err);
      });


      if(event.type == "message" && event.threadID == req.query.threadID){

        console.log(event.body);
        io.emit('private', { msg: event.body ,senderID:event.senderID});

      }


    });

    api.getThreadHistory(req.query.threadID, req.query.messageCount - 20, req.query.messageCount , timestamp,function(err, history){

      console.log(history);

      var name;

      api.getUserInfo(req.query.threadID,(err, info) => {

      //console.log(info[req.query.threadID].name);

      if(info[req.query.threadID]){


       response.render('conversations',{
        messages : history,
        fbid : req.params.fbid,
        fbname : info[req.query.threadID].name,
        fbpic:info[req.query.threadID].thumbSrc,
        threadid:req.params.threadID

      });

      }



     });


    });
    
    

    
  });

  
});

app.post('/send',function(req,res){

  //console.log(req.body.msg);

  login(credentials, (err, api) => {
    if(err) return console.error(err);

    api.sendMessage({body:req.body.msg}, req.body.id);

    res.send("ok");


  });


}); 





app.post('/import',function(req,res){

  login(credentials, (err, api) => {
    if(err) return console.error(err);

    api.getFriendsList((err, data) => {
        if(err) return console.error(err);

        fs.writeFileSync('friends.json',JSON.stringify(data));

        res.send("ok");
    });



  });



});




// Start server
server.listen(3000);
console.log('API is running on port 3000');
