const mongoose=require("mongoose");


let userSchema = new mongoose.Schema({

    userid:{
        type:String,
        required:true,
        unique:true,
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    }
});

const User = mongoose.model(
    "User",
    userSchema
);

module.exports = User;