const router = require('express').Router()

const actionsModel = require('../data/helpers/actionModel')
// const projectModel = require('../data/helpers/projectModel')

// Routing
router.get('/', (req, res) => {
    actionsModel.get()
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.put('/:id', validateActionBody, validateActionId, (req, res) => {
    actionsModel.update(req.action.id, req.body)
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.delete('/:id', validateActionId, (req, res) => {
    actionsModel.remove(req.action.id)
    .then(resp => {
        // console.log(resp)
        res.sendStatus(204)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

// middleware
function validateActionId(req, res, next) {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
        return res.status(400).json({message: `id ${req.params.id} is not a number`})
    }

    actionsModel.get(id)
    .then(resp => {
        // console.log(resp)
        if (resp) {
            req.action = resp
            next()
        }
        else {
            res.status(404).json({message: `Action id ${id} was not found`})
        }
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
}

function validateActionBody(req, res, next) {
    const {description, notes, completed} = req.body
    
    if (!req.body) {
        return res.status(400).json({message: 'missing body data'})
    }

    if (!description || typeof description !== 'string' || description.length > 128) {
        if (description.length > 128) {
            return res.status(400).json({message: 'data field description: (String) exceeded 128 character limit'})
        }
        return res.status(400).json({message: 'missing required data field description: (String)'})
    }

    if (!notes || typeof notes !== 'string') {
        return res.status(400).json({message: 'missing required data field notes: (String)'})
    }

    req.body = {description, notes, completed: completed?true:false}
    next()
}

module.exports=router