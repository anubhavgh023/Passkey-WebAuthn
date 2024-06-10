import express from "express";

import {
    handleRegistration,
    createRegisterChallenge,
    verifyRegisterChallenge,
    createLoginChallenge,
    verifyLoginChallenge
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', handleRegistration);
router.post('/register-challenge', createRegisterChallenge);
router.post('/register-verify', verifyRegisterChallenge);

router.post('/login-challenge', createLoginChallenge);
router.post('/login-verify', verifyLoginChallenge);


export default router;