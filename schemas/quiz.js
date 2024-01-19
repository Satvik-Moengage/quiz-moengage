import { Schema } from "mongoose";
import mongoose from "mongoose";
import {QuestionSchema} from "./index"

const Quiz = new Schema({
    title: { type: String },
    duration: { type: Number },
    description: { type: String },
    authorId: { type: String },
    usersEnrolled: { type: [String] },
    createdAt: { type: Date },
    scheduledFor: { type: Date },
    endTime: {type: Date},
    questions:{ type : [QuestionSchema]},
    passingMarks: { type: Number },
    noOfQuestions: {type: Number}
});

Quiz.methods.addQuizTaken = function(quizId) {
    this.quizTaken.push(quizId);
}

Quiz.methods.addUserEnrolled = function(userId) {
    this.usersEnrolled.push(userId);
}

Quiz.methods.removeUserEnrolled = function(userId){
    this.usersEnrolled = this.usersEnrolled.filter(item => item !== userId);
}

Quiz.methods.updateDetails = function(description, title, duration){
    this.description = description;
    this.title = title;
    this.duration = duration;
}

export default mongoose.models.Quiz || mongoose.model('Quiz', Quiz);