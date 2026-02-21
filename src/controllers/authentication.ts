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