import { Schema } from "mongoose";
import mongoose from "mongoose";


const Quiz = new Schema({
    title: { type: String },
    quizCode: { type: String },
    duration: { type: Number },
    description: { type: String },
    authorId: { type: String },
    quizTaken: { type: [String] }, // array of quizTake ids who took the quiz, quizTaken has quizId, UserId, score, responses
    usersEnrolled: { type: [String] }, // ensure to initiate as empty array []
    createdAt: { type: Date },
    scheduledFor: { type: Date },
    quizType: { type: String } // quiz type can be private or public, for private they use a quizCode to join
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