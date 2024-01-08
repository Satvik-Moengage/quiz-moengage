import {
    UserSchema,
    QuizSchema,
    QuestionSchema,
    ResponseSchema,
    QuizTakenSchema,
    AttemptSchema,
} from "../../../../schemas";
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
        const user = await UserSchema.findById(userId);
        const quiz = await QuizSchema.findById(quizId);

        const questions = await QuestionSchema.find({ quizId: quizId });

        // Confirm if user already enrolled
        if (!user.quizzesEnrolled.includes(quizId)) {
            return res.status(409).json({
                error: "You are not enrolled to the quiz",
            });
        }

        // Confirm if the quiz has started
        if (
            new Date(new Date(quiz.scheduledFor).toISOString().replace("Z", "")) >= Date.now()
        ) {
            return res.status(400).json({
                error: "Quiz has not started yet!",
            });
        }

        /**
         * Save the questions in session
         */

        const quizData = {
            questions: questions,
            duration: quiz.duration,
        };

        req.session.quizData = quizData;

        /**
         * Get the questions and return them to frontend without the correct answer
         *
         */

        return res.status(200).json({
            message: `Quiz started for ${user.name}`,
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
        const user = await UserSchema.findById(userId); // fetch user
        const quiz = await QuizSchema.findById(quizId); // fetch the quiz

        // create new attempt
        const newAttempt = new AttemptSchema({
            quizId: quizId,
            userId: userId,
        });

        let attemptId = await newAttempt.save();

        const { questions } = req.body;

        let score = 0;

        // retrieve questions from session
        let quizData = req.session.quizData;
        let { questions: storedQuestions } = quizData;

        if (storedQuestions) {
            storedQuestions.forEach(async (item, i) => {
                if (
                    String(questions[i].selectedOption).toLowerCase() ===
                    String(item.correctAnswer).toLowerCase()
                ) {
                    score += 1;
                }

                let newResp = new ResponseSchema({
                    description: item.description,
                    selected: questions[i].selectedOption,
                    questionId: item._id ,
                    quizId: quizId,
                    correctAnswer: item.correctAnswer,
                    options: item.options,
                    attemptId: attemptId,
                });

                await newResp.save();
            });

            const responses = await ResponseSchema
                .find({ "attemptId": attemptId });

            let responsesId = responses.map((item) => item._id);

            const newQuizTaken = new QuizTakenSchema({
                userId: userId,
                score: score,
                quizId: quizId,
                attemptId: attemptId,
                responses: responsesId,
                quizTitle: quiz.title,
                userName: user.name,
            });

            await newQuizTaken.save();
            // push the quizTaken id to quiz schema
            quiz.quizTaken.push(newQuizTaken._id);
            user.quizTaken.push(newQuizTaken._id);

            // save changes made on quiz and user
            await quiz.save();
            await user.save();

            // Remove the quizData session
            delete req.session.quizData;

            return res.status(200).json({
                attemptId: attemptId,
            });
        } else {
            return res.status(400).json({
                error: "An error was encountered",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err,
        });
    }  
}