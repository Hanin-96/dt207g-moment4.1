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