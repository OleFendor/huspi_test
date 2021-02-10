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

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

/*exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        return result;
    });
};*/