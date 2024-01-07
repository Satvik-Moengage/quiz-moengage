import { Schema } from "mongoose";
import mongoose from "mongoose";
import crypto from "crypto";

const User = new Schema({
    name: { type: String },
    email: { type: String },
    hashed_password: { type: String },
    salt: { type: String },
    isAdmin: { type: Boolean },
    createdAt: { type: Date },
    quizzesEnrolled: { type: [String] },
    quizzesTaken: { type: [String] }
});

User.methods.setPassword = function(password) {
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    return this.hashed_password;
}

User.methods.makeSalt = function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
}

User.methods.encryptPassword = function(password) {
    if (!password) return '';
    try {
        return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
    } catch (err) {
        return '';
    }
}

User.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
}

User.methods.addQuizEnrolled = function(quizId) {
    this.quizzesEnrolled.push(quizId);
}

User.methods.addQuizTaken = function(quizId) {
    this.quizzesTaken.push(quizId);
}

User.methods.removeQuizEnrolled = function(quizId) {
    this.quizzesEnrolled = this.quizzesEnrolled.filter((item) => item !== quizId);
}

export default mongoose.models.User || mongoose.model('User', User);