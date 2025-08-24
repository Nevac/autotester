import ExerciseDifficulty from "./exercise-difficulty";

export default class ExerciseUpdate {
    constructor(
        public readonly name: string,
        public readonly task: string,
        public readonly difficulty: ExerciseDifficulty,
        public readonly solution: string
    ) {}
}