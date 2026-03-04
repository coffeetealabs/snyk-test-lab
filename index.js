const express = require("express")
const insecure = require("./insecure")

const app = express()

// attach insecure routes
insecure(app)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})

module.exports = (app) => {

    // Eval vulnerability
    app.get("/eval", (req, res) => {
        const userInput = req.query.code
        const result = eval(userInput)
        res.send(String(result))
    })

    // SQL injection example
    function login(user, password) {
        const query = "SELECT * FROM users WHERE user='" + user + "' AND pass='" + password + "'"
        database.execute(query)
    }
}