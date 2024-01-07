

import { getSession } from "next-auth/react";
import { QuizSchema } from "../../../schemas";
import MongoDbClient from "../../../utils/mongo_client";

export default async function handler(req, res){
    switch(req.method){
        case "GET":
            return myAuthoredQuizzes(req, res);
    }
}

async function myAuthoredQuizzes(req, res){
    const db = new MongoDbClient();
    await db.initClient();

    const session = await getSession({req})
    console.log(session)
    const userId = session?.user?._id;
    console.log(userId)
    try {
        const quizzes = await QuizSchema.find({authorId: userId})
        console.log(quizzes)
        return res.status(200).json(quizzes)

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message:`An error was encountured`
        })
    } finally {
        await db.disconnectClient();
    }
}