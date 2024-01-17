import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react";
import {QuestionSchema, QuizSchema, UserSchema} from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getCachedQuiz(req, res);
    }
}

async function getCachedQuiz(req, res) {
    const session = await getSession({ req }); 
    const {quizId} = req.query
    const db = new MongoDbClient();
    await db.initClient();

    let user = await UserSchema.findById(session.user.id);
    const quiz = await QuizSchema.findById(quizId);
    const questions = quiz.questions;
    const quizData = {
        questions: questions,
        duration: quiz.duration,
    };

    return res.status(200).json(quizData);
}