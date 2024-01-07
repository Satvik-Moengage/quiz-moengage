import { Schema } from "mongoose";
import mongoose from "mongoose";

const Attempt = new Schema({
    quizId: { type: String },
    userId: { type: String }
});

export default mongoose.models.Attempt || mongoose.model('Attempt', Attempt);