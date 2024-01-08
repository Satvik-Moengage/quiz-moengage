import MongoDbClient from "../../../../utils/mongo_client";
import {UserSchema, QuizSchema} from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return unenroll(req, res);
    }
}

async function unenroll(req, res) {
    const { slug } = req.query;
    const quizId = slug[0];
    const userId = slug[1];

    const db = new MongoDbClient();
    await db.initClient();

    try {
        // fetch the quiz and user
        const quiz = await QuizSchema.findById(quizId);
        const user = await UserSchema.findById(userId);

        // removing user from quiz
        let index = quiz.usersEnrolled.indexOf(userId);
        if (index > -1) {
            quiz.usersEnrolled.splice(index, 1);
        }

        // removing quiz from user
        index = user.quizzesEnrolled.indexOf(quizId);
        if (index > -1) {
            user.quizzesEnrolled.splice(index, 1);
        }

        await quiz.save();
        await user.save();

        return res.status(200).json({
            message: 'User successfully unenrolled from quiz'
        });

    } catch ( err) {
        console.log(err);
        return res.status(400).json({
            message: 'An error was encountered'
        });
    }  
    }
    
    
    
    
    