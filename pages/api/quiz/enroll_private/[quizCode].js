import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react";
import { QuizSchema, UserSchema } from "../../../../schemas";

export default function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return enrollUserToQuiz(req, res);
    }
}

async function enrollUserToQuiz(req, res) {
    const { quizCode } = req.query;
    const session = await getSession({ req });

    const db = new MongoDbClient();
    await db.initClient();

    let userId = session?.user?.id;

    try {
        let quiz = await QuizSchema.findOne({quizCode: quizCode});
        let user = await UserSchema.findById(userId);

        // validate the code
        if (!quiz){
            return res.status(404).json({
                error:"Invalid Quiz Code"
            })
        }

        // Confirm if user already enrolled
        if (quiz.usersEnrolled.includes (userId)) {
            return res.status(409).json({
                error: `${user.name} you're already enrolled`,
            });
        }

        // if user not enrolled, add user to enrolled list
        quiz.usersEnrolled.push(userId);
        user.quizzesEnrolled.push(quiz._id);

        // save the changes made
        await quiz.save();
        await user.save();

        return res.status(200).json({
            message: `${user .name} you have been successfully enrolled to the quiz`,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err
        });
    }  
}