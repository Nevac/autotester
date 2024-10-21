export default class Routes {

    public static readonly ROOT = "";
    public static readonly CHAT = `${Routes.ROOT}/chat`;
    public static readonly CHAT_CREATE = `${Routes.CHAT}/create`;
    public static readonly CHAT_DETAILS = `${Routes.CHAT}/:id`;
    public static readonly EXERCISE = `${Routes.ROOT}/exercise`;
    public static readonly EXERCISE_CREATE = `${Routes.EXERCISE}/create`;
    public static readonly EXERCISE_EDIT = `${Routes.EXERCISE}/:id`;
    public static exerciseEdit(id: string): string { return `${Routes.EXERCISE}/${id}`};
    public static readonly PROMPT_GROUP = `${Routes.ROOT}/prompt-group`;
    public static readonly PROMPT_GROUP_CREATE = `${Routes.PROMPT_GROUP}/create`;
    public static readonly PROMPT_GROUP_EDIT = `${Routes.PROMPT_GROUP}/:id`;
    public static promptGroupEdit(id: string): string { return `${Routes.PROMPT_GROUP}/${id}`};
}