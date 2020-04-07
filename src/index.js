const express = require('express')
const app = express()
const cors = require("cors")

const {
    uuid,
    isUuid
} = require('uuidv4')

app.use(express.json())
app.use(cors())

const projects = []

function logRequest(req, res, next) {
    const {
        method,
        url
    } = req

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel);
    // Necessario para que a aplicação continue, caso contrario o middleware ira 
    // interromper totalmentea  aplicaçao
    return next()
}

function validId(req, res, next) {
    const {
        id
    } = req.params

    if (!isUuid(id)) {
        return res.status(400).json({
            error: "Invalid ID."
        })
    }

    return next()
}

app.use(logRequest)

app.get('/projects', (req, res) => {
    const {
        title
    } = req.query

    const results = title ? projects.filter(project => project.title.includes(title)) : projects


    return res.json(results)
})
app.post("/projects", (req, res) => {
    const {
        title,
        owner
    } = req.body

    const project = {
        id: uuid(),
        title,
        owner
    }

    projects.push(project)
    return res.json(project)

})
app.put("/projects/:id", validId, (req, res) => {
    const {
        id
    } = req.params
    const {
        title,
        owner
    } = req.body

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return res.status(400).json({
            error: "Not Found"
        })
    }

    const project = {
        id,
        title,
        owner
    }
    projects[projectIndex] = project

    return res.json(project)
})
app.delete("/projects/:id", validId, (req, res) => {
    const {
        id
    } = request.params

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return res.status(400).json({
            error: "Not Found"
        })
    }
    projects.slice(projectIndex, 1)

    res.status(204).send()
})

app.listen(3333, () => {
    console.log("Backend iniciado")
})