import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    passKey: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    }
})

const Users = mongoose.model('User', userSchema);

export default Users;
