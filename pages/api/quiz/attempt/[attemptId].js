import MongoDbClient from "../../../../utils/mongo_client";
import { QuizTakenSchema, ResponseSchema } from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getResponses(req, res);
    }
}

async function getResponses(req, res) {
    const db = new MongoDbClient();
    await db.initClient();
    
    const { attemptId } = req.query;
    
    try {
        let quizTaken = await QuizTakenSchema
            .findOne({ "attemptId": attemptId });
        quizTaken = quizTaken.toJSON();

        let attemptInfo = new Object();
        attemptInfo.score = quizTaken.score;
        attemptInfo.userId = quizTaken.userId;
        attemptInfo.quizId = quizTaken.quizId;
        attemptInfo.attemptId = quizTaken.attemptId;
        attemptInfo.quizTitle = quizTaken.quizTitle;

        let responses = await ResponseSchema
            .find({ "attemptId": attemptId });

        responses = responses.map((item) => item.toJSON());
        attemptInfo.responses = responses;

        return res.status(200).json(attemptInfo);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    }  
}