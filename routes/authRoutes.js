//Routes for auth

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
//Token
const jwt = require("jsonwebtoken");

//Importerar user model
const User = require("../models/user")

//Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Connection to MongoDB failed");
});


//Route registrera ny user

router.post("/register", async (req, res) => {
    console.log("Register called...");
    try {
        const { username, firstname, lastname, email, password } = req.body;
        console.log("Work pls")
        //Validera input
        if (!username || !password || !firstname || !lastname || !email) {
            return res.status(400).json({ error: "Send username,password, firstname, lastname and email" });
        }

        //Correct input for user
        const user = new User({ username, firstname, lastname, email, password});
        console.log("user done")
        console.log(user)
        await user.save();
        console.log("user saved")


        res.status(201).json({ message: "User created" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//Login user
router.post("/login", async (req, res) => {
    console.log("login called...");

    try {
        const { username, password } = req.body;

        //Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Send username and password" });
        }

        //Validera inloggningsuppgifter
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ Error: "Incorrect username/password" });
        }


        //Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ Error: "Incorrect username/password" });
        } else {
            //Create JWT
            const payload = { username: username }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
            const response = {
                message: "user logged in",
                token: token
            }
            res.status(200).json({response})
        }

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})

//Skyddad route
router.get("/user", authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select("-_id firstname lastname username");
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({ error: error });
    }

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

//Exportera modulen
module.exports = router;