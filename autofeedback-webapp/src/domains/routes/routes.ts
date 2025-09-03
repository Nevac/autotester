export default class Routes {

    public static readonly ROOT = "";
    public static readonly ATTEMPT = `${Routes.ROOT}/attempt`;
    public static readonly ATTEMPT_CREATE = `${Routes.ATTEMPT}/create`;
    public static readonly ATTEMPT_EDIT = `${Routes.ATTEMPT}/:id`;
    public static attemptEdit(id: string): string { return `${Routes.ATTEMPT}/${id}`};
    public static readonly ATTEMPT_EXPORT = `${Routes.ATTEMPT}/export`;
    public static readonly CHAT_GROUP = `${Routes.ROOT}/chat-group`;
    public static readonly CHAT_GROUP_DETAIL = `${Routes.CHAT_GROUP}/detail`;
    public static readonly CHAT_GROUP_CREATE = `${Routes.CHAT_GROUP}/create`;
    public static readonly CHAT_GROUP_DETAILS = `${Routes.CHAT_GROUP}/:id`;
    public static chatGroupDetails(id: string): string { return `${Routes.CHAT_GROUP}/${id}`};
    public static readonly EXERCISE = `${Routes.ROOT}/exercise`;
    public static readonly EXERCISE_CREATE = `${Routes.EXERCISE}/create`;
    public static readonly EXERCISE_EDIT = `${Routes.EXERCISE}/:id`;
    public static exerciseEdit(id: string): string { return `${Routes.EXERCISE}/${id}`};
    public static readonly PROMPT_GROUP = `${Routes.ROOT}/prompt-group`;
    public static readonly PROMPT_GROUP_CREATE = `${Routes.PROMPT_GROUP}/create`;
    public static readonly PROMPT_GROUP_EDIT = `${Routes.PROMPT_GROUP}/:id`;
    public static promptGroupEdit(id: string): string { return `${Routes.PROMPT_GROUP}/${id}`};
    public static readonly EVALUATION_GROUP = `${Routes.ROOT}/evaluation-group`;
    public static readonly EVALUATION_GROUP_CREATE = `${Routes.EVALUATION_GROUP}/create`;
    public static readonly EVALUATION_GROUP_DETAILS = `${Routes.EVALUATION_GROUP}/:id`;
    public static evaluationGroupDetails(id: string): string { return `${Routes.EVALUATION_GROUP}/${id}`};
    public static readonly EVALUATION_GROUP_EXPORT = `${Routes.EVALUATION_GROUP}/export`;
    public static readonly EVALUATION_GROUP_STATISTICS = `${Routes.EVALUATION_GROUP}/statistics`;
    public static readonly RAG = `${Routes.ROOT}/rag`;
    public static readonly RAG_CREATE = `${Routes.RAG}/create`;
    public static readonly RAG_EDIT = `${Routes.RAG}/:id`;
    public static ragEdit(id: string): string { return `${Routes.RAG}/${id}`};
    public static readonly RAG_DOCUMENT = `${Routes.ROOT}/rag-document`;
    public static readonly RAG_DOCUMENT_CREATE = `${Routes.RAG_DOCUMENT}/create`;
    public static readonly RAG_DOCUMENT_EDIT = `${Routes.RAG_DOCUMENT}/:id`;
    public static ragDocumentEdit(id: string): string { return `${Routes.RAG_DOCUMENT}/${id}`};
    public static readonly RAG_DOCUMENT_EXPORT = `${Routes.RAG_DOCUMENT}/export`;
}