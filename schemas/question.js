import mongoose from "mongoose";

const { Schema } = mongoose;

const QuestionSchema = new Schema({
    quizId: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'True/False', 'Hotspot'], required: true },
    options: { type: [String], default: [] },
    correctAnswer: { type: Schema.Types.Mixed },
    imageUrl: { type: String, default: "" },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);