import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react";
import {UserSchema} from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getCachedQuiz(req, res);
    }
}

async function getCachedQuiz(req, res) {
    const session = await getSession({ req }); //using the current user session to get the userId(entityId)

    const db = new MongoDbClient();
    await db.initClient();

    // Now retrieve the questions from user document
    let user = await UserSchema.findById(session.user._id);
    let quizData = user.quizData;

    return res.status(200).json(quizData);
}