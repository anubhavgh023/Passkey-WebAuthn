import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    challenge: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Challenges = mongoose.model('Challenges', challengeSchema);

export default Challenges;