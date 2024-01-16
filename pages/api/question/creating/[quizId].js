import MongoDbClient from "../../../../utils/mongo_client";
import {QuestionSchema, QuizSchema} from "../../../../schemas";
import { Question } from "../../../../schemas/question";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuestions(req, res);
        case "POST":
            return createQuestion(req, res);
    }
}

async function createQuestion(req, res) {
    const { quizId } = req.query;
    const { description, options, correctAnswer, type, imageUrl } = req.body;

    if (!quizId || quizId === 'undefined') {
      return res.status(400).json({
        error: 'Error getting Quiz Id',
      });
    }

    const db = new MongoDbClient();
    await db.initClient();
    console.log(type);
    
    try {
      let newQuestion;

      switch (type) {
        case 'MCQ':
          newQuestion = new Question({
            quizId,
            description,
            options,
            correctAnswer,
            type,
          });
          break;

          case 'Reorder':
            newQuestion = new Question({
              quizId,
              description,
              options,
              type,
            });
            break;

          case 'MCM':
          newQuestion = new Question({
            quizId,
            description,
            options,
            correctAnswer,
            type,
          });
          break;
        
        case 'True/False':
          newQuestion = new Question({
            quizId,
            description,
            options: ['True', 'False'],
            correctAnswer,
            type,
          });
          break;
        
        case 'Hotspot':
          newQuestion = new Question({
            quizId,
            description,
            correctAnswer: correctAnswer,
            type,
            imageUrl,
          });
          break;
        
        default:
          return res.status(400).json({
            error: 'Invalid question type',
          });
      }
      
      await newQuestion.save();
      const quiz = await QuizSchema.findOneAndUpdate({ _id: quizId }, { $push: { questions: newQuestion } });
  
  
      return res.status(200).json({
        message: 'Question added successfully',
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error was encountered',
      });
    }
  }

async function getQuestions(req, res) {
    const { quizId } = req.query;

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const questions = await Question.find({quizId});

        return res.status(200).json(questions);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered"
        });
    }  
}