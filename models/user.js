const mongoose =require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    surname: String,
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    living: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'User'],
        default: 'User'
    }
});
module.exports = mongoose.model("User", userSchema);
