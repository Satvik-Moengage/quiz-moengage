import MongoDbClient from "../../../../utils/mongo_client";
import {QuestionSchema} from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuestions(req, res);
        case "POST":
            return createQuestion(req, res);
    }
}

async function createQuestion(req, res) {
    const { quizId } = req.query;
    const { description, options, correctAnswer, type, hotspot } = req.body;  // Add 'type' and 'hotspot' fields

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const newQuestion = new QuestionSchema({
            quizId: quizId,
            description: description,
            options: options,
            correctAnswer: correctAnswer,
            type: type,  // Assign 'type' field from the request body
            hotspot: hotspot  // Assign 'hotspot' field from the request body
        });

        await newQuestion.save(); // save the new question

        return res.status(200).json({
            message: "Question added successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered"
        });
    }  
}

async function getQuestions(req, res) {
    const { quizId } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const questions = await QuestionSchema.find({quizId});

        return res.status(200).json(questions);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered"
        });
    }  
}