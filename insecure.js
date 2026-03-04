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