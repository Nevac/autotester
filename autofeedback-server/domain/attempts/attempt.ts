import {Document, model, Schema} from "mongoose";
import Entity from "../entities/entity";
import EntityUtil from "../entities/entity";
import {Exercise, exerciseSchema} from "../exercises/exercise";
import {ObjectId} from "mongodb";
import {IEvaluationGroup} from "../evaluations/group/evaluation-group";
import ExpectedFeedback, {expectedFeedbackSchema} from "./expected-feedback/expected-feedback";

export interface IAttempt {
    name: string,
    exercise: Exercise,
    attempt: string,
    expectedFeedback: ExpectedFeedback
}

export class Attempt implements IAttempt, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: Exercise,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(attempt: AttemptDocument): Attempt {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(attempt)

        return new Attempt(
            EntityUtil.convertId(attempt._id),
            attempt.name,
            attempt.exercise,
            attempt.attempt,
            attempt.expectedFeedback,
            createdAt,
            updatedAt
        )
    }

    public static ofDocuments(attempts: AttemptDocument[]): Map<string, Attempt> {
        return new Map(
            attempts.map(attempt => [
                EntityUtil.convertId(attempt._id),
                Attempt.ofDocument(attempt)
            ]));
    }
}

export const attemptSchema = new Schema<IAttempt>(
    {
        name: { type: String, required: true },
        exercise: { type: exerciseSchema, required: true },
        attempt: { type: String, required: true },
        expectedFeedback: { type: expectedFeedbackSchema, required: true }
    },
    {
        timestamps: true
    }
);

export type AttemptDocument = Document<unknown, {}, IAttempt> & IAttempt & {};
export const AttemptModel = model<IAttempt>('Attempt', attemptSchema);