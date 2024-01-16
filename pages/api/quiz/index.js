
import { nanoid } from "nanoid";
import { QuizSchema } from "../../../schemas";
import MongoDbClient from "../../../utils/mongo_client";

export default function handler(req, res) {
    switch (req.method) {
        // case "GET":
        //     return getQuizzes(req, res);
        case "POST":
            return createQuiz(req, res);
    }
}

// async function getQuizzes(req, res) {
//     const db = new MongoDbClient();
//     await db.initClient();

//     try {
//         let quizzes = await QuizSchema.find({quizType: 'public'});
//         return res.status(200).json(quizzes);
//     } catch (err) {
//         console.log(err);
//         return res.status(400).json({
//             message: "An error was encountered",
//         });
//     }  
// }

async function createQuiz(req, res) {
    const db = new MongoDbClient();
    await db.initClient();

    try {
        const {
            title,
            duration,
            description,
            authorId,
            scheduledFor,
            endTime,
            passingMarks
        } = req.body;

        console.log(req.body);


        const newQuiz = new QuizSchema({
            title: title,
            duration: parseInt(duration),
            description: description,
            authorId: authorId,
            usersEnrolled: [],
            createdAt: Date.now(),
            scheduledFor: scheduledFor,
            endTime: endTime,
            passingMarks:passingMarks
        });

        await newQuiz.save();

        return res.status(200).json({
            message: "Quiz Created Successfully",
            quizId: newQuiz._id,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    }  
}