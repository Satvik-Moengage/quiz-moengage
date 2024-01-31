import mongoose from "mongoose";

const { Schema } = mongoose;

const DropdownSchema = new Schema({
    options: [String],
    correctAnswer: String
}, { _id: false });

const hotspotCoordinatesSchema = new Schema({
    top: Number,
    left: Number,
    width: Number,
    height: Number,
  }, { _id: false });

const QuestionSchema = new Schema({
    quizId: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'True/False', 'Hotspot','MCM','Reorder', 'Fill'], required: true },
    options: { type: [], default: [] }, 
    correctAnswer: { type: Schema.Types.Mixed }, 
    dropdowns: { type: [DropdownSchema], default: [] }, 
    hotspot: {type: hotspotCoordinatesSchema, default: {}},
    imageUrl: { type: String, default: "" },
    matches: { type: Map, of: String }
});

export const Question =  mongoose.models.Question || mongoose.model('Question', QuestionSchema);
