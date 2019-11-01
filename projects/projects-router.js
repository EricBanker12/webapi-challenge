const router = require('express').Router()
const projectModel = require('../data/helpers/projectModel')

// Routing
router.get('/', (req, res) => {
    projectModel.get()
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.post('/', validateProjectBody, (req, res) => {
    projectModel.insert(req.body)
    .then(resp => {
        // console.log(resp)
        res.status(201).json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

// middleware
function validateProjectBody(req, res, next) {
    const {name, description, completed} = req.body
    
    if (!req.body) {
        return res.status(400).json({message: 'missing body data'})
    }

    if (!name || typeof name !== 'string') {
        return res.status(400).json({message: 'missing required data field name: (String)'})
    }

    if (!description || typeof description !== 'string') {
        return res.status(400).json({message: 'missing required data field description: (String)'})
    }

    req.body = {name, description, completed: completed?true:false}
    next()
}

module.exports=router