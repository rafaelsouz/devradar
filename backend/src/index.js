const express = require('express');
const mogoose = require('mongoose');
const routes = require('./routes');

const app = express();

mogoose.connect('mongodb+srv://omnistack:omnistack@cluster0-u4uat.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

app.use(express.json());
app.use(routes);



const PORT = 3333;
app.listen(PORT);