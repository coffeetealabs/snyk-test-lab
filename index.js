const express = require("express")
const insecure = require("./insecure")
const { divide } = require("lodash")
const { divide2 } = require("./calculator")

const app = express()

// attach insecure routes
insecure(app)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})

divide2(2,0)
