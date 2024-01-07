import MongoDbClient from "../../../../utils/mongo_client";
import {QuizTakenSchema} from "../../../../schemas";
import { getSession } from "next-auth/react";


export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getMyQuizSubmissions(req, res);
    }
}

async function getMyQuizSubmissions(req, res) {
    const session = await getSession({ req });
    const userId = session?.user?._id;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const quizzes = await QuizTakenSchema
            .find({ 'userId': userId });

        return res.status(200).json(quizzes);

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'An error was encountered'
        })
    } finally {
        await db.disconnectClient();
    }
}