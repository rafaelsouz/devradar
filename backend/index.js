const express = require('express');
const mogoose = require('mongoose');

const app = express();

mogoose.connect('mongodb+srv://omnistack:omnistack@cluster0-u4uat.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

app.use(express.json())

const PORT = 3333;

app.get('/', ( req, res ) => {
    return res.json({
        message: 'Hello Omnistack'
    })
});

app.listen(PORT);