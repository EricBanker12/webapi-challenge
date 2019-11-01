const router = require('express').Router()
const projectModel = require('../data/helpers/projectModel')

router.get('/', (req, res) => {
    projectModel.get()
    .then(resp => {
        console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

module.exports=router