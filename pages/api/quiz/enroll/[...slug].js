import MongoDbClient from "../../../../utils/mongo_client";
import { QuizSchema, UserSchema } from "../../../../schemas";

export default function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return enrollUserToQuiz(req, res)
    }
}

async function enrollUserToQuiz(req, res) {
    const { slug } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    let quizId = slug[0];
    let userId = slug[1 ];

    try {
        let quiz = await QuizSchema.findById(quizId);
        let user = await UserSchema.findById(userId);

        // Confirm if user already enrolled
        if (quiz.usersEnrolled.includes(userId)){
            return res.status(409).json({
                error: `User already enrolled`
            })
        }

        // if user not enrolled, add user to enrolled list
        quiz.usersEnrolled.push(userId); 
        user.quizzesEnrolled.push(quizId);

        // save the changes made
        await quiz.save();
        await user.save();

        return res.status(200).json({
            message: 'User enrolled successfully'
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'An error was encountered'
        })
    } finally {
        await db.disconnectClient();
    }
}