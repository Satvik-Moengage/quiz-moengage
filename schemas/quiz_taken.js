import { Schema, model, models } from 'mongoose';
import { default as AttemptSchema } from './attempt'; // Use default import

const QuizTakenSchema = new Schema({
    quizId: { type: String },
    quizTitle: { type: String },
    attempts: { type: [AttemptSchema] } // Array of Attempt subdocuments
});

export const QuizTaken = models.QuizTaken || model('QuizTaken', QuizTakenSchema);