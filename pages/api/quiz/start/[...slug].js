import {
    UserSchema,
    QuizSchema,
    QuestionSchema,
    ResponseSchema,
    QuizTakenSchema,
    AttemptSchema,
} from "../../../../schemas";
import { Attempt } from "../../../../schemas/attempt";
import { Question } from "../../../../schemas/question";
import { QuizTaken } from "../../../../schemas/quiz_taken";
import MongoDbClient from "../../../../utils/mongo_client";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return startQuiz(req, res);
        case "POST":
            return markQuiz(req, res);
    }
}

async function startQuiz(req, res) {
    const { slug } = req.query;
    const quizId = slug[0];
    const userId = slug[1];
    
    const db = new MongoDbClient();
    await db.initClient();

    try {

        const quiz = await QuizSchema.findById(quizId);

        if (!quiz.usersEnrolled.includes(userId)) {
            return res.status(409).json({
                error: "You are not enrolled to the quiz",
            });
        }

        if (
            new Date(new Date(quiz.scheduledFor).toISOString().replace("Z", "")) >= Date.now()
        ) {
            return res.status(400).json({
                error: "Quiz has not started yet!",
            });
        }
        // if (
        //     new Date(new Date(quiz.endTime).toISOString().replace("Z", "")) <= Date.now()
        // ) {
        //     return res.status(400).json({
        //         error: "Quiz Time has elapsed!",
        //     });
        // }
        const quizData = {
            questions: quiz.questions,
            duration: quiz.duration,
        };
        

        return res.status(200).json({
            message: `Quiz started`,
            quizData: quizData
        });
    } catch (err) {
        console.log(err);
        console.log("err in slugjs");
        return res.status(400).json({
            error: err,
        });
    }  
}

// async function markQuiz(req, res) {
//     const { slug } = req.query;

//     const quizId = slug[0];
//     const userId = slug[1];

//     const db = new MongoDbClient();
//     await db.initClient();

//     try {
//         let user = await UserSchema.findById(userId); // fetch user
//         let quiz = await QuizSchema.findById(quizId);

//         const questionsU = await Question.find({ quizId: quizId });// fetch the quiz

//         //user's answers
//         const { questions } = req.body;
//         let score = 0;

//         // retrieve questions from session
//         const quizData = {
//             questions: questionsU,
//             duration: quiz.duration,
//         };
//         //let { questions: storedQuestions } = quizData;
//         let newAttempt = new Attempt({
//             score: 0,
//             responses: []
//         });
    
//         let responsesIds = [];

//         if (quizData.questions) {
//             quizData.questions.forEach(async (item, i) => {
//                 if (
//                     String(questions[i].selectedOption).toLowerCase() ===
//                     String(item.correctAnswer).toLowerCase()
//                 ) {
//                     newAttempt.score += 1;
//                 }

//                 let newResp = new ResponseSchema({
//                     description: item.description,
//                     selected: questions[i].selectedOption,
//                     questionId: item._id ,
//                     quizId: quizId,
//                     correctAnswer: item.correctAnswer,
//                     options: item.options,
//                     attemptId: attemptId._id,
//                 });

//                 await newResp.save();
//                 let savedResponse = await newResp.save();
//                 responsesIds.push(savedResponse._id);
                
//             });

//             newAttempt.responses = responsesIds;

//             newAttempt = await newAttempt.save(); // Make sure to save the newAttempt to get an ObjectId

//             let quizTaken

//             // Check if there is an existing QuizTaken object to update, or if we have to create a new one
//             const existingQuizTaken = await QuizTaken.findOne({ quizId: quizId });

//             if (existingQuizTaken) {
//                 // If the QuizTaken object already exists, update it with the new attempt
//                 existingQuizTaken.attempt.push(newAttempt); // Add the new attempt to the array of attempts
//                 await existingQuizTaken.save();
//                 quizTaken = existingQuizTaken
//             } else {
//                 // If no QuizTaken object exists, create a new one
//                 let newQuizTaken = new QuizTaken({
//                     quizId: quizId,
//                     quizTitle: quiz.title,
//                     attempt: [newAttempt] 
//                 });

//                 newQuizTaken = await newQuizTaken.save();
//                 quizTaken = newQuizTaken
//             }
            

//             await UserSchema.findByIdAndUpdate(userId, {
//                 $push: { quizzesTaken: quizTaken },
//               });
//             return res.status(200).json({
//                 message: "Quiz Submitted Successfully!"
//             });
//         } else {
//             return res.status(400).json({
//                 error: "An error was encountered",
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         return res.status(400).json({
//             error: err,
//         });
//     }  
// }
async function markQuiz(req, res) {
    const { slug } = req.query;
    const quizId = slug[0];
    const userId = slug[1];
    const db = new MongoDbClient();
    await db.initClient();

    try {
        const user = await UserSchema.findById(userId); // Fetch user
        const quiz = await QuizSchema.findById(quizId);
        const questionsU = await Question.find({ quizId }); // fetch the quiz questions

        const { questions } = req.body;
        let score = 0;

        // Create a new empty Attempt instance
        let newAttempt = new Attempt({
            score: 0,
            responses: []
        });

        // Save the Attempt instance to get an _id
        newAttempt = await newAttempt.save();

        for (let i = 0; i < questionsU.length; i++) {
            const item = questionsU[i];
            const userAnswer = questions[i].selectedOption;
            
            if (String(userAnswer).toLowerCase() === String(item.correctAnswer).toLowerCase()) {
                score += 1;
            }
            
            const newResponse = new ResponseSchema({
                description: item.description,
                selected: userAnswer,
                questionId: item._id,
                quizId: quizId,
                correctAnswer: item.correctAnswer,
                options: item.options,
                attemptId: newAttempt._id  // Reference the saved Attempt's _id
            });

            // Save the response
            await newResponse.save();
            
            // Reference the response in the Attempt
            newAttempt.responses.push(newResponse._id);
        }

        // Now that all Responses are saved, update Attempt with correct score and Response references
        newAttempt.score = score;
        await newAttempt.save();

        // Find or create a QuizTaken object for the User
        const existingQuizTakenIndex = user.quizzesTaken.findIndex(qt => String(qt.quizId) === String(quizId));
        if (existingQuizTakenIndex !== -1) {
            // If existing, update it
            user.quizzesTaken[existingQuizTakenIndex].attempts.push(newAttempt);
            user.markModified(`quizzesTaken.${existingQuizTakenIndex}.attempts`);
        } else {
            // If not existing, create a new QuizTaken object and add it
            const quizTaken = new QuizTaken({
                quizId: quizId,
                quizTitle: quiz.title,
                attempts: []
            });
            quizTaken.attempts.push(newAttempt)
            user.quizzesTaken.push(quizTaken);
        }

        // Save the updated User
        await user.save();
        const quiz_taken = user.quizzesTaken.find(qt => String(qt.quizId) === String(quizId))
        return res.status(200).json({
            message: "Quiz Submitted Successfully!",
            attemptId: newAttempt._id,
            quizTakenId: quiz_taken._id
        });
    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "An error occurred while marking the quiz."
        });
    }
}