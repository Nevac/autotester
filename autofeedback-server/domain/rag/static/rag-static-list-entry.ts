import RagStatic, {RagStaticDocument} from "./rag-static";
import EntityUtil from "../../entities/entity";

export default class RagStaticListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(ragStatic: RagStaticDocument): RagStaticListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(ragStatic);

        return new RagStaticListEntry(
            EntityUtil.convertId(ragStatic._id),
            ragStatic.name,
            createdAt
        )
    }
}