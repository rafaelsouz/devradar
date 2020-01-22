const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const parseCoordinatesAsLocation = require('../utils/parseCoordinatesAsLocation');
const { findConnections, sendMessage } = require('../websocket')

module.exports = {

    async index ( req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username });
    
        // Se um dev nao existir, ele vai criar um novo dev
        if (!dev) {
          const apiResponse = await axios.get(
            `https://api.github.com/users/${github_username}`
          );
    
          // Se o name nao existir ele vai pegar o login
          const { name = login, avatar_url, bio } = apiResponse.data;
    
          // Separa as tecnologias que estao em uma string por virgula, para se transformar em um array
          // O percorrer cada tecnologia e usar o trim, para remover espacamento antes ou depois de uma string
          const techsArray = parseStringAsArray(techs);
    
          const location = {
            type: "Point",
            coordinates: [longitude, latitude]
          };
    
          dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
          });

          const sendSocketMessageTo = findConnections(
            { latitude, longitude },
            techsArray
          );
    
          sendMessage(sendSocketMessageTo, "new-dev", dev);
        }
    
        return response.json(dev);
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