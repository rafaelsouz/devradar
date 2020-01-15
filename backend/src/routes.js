const { Router } = require('express');
const axios = require('axios')/
const Dev = require('./models/Dev')

const routes = Router();


routes.post('/devs', async ( req, res ) => {
    const { github_username, techs } = req.body;

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

    const { name = login, avatar_url, bio } = apiResponse.data;

    const techsArray = techs.split(',').map( tech => tech.trim() );
    
    await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray;
    });

    return res.json({ message: 'Hello Omnistack' })
});

module.exports = routes;