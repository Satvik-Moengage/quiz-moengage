import { Schema } from "mongoose";
import mongoose from "mongoose";


const QuizTaken = new Schema({
    userId: { type: String },
    userName: { type: String }, // name of the user taking the quiz
    score: { type: Number },
    responses: { type: [String] },
    quizId: { type: String },
    attemptId: { type: String },
    quizTitle: { type: String }
});

export default mongoose.models.QuizTaken || mongoose.model('QuizTaken', QuizTaken);