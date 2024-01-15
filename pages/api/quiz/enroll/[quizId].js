import MongoDbClient from "../../../../utils/mongo_client";
import { QuizSchema, UserSchema } from "../../../../schemas";


export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return updateAssignedUsers(req, res);
    }
}

async function updateAssignedUsers(req, res) {
    const { quizId } = req.query;
    const {usersEnrolled} = req.body
    const db = new MongoDbClient();
    await db.initClient();

    try {
        let quiz = await QuizSchema.findById(quizId);
        let users = await UserSchema.find({_id: {$in: usersEnrolled}});
        quiz.usersEnrolled = []
        for(let i=0; i<users.length; i++){
            quiz.usersEnrolled.push(users[i]._id); 
            users[i].quizzesEnrolled.push(quizId);
            await users[i].save();
        }
        
        await quiz.save()
        return res.status(200).json({
            message: 'User enrolled successfully'
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'An error was encountered'
        });
    }  
}