# mini-inbox-app

#Description
This project uses the Facebook Chat API from : https://github.com/Schmavery/facebook-chat-api
which is an unofficial API (an emulation of the browser) that gives access to Facebook conversations etc. 
Since The official one gives only access to page's conversations. 
The only inconvenient to use this API is we have to enter our Facebook credentials instead of the Access Token.

For realtime message reception it uses WebSockets (socket.io) from : https://socket.io/

<b>Frontend</b> : AngularJS

<b>Backend</b> : NodeJS, ExpressJS (ejs as template engine).


#Setup
<code>git clone https://github.com/toshiro94/mini-inbox-app.git</code>

Edit the file <code>index.js </code>(root directory) in line 35 and enter our credentials (FB EMAIL and PASSWORD).

Execute : <code>node index.js</code>




