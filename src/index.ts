import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}))
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router());

const server = http.createServer(app);

const uri = "mongodb+srv://admin:adminpassword@cluster0.owymary.mongodb.net/?appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log("Successfully connected to MongoDB");
    server.listen(8080, () => {
        console.log('Server is running on http://localhost:8080');
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});


