import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';
import express from 'express';


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.status(200).json(user).end();



    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');;
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('sessionToken', user.authentication.sessionToken, { domain: process.env.DOMAIN, httpOnly: true, secure: true });
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};