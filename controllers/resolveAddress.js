const Address = require('../models/Address')
const store = require('../data/store')
const axios = require('axios')

const getLocationData = async (searchTerm) => {
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchTerm}&format=json&apiKey=${process.env.GEO_API_KEY}`).catch(e => e)
    return result.data
}

exports.resolveAddress = async (req, res) => {
    const formatSearchTerm = (searchTerm) => {
        let formatted = searchTerm.replace(/ /g, '%20').replace(/,/g, '%2C')
        return formatted
    }
    const searchTerm = formatSearchTerm(req.body.searchTerm)
    const result = await getLocationData(searchTerm)
    if (result.results.length) {
        const street = result.query.parsed.street
        const line1 = result.results[0].address_line1
        const line2 = result.results[0].address_line2
        const postcode = result.results[0].postcode
        const country = result.results[0].country
        store.address[result.results[0].place_id] = new Address(street, line1, line2, country, postcode)

    }
    console.log(store.address)
    res.status(200).send('resolved')
}


