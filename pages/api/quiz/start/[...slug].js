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

async function markQuiz(req, res) {
    const { slug } = req.query;

    const quizId = slug[0];
    const userId = slug[1];

    const db = new MongoDbClient();
    await db.initClient();

    try {
        let user = await UserSchema.findById(userId); // fetch user
        let quiz = await QuizSchema.findById(quizId);

        const questionsU = await QuestionSchema.find({ quizId: quizId });// fetch the quiz

        // create new attempt
        const newAttempt = new AttemptSchema({
            quizId: quizId,
            userId: userId,
        });

        let attemptId = await newAttempt.save();

        //user's answers
        const { questions } = req.body;
        let score = 0;

        // retrieve questions from session
        const quizData = {
            questions: questionsU,
            duration: quiz.duration,
        };
        //let { questions: storedQuestions } = quizData;

        if (quizData.questions) {
            quizData.questions.forEach(async (item, i) => {
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
                    attemptId: attemptId._id,
                });

                await newResp.save();
            });

            const responses = await ResponseSchema
                .find({ "attemptId": attemptId._id });

            let responsesId = responses.map((item) => item._id);
            const newQuizTaken = new QuizTakenSchema({
                userId: userId,
                score: score,
                quizId: quizId,
                attemptId: attemptId._id,
                responses: responsesId,
                quizTitle: quiz.title,
                userName: user.name,
            });

            await newQuizTaken.save();
            // push the quizTaken id to quiz schema
            

            await UserSchema.findByIdAndUpdate(userId, {
                $push: { quizTaken: newQuizTaken._id },
              });
              
              await QuizSchema.findByIdAndUpdate(quizId, {
                $push: { quizTaken: newQuizTaken._id },
              });

            // Remove the quizData session
            return res.status(200).json({
                attemptId: attemptId._id,
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