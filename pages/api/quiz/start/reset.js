import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return reset(req, res);
    }
}

async function reset(req, res) {
    const session = await getSession({ req });

    const db = new MongoDbClient();
    await db.initClient();

    try {
        // Here, we are assuming there is a field in the User schema called 'quizData' where the data is stored.
        // Replace 'User' with the actual model used for users.
        const user = await User.findById(session.user._id);
        user.quizData = null;
        await user.save();

        return res.status(200).json({
            message: "Quiz reset successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            error: "An error has been encountered",
        });
    } finally {
        await db.disconnectClient();
    }
}