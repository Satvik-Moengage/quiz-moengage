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
        if (
            new Date(new Date(quiz.endTime).toISOString().replace("Z", "")) <= Date.now()
        ) {
            return res.status(400).json({
                error: "Quiz Time has elapsed!",
            });
        }
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

async function markQuiz(req, res) {
    const { slug } = req.query;
    const quizId = slug[0];
    const userId = slug[1];
    const db = new MongoDbClient();
    await db.initClient();

    try {
        const user = await UserSchema.findById(userId); 
        const quiz = await QuizSchema.findById(quizId);
        const questionsU = await Question.find({ quizId }); 

        const { questions } = req.body;
        let score = 0;

        let newAttempt = new Attempt({
            score: 0,
            responses: []
        });

        newAttempt = await newAttempt.save();

        for (let i = 0; i < questionsU.length; i++) {
            const item = questionsU[i];
            const userAnswer = questions[i].selectedOption;

            if (item.type === "Hotspot") {
                const userClickedTop = userAnswer.top;
                const userClickedLeft = userAnswer.left;

                const correctTop = item.correctAnswer.top;
                const correctLeft = item.correctAnswer.left;
                const correctBottom = correctTop + item.correctAnswer.height;
                const correctRight = correctLeft + item.correctAnswer.width;

                if (
                    userClickedTop >= correctTop &&
                    userClickedTop <= correctBottom &&
                    userClickedLeft >= correctLeft &&
                    userClickedLeft <= correctRight
                ) {
                    score += 1;
                }
            } 
            else if (item.type === 'MCM'){


                let userAnsArray = userAnswer.split(",");
                if(userAnsArray.length === 0){
                    score +=0
                }
                if(userAnsArray.sort().join(",") === item.correctAnswer.sort().join(",")){
                    score+=1;
                }
            }
            else if(item.type === 'Fill') {
                let allCorrect = true;
                let userAnswerArray = Object.values(userAnswer);
            
                userAnswerArray.forEach((answer, index) => {
                    if(answer !== item.dropdowns[index].correctAnswer) {
                        allCorrect = false;
                    }
                });
                if(allCorrect) score+=1;
            }
            else {
                if (String(userAnswer).toLowerCase() === String(item.correctAnswer).toLowerCase()) {
                    score += 1;
                }
            }

            const newResponse = new ResponseSchema({
                description: item.description,
                selected: userAnswer,
                questionId: item._id,
                quizId: quizId,
                correctAnswer: item.correctAnswer,
                options: item.options,
                attemptId: newAttempt._id  
            });

            await newResponse.save();

            newAttempt.responses.push(newResponse._id);
        }

        newAttempt.score = score;
        await newAttempt.save();

        const existingQuizTakenIndex = user.quizzesTaken.findIndex(qt => String(qt.quizId) === String(quizId));
        if (existingQuizTakenIndex !== -1) {
            user.quizzesTaken[existingQuizTakenIndex].attempts.push(newAttempt);
            user.markModified(`quizzesTaken.${existingQuizTakenIndex}.attempts`);
        } else {
            const quizTaken = new QuizTaken({
                quizId: quizId,
                quizTitle: quiz.title,
                attempts: []
            });
            quizTaken.attempts.push(newAttempt)
            user.quizzesTaken.push(quizTaken);
        }

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