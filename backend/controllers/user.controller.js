import User from "../model/user.model.js";
import Challenges from "../model/challenges.model.js"
import bcrypt from "bcrypt";
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server"


//----------------- Registration ------------------------

// Register User
async function handleRegistration(req, res) {
    const { email, password } = req.body;

    //check user exists
    const existsUser = await User.findOne({ email: email });
    if (existsUser) {
        return res.json({ error: "User already exists" });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const response = await User.create({
            email,
            password: hashedPassword
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

// Create Challenge for User on SignUp
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
    console.log('SignUP challenge: ', challengePayload.challenge);

    // store the user challenge in DB
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

// Verify Challenge
async function verifyRegisterChallenge(req, res) {
    // cred returned by startRegistration() from frontend
    const { email, cred } = req.body;

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
    console.log('Singup Challenge verified!!');
    return res.json({ message: 'User verification successful!', verified: true });
}

//---------------------- Authentication --------------------------
async function createLoginChallenge(req, res) {
    const { email } = req.body;
    const user = await User.find({ email });
    if (!user) {
        return res.json({ error: 'User not found' });
    }

    const challengePayload = await generateAuthenticationOptions({
        rpID: 'localhost',
    })

    try {

        // Set current Login Challenge
        const response = await Challenges.findOneAndUpdate(
            { email: email },
            { $set: { challenge: challengePayload.challenge } },
            { new: true },
        );
        if (!response) {
            return res.json({ error: "Unable to Store Challenge" });
        }

        console.log('Login challenge created !!');

        return res.json({
            options: challengePayload
        })


    } catch (error) {
        console.log('ERR:', console.error(error));
    }

}

async function verifyLoginChallenge(req, res) {
    console.log('Entered verify login challenge');
    // cred returned by startAuthentication() from frontend
    const { email, cred } = req.body;
    console.log('Email:', email);
    console.log("Cred:", cred);

    const { challenge } = await Challenges.findOne({ email: email });
    console.log('Challenge:', challenge);
    if (!challenge) {
        return res.json({ error: 'Challenge not found for the user' });
    };

    // Get The User
    const user = await User.findOne({ email });
    if (!user || !user.passKey) {
        return res.json({ error: 'User or passKey not found' });
    }
    console.log('Retrieved User PassKey: ', user.passKey);

    try {
        console.log('==== Verification Result Started =====')
        const verificationResult = await verifyAuthenticationResponse({
            expectedChallenge: challenge,
            expectedOrigin: 'http://localhost:5173',
            expectedRPID: 'localhost',
            response: cred,
            authenticator: user.passKey, 
        })
        console.log('VerificationResult ended');
        console.log('Verification Result:', verificationResult);
        // --------------
        // PENDING: JWT token,sessions
        //---------------

        console.log('Login verification done !!');
        return res.json({
            success: true,
            userID: user._id,
            message: "User Login Verified"
        });
    } catch (error) {
        console.error('Error during verification:', error);
        return res.json({ error: 'User not verified' });

    }

};

export {
    handleRegistration,
    createRegisterChallenge,
    verifyRegisterChallenge,
    createLoginChallenge,
    verifyLoginChallenge,
};
