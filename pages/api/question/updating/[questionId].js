import mongoose from "mongoose";
import {QuestionSchema} from "../../../../schemas";
import MongoDbClient from "../../../../utils/mongo_client";

export default async function handler (req, res) {
    switch (req.method) {
        case "PUT":
            return updateQuestion(req, res);
        case "DELETE":
            return removeQuestion(req, res);
    }
}

async function updateQuestion(req, res) {
    const { questionId } = req.query;
    const { description, options, correctAnswer } = req.body;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const question = await QuestionSchema.findById(questionId); // retrieve the question

        question.description = description;
        question.options = options;
        question.correctAnswer = correctAnswer;

        await question.save(); // save changes

        return res.status(200).json({
            message: "Question updated successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await db.disconnectClient();
    }
}

async function removeQuestion(req, res) {
    const { questionId } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        // Now remove the question using questionID
        await QuestionSchema.findByIdAndDelete(questionId);

        return res.status(200).json({
            message: "Question removed successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await db.disconnectClient();
    }
}