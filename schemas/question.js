import { Schema } from "mongoose";
import mongoose from "mongoose";


const Question = new Schema({
    quizId: { type: String },
    description: { type: String },
    options: { type: [String] },
    correctAnswer: { type: String }
});

export default mongoose.models.Question || mongoose.model('Question', Question);