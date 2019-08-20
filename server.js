const express = require('express');

const UserRouter = require('./router');


const server = express();

server.use(express.json());
server.use('/api', UserRouter);

module.exports = server;