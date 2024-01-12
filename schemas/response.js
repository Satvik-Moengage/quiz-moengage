import { Schema } from "mongoose";
import mongoose from "mongoose";

const Response = new Schema({
    description: { type: String },
    selected: { type: Schema.Types.Mixed },
    quizId: { type: String },
    questionId: { type: String },
    correctAnswer: { type: Schema.Types.Mixed },
    options: { type: [String] },
    attemptId: { type: String },
    type: { type: String, enum: ['MCQ', 'True/False', 'Hotspot'] },  
});

export default mongoose.models.Response || mongoose.model('Response', Response);