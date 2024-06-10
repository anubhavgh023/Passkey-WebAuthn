import mongoose from "mongoose";
import User from "../model/user.model.js";
import Challenges from "../model/challenges.model.js"
import {
    generateRegistrationOptions,
    generateAuthenticationOptions,
    verifyRegistrationResponse,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server"


//----------------- Registration ------------------------
async function handleRegistration(req, res) {
    const { firstName, lastName, email, password } = req.body;

    //check user exists
    const existsUser = await User.findOne({ email: email });
    if (existsUser) {
        return res.json({ error: "User already exists" });
    }

    try {
        const response = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        res.json({
            message: 'User successfully created',
            userId: response._id,
            success: true
        });

        console.log(`User successfully created!!`);

    } catch (error) {
        console.error("ERR:", error);
        return res.json({ error: 'Not able to create user', success: false });
    }
}

async function createRegisterChallenge(req, res) {
    const { email } = req.body;

    //check user exists
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.json({ error: "User does not exists!" });
    }

    const challengePayload = await generateRegistrationOptions({
        rpID: 'localhost',
        rpName: 'localhost',
        userName: email,
    })
    if (!challengePayload) {
        return res.json({ error: 'Unable to generate challenge' });
    }


    const response = await Challenges.create({
        email: email,
        challenge: challengePayload.challenge,
    })
    if (!response) {
        return res.json({ error: "Unable to Store Challenge" });
    }

    console.log(`Challenge successfully created!!`);
    res.json({ options: challengePayload });
}

async function verifyRegisterChallenge(req, res) {
    const { email, cred } = req.body; // cred -> authresult from frontend

    const { challenge } = await Challenges.findOne({ email: email });
    if (!challenge) {
        return res.json({ error: 'Challenge not found for the user' });
    }

    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:5173',
        expectedRPID: 'localhost',
        response: cred,
    })
    if (!verificationResult.verified) {
        return res.json({ error: 'User not verified' });
    }

    const addPasskeyToUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { passKey: verificationResult.registrationInfo } },
        { new: true },
    );
    if (!addPasskeyToUser) {
        return res.json({ error: 'Unable to add passkey to user' });
    }
    console.log('Challenge verified!!');
    return res.json({ message: 'User verification successful!', verified: true });
}

//---------------------- Authentication --------------------------
async function createLoginChallenge(req,res) {
    const { email } = req.body;
    const user = await User.find({ email });
    if (!user) {
        return res.json({ error: 'User not found' });
    }

    const options = await generateAuthenticationOptions({
        rpID: 'localhost',
    })

    try {
        
    } catch (error) {
        console.log('ERR:', console.error(error)); 
    }

}

async function verifyLoginChallenge() {

}

export {
    handleRegistration,
    createRegisterChallenge,
    verifyRegisterChallenge,
    createLoginChallenge,
    verifyLoginChallenge,
};
