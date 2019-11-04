var http = require('http');
var fs = require('fs');
const express = require('express');
const app = require('express')();

// Loading the file index.html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./test/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, username, data) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    socket.broadcast.emit('message', 'Another client has just connected!');

    // As soon as the username is received, it's stored as a session variable
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });


    // When a "message" is received (click on the button), it's logged in the console
    socket.on('message', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
    }); 

    startPriceChange(socket);
    startSelectionInactivity(socket);
    startPrice(socket);
    
});

const randomPrice = () => Math.floor(Math.random() * 9) + 1;
const ramdonBoolean = () => Math.random() >= 0.5;

const startPriceChange = socket => {
    setInterval(() => {
        let data = {
            timestamp: new Date().getTime(),
            type: 'price-change',
            selections: [
                {
                    id: 1,
                    price: randomPrice(),
                },
                {
                    id: 2,
                    price: randomPrice(),
                },
                {
                    id: 3,
                    price: randomPrice(),
                },
                {
                    id: 4,
                    price: randomPrice(),
                },
                {
                    id: 5,
                    price: randomPrice(),
                },
            ],
        }
        socket.emit('selections', data);
    }, 10000);
};

const startSelectionInactivity = socket => {
    setInterval(() => {
        let data = {
            timestamp: new Date().getTime(),
            type: 'state-change',
            selections: [
                {
                    id: 1,
                    active: ramdonBoolean()
                },
                {
                    id: 2,
                    active: ramdonBoolean()
                },
                {
                    id: 3,
                    active: ramdonBoolean()
                },
                {
                    id: 4,
                    active: ramdonBoolean()
                },
                {
                    id: 5,
                    active: ramdonBoolean()
                }
            ],
        }
        socket.emit('selections', data);
    }, 25000);
};

const startPrice = socket => {
    setInterval(() => {
        let data = {
            status: 'ok',
            timestamp: new Date().getTime(),
            eventName: 'those horses',
            selections: [
                {
                    id: 1,
                    name: 'Horse 1',
                    price: randomPrice(),
                    active: ramdonBoolean()
                },
                {
                    id: 2,
                    name: 'Horse 2',
                    price: randomPrice(),
                    active: ramdonBoolean()
                },
                {
                    id: 3,
                    name: 'Horse 3',
                    price: randomPrice(),
                    active: ramdonBoolean()
                },
                {
                    id: 4,
                    name: 'Horse 4',
                    price: randomPrice(),
                    active: ramdonBoolean()
                },
                {
                    id: 5,
                    name: 'Horse 5',
                    price: randomPrice(),
                    active: ramdonBoolean()
                }
            ],
        }
        socket.emit('fetch', data);
    }, 5000);
};


app.route('/rest/selections')
    .get((req, res) => {
        res.status(200).json(
            {
                status: 'ok',
                timestamp: new Date().getTime(),
                response: {
                    eventName: 'those horses',
                    selections: [
                        {
                            id: 1,
                            name: 'Horse 1',
                            price: randomPrice(),
                            active: ramdonBoolean()
                        },
                        {
                            id: 2,
                            name: 'Horse 2',
                            price: randomPrice(),
                            active: ramdonBoolean()
                        },
                        {
                            id: 3,
                            name: 'Horse 3',
                            price: randomPrice(),
                            active: ramdonBoolean()
                        },
                        {
                            id: 4,
                            name: 'Horse 4',
                            price: randomPrice(),
                            active: ramdonBoolean()
                        },
                        {
                            id: 5,
                            name: 'Horse 5',
                            price: randomPrice(),
                            active: ramdonBoolean()
                        },
                        
                    ]
                    
                }
                
            })
            
    });


server.listen(8080);