
import {QuizTakenSchema} from "../../../../../schemas";
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

        let users = await QuizTakenSchema.find({ quizId: quizId })

        // sort by score
        users = users.sort((a,b) => b.score - a.score)
        
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    } finally {
        await db.disconnectClient();
    }
}