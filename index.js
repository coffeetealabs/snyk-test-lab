const express = require("express")
const insecure = require("./insecure")

const app = express()

// attach insecure routes
insecure(app)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})