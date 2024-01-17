import { Schema, model, models } from 'mongoose';

const AttemptSchema = new Schema({
    score: { type: Number },
    responses: [{ type: Schema.Types.ObjectId, ref: 'Response' }] // Reference to Response model
});

export const Attempt = models.Attempt || model('Attempt', AttemptSchema);