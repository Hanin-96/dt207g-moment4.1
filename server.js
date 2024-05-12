const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//Token
const jwt = require("jsonwebtoken");

// Aktivera CORS middleware för alla rutter
app.use(cors());
app.use(express.json());


//Starta igång server
app.listen(port, () => {
    console.log("servern är startad på port: " + port);
});

//Routes
app.use("", authRoutes);

//Skyddad route
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Skyddar route" });
});


//Validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Token

    if (token == null) {
        return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) {
            return res.status(403).json({ message: "Not correct JWT" });
        } else {
            req.username = username;
            next();
        }
    });
}                            