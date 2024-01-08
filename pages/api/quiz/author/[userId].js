import MongoDbClient from "../../../../utils/mongo_client";
import { QuizSchema } from "../../../../schemas";


export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuizzesByAuthor(req, res);
    }
}

async function getQuizzesByAuthor(req, res) {
    const { userId } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const quizzes = await QuizSchema.find({ authorId: userId });

        return res.status(200).json(quizzes);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'An error was encountered'
        });
    }  
}