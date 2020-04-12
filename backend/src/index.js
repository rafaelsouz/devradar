const express = require('express');
const mogoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const { setupWebSocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebSocket(server);

// Incluir sua conexão com banco.
mogoose.connect('mongodb+srv://<username>:<password>@cluster0-u4uat.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false,
    useCreateIndex: true,
});

app.use(cors())
app.use(express.json());
app.use(routes);

const PORT = 3333;
server.listen(PORT);