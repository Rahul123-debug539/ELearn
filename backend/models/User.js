const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },

    github:{
        type:String,
        default:""
    },

    linkedin:{
        type:String,
        default:""
    },

    totalLikes:{
        type:Number,
        default:0
    },

    totalViews:{
        type:Number,
        default:0
    },

    totalApprovedArticles:{
        type:Number,
        default:0
    },

    resetOTP:{
        type:String
    },

    otpExpiry:{
        type:Date
    }
},
{timestamps:true}
);

module.exports = mongoose.model("users", userSchema);