const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


//Hasha lösenord innan den sparas
userSchema.pre("save", async function(next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }

        next();

    } catch (error) {
        next(error);
    }
});


//Compare hashed password
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}

//Inloggning User
//Endast username och password skickas in vid inloggning
userSchema.statics.login = async function(username, password) {
    try {
        const user = await this.findOne({ username });
        if (!user) {
            throw new Error("Incorrect username/password")
        }

        const isPasswordMatch = await user.comparePassword(password);

        //Incorrect password
        if (!isPasswordMatch) {
            throw new Error("Incorrect username/password")
        }

        //Correct
        return user;

    } catch (error) {
        throw error;
    }
};

const user = mongoose.model("user", userSchema);
module.exports = user;