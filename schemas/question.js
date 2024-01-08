import { Schema } from "mongoose";
import mongoose from "mongoose";


const Question = new Schema({
    quizId: { type: String },
    description: { type: String },
    type: { type: String, enum: ['MCQ', 'True/False', 'Hotspot'] },
    options: { type: [String] },
    correctAnswer: { type: String },
    hotspot: {type: [Number] }
});

export default mongoose.models.Question || mongoose.model('Question', Question);