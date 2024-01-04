import RedisClient from "../../../../../utils/redis_client";
import { QuizTakenSchema } from "../../../../../schemas";

export default async function handler(req, res){
    switch (req.method){
        case "GET":
            return getUsersLeaderboard(req, res);
    }
}

async function getUsersLeaderboard(req, res) {
    const redis = new RedisClient();
    const client = await redis.initClient()
    const { quizId } = req.query;

    try {
        const quizTakenRepo = client.fetchRepository(QuizTakenSchema);

        await quizTakenRepo.createIndex();

        let users = await quizTakenRepo.search()
            .where("quizId")
            .equals(quizId)
            .return.all()

        // convert each user item to JSON
        users = users.map(user => user.toJSON())
        // sort by score
        users = users.sort((a,b) => b.score - a.score)
        
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    } finally {
        await client.close();
    }
}
