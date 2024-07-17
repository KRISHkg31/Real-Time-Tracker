const express = require('express');
const app = express();

const http = require("http");
const path = require('path');

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Use express.static to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection
io.on("connection", function(socket) {
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data});
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnet",socket.id);
    });
});

// Route to render the index.ejs view
app.get("/", function(req, res) {
    res.render("index");
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
