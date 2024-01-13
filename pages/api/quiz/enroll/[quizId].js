import MongoDbClient from "../../../../utils/mongo_client";
import { QuizSchema } from "../../../../schemas";


export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return updateAssignedUsers(req, res);
    }
}

async function updateAssignedUsers(req, res) {
    const { quizId } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    try {
            console.log(quizId);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'An error was encountered'
        });
    }  
}