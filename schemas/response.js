import { Schema } from "mongoose";
import mongoose from "mongoose";

const Response = new Schema({
    description: { type: String },
    selected: { type: String },
    quizId: { type: String },
    questionId: { type: String },
    correctAnswer: { type: String },
    options: { type: [String] },
    attemptId: { type: String }
});

export default mongoose.models.Response || mongoose.model('Response', Response);