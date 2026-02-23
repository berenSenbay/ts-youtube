import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['sessionToken'];

        if (!sessionToken) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
