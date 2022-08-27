const mongoose = require("mongoose");


const authorSchema = new mongoose.Schema({
    
    name: { 
        type: String, 
        required: " Name is required", 
    },
    
    email: {
        type: String,
        unique: true,
        required: "Email is required",
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: "Password is required" 
    },
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema);