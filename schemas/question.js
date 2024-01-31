import mongoose from "mongoose";

const { Schema } = mongoose;

const DropdownSchema = new Schema({
    options: [String],
    correctAnswer: String
}, { _id: false });

const QuestionSchema = new Schema({
    quizId: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'True/False', 'Hotspot','MCM','Reorder', 'Fill'], required: true },
    options: { type: [String], default: [] }, // options for types other than "Fill"
    correctAnswer: { type: [String] }, // correctAnswer field for types other than "Fill"
    dropdowns: { type: [DropdownSchema], default: [] }, // dropdowns for "Fill" type
    hotspot: { type: [Number], default: [] },
    imageUrl: { type: String, default: "" },
    matches: { type: Map, of: String }
});

export const Question =  mongoose.models.Question || mongoose.model('Question', QuestionSchema);
