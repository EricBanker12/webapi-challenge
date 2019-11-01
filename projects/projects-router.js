const router = require('express').Router()

const actionsModel = require('../data/helpers/actionModel')
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

router.put('/:id', validateProjectBody, validateProjectId, (req, res) => {
    projectModel.update(req.project.id, req.body)
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.delete('/:id', validateProjectId, (req, res) => {
    projectModel.remove(req.project.id)
    .then(resp => {
        // console.log(resp)
        res.sendStatus(204)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.post('/:id/actions', validateActionBody, validateProjectId, (req, res) => {
    actionsModel.insert({...req.body, project_id: req.project.id})
    .then(resp => {
        // console.log(resp)
        res.status(201).json(resp)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
})

router.get('/:id/actions', validateProjectId, (req, res) => {
    projectModel.getProjectActions(req.project.id)
    .then(resp => {
        // console.log(resp)
        res.json(resp)
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

function validateProjectId(req, res, next) {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
        return res.status(400).json({message: `id ${req.params.id} is not a number`})
    }

    projectModel.get(id)
    .then(resp => {
        // console.log(resp)
        if (resp) {
            req.project = resp
            next()
        }
        else {
            res.status(404).json({message: `Project id ${id} was not found`})
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