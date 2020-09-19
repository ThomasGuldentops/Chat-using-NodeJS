const express = require("express");
const app = express();
const server = require("http").createServer(app).listen(8080);
const ent = require("ent");
const io = require("socket.io").listen(server);
const morgan = require('morgan')
const fs = require("fs")
const pathBuilder = require("path");
const publicDir = pathBuilder.join(__dirname, "/public");

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: 8080,
  user: "",
  password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//const soundPlayer = require('play-sound')({ player: "C:/Users/thoma/Downloads/mplayer-svn-38117/mplayer.exe" });
//const emoji = require('node-emoji');

/*
let mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
*/


//Public folder
app.use(express.static(publicDir));

//Style route
app.use(express.static(pathBuilder.join(publicDir, "style")));

//Scripts folder route
app.use(express.static(pathBuilder.join(publicDir, "scripts")));

//Songs folder
app.use(express.static(pathBuilder.join(publicDir, "sounds")));

//Image folder
app.use(express.static(pathBuilder.join(publicDir, "images/photo_profile/")));

//Logger
app.use(morgan('dev'));


//Routes
app.get("/", (req, res) => {
    res.render("client.ejs");
    res.end();
});



io.sockets.on("connection", (socket) => {
    socket.cptNotif = 0;

    console.log(" ------- \nClient Id: " + socket.id);
    //let allEmoji = JSON.parse("raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json");
    //console.log("All emojis : " + allEmoji.key);


    //get pseudo
    socket.on("pseudo", (pseudo) => {
        socket.pseudo = ent.encode(pseudo);


        //set a default profile picture
        socket.profilePicture = "images/photo_profile/default.svg";

        app.use((req, res, next) => {
            res.cookie("name", socket.pseudo);
            next();
        });

        io.emit("nouveau_client", { pseudo: socket.pseudo, message: socket.pseudo + " à rejoint le chat ! ", image: socket.profilePicture });
        console.log(pseudo + " à rejoint le chat ! ");
    });

    socket.on("resetNotification", () => {
        socket.cptNotif = 0;
        socket.emit("resetNotificationClient", socket.cptNotif); //problème de synchro ?
    });


    //receive message from a client
    socket.on("message_client", (message) => {
        message = ent.encode(message);
        io.emit("message_client", { pseudo: socket.pseudo, message: message, pictureProfile: socket.profilePicture });

        console.log("socket.cptNotif : " + socket.cptNotif);
        socket.cptNotif++;
        socket.broadcast.emit("newNotif", { cptNotif: socket.cptNotif, pseudo: socket.pseudo });
        /* soundPlayer.play("./public/sounds/notification.mp3", (err) => {
             if (err) console.log(`Could not play sound: ${err}`);
         });*/
    });

    //client has disconnected
    socket.on('disconnect', () => {
        io.emit("deconnexion_client", socket.pseudo + " s'est déconnecté ... ");
        console.log(socket.pseudo + " s'est déconnecté ... ");
    });

    //get all profile pictures
    socket.on("getAllPictures", () => {
        let path = pathBuilder.join(publicDir, "/images/photo_profile");

        fs.readdir(path, function (err, items) {
            let allPictures = [];
            console.log("items : " + items);

            for (let i = 0; i < items.length; i++) {
                allPictures.push(items[i]);
            }

            console.log("allPictures : " + allPictures);
            socket.emit("allPictures", allPictures);
            allPictures = [];
        });
    });

    socket.on("newAvatar", (newAvatar) => {
        socket.profilePicture = newAvatar;
        io.emit("changedAvatar", { pseudo: socket.pseudo, message: socket.pseudo + " a changé son avatar.", image: socket.profilePicture });
    });

}).on("error", (error) => {
    console.log("Error : " + error);
});

