

import { UserSchema } from "../../../schemas";
import MongoDbClient from "../../../utils/mongo_client";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getUsers(req, res);
        case "POST":
            return createUser(req, res);
    }
}

async function createUser(req, res) {
    const db = new MongoDbClient();
    await db.initClient();

    try {
        const { name, email, isAdmin, password } = req.body;

        const existingUser = await UserSchema.findOne({ email });

        // Since email address has to be unique, check if it already exists
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        // Otherwise proceed to create new user

        const newUser = new UserSchema({
            name: name,
            email: email,
            isAdmin: isAdmin,
            createdAt: Date.now(),
            quizzesEnrolled: [],
            quizzesTaken: [],
        });

        newUser.setPassword(password);

        await newUser.save();

        return res.status(200).json({
            message: "We've successfully created your account",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err,
        });
    }  
}

async function getUsers(req, res) {
    const db = new MongoDbClient();
    await db.initClient();

    try {
        const users = await UserSchema.find({});

        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    }  
}