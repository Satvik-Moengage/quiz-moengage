
import {QuizTakenSchema, UserSchema} from "../../../../../schemas";
import MongoDbClient from "../../../../../utils/mongo_client";

export default async function handler(req, res){
    switch (req.method){
        case "GET":
            return getUsersLeaderboard(req, res);
    }
}

async function getUsersLeaderboard(req, res) {
    const { quizId } = req.query;
    const db = new MongoDbClient();
    await db.initClient();

    try {

        let users = await UserSchema.find({})
        
        const usersWhoTookQuiz = users.filter(user =>
            user.quizzesTaken.some(quiz =>
                quiz.quizId === quizId
            )
        );
        // sort by score
        //users = usersWhoTookQuiz.sort((a,b) => b.score - a.score)
        return res.status(200).json(usersWhoTookQuiz);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    }  
}