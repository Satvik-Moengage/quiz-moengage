import { UserSchema } from "../../../../schemas";
import MongoDbClient from "../../../../utils/mongo_client";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getUserDetail(req, res);
    }
}

async function getUserDetail(req, res) {
    const db = new MongoDbClient();
    await db.initClient();
    const { userId } = req.query;
    try {
        const user = await UserSchema.findById(userId);
        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            quizzesEnrolled:user.quizzesEnrolled,
            quizzesTaken:user.quizzesTaken

        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    }  
}