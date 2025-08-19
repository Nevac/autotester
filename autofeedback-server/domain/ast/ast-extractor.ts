import Parser from "tree-sitter";
import Java from "tree-sitter-java";

export default class AstExtractor {
    private readonly parser: Parser;

    constructor() {
        this.parser = new Parser();
        this.parser.setLanguage(Java);
    }

    public extractConstructs(code: string): string[] {
        const tree = this.parser.parse(code);
        const constructs: Set<string> = new Set();

        function walk(node: Parser.SyntaxNode) {
            switch (node.type) {
                case "object_creation_expression":
                    constructs.add("new");
                    break;
                case "if_statement":
                    constructs.add("if");
                    break;
                case "for_statement":
                case "while_statement":
                case "enhanced_for_statement":
                    constructs.add("loop");
                    break;
                case "class_declaration":
                    constructs.add("class");
                    break;
                case "method_declaration":
                    constructs.add("methods");
                    break;
                case "formal_parameter":
                    constructs.add("parameters");
                    break;
                case "decimal_integer_literal":
                case "floating_point_literal":
                    constructs.add("magic numbers");
                    break;
            }

            // recurse into children
            for (let i = 0; i < node.namedChildCount; i++) {
                walk(node.namedChild(i)!);
            }
        }

        walk(tree.rootNode);
        return Array.from(constructs);
    }
}