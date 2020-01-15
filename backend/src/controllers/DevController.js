const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const parseCoordinatesAsLocation = require('../utils/parseCoordinatesAsLocation');

module.exports = {

    async index ( req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store ( req, res ) {

        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev){
    
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs)
            
            const location = parseCoordinatesAsLocation(longitude, latitude)
        
            const dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            return res.json(dev)
        }
    
        return res.json(dev)
    },

    async update(req, res){

        const { github_username } = req.query;
        const { name, avatar_url, bio, techs, latitude, longitude } = req.body;

        console.log(github_username);
        
        let dev = await Dev.findOne({ github_username });

        if(dev){
            
            const techsArray = parseStringAsArray(techs)

            const location = parseCoordinatesAsLocation(longitude, latitude)

            const dev = await Dev.updateOne({
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            return res.json(dev)
        }

        return res.json({message: 'Dev não encontrado'});
    },

    async destroy(req, res){
        
        const { github_username } = req.query;

        let dev = await Dev.findOne({ github_username });

        if(dev){

            await Dev.deleteOne({github_username})
            
            return res.json({ message: "Dev deletado com sucesso" })
        }

        return res.json({ message: "Dev não encontrado" })
    },
}