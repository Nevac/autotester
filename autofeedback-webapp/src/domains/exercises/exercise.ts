import ExerciseDifficulty from "./exercise-difficulty";

export default class Exercise {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly task: string,
        public readonly difficulty: ExerciseDifficulty,
        public readonly solution: string,
        public readonly createdAt: string
    ) {
    }
}