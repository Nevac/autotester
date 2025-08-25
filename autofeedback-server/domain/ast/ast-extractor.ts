import Parser from "tree-sitter";
import Java from "tree-sitter-java";
import crypto from "crypto";

export default class AstExtractor {
    private readonly parser: Parser;

    constructor() {
        this.parser = new Parser();
        this.parser.setLanguage(Java);
    }

    public extractConstructs(code: string): string[] {
        const tree = this.parser.parse(code);
        const constructs: Set<string> = new Set();

        let maxNesting = 0;
        const statementHashes: Record<string, number> = {};

        function hash(text: string): string {
            return crypto.createHash("md5").update(text.trim().replace(/\s+/g, " ")).digest("hex");
        }

        function walk(node: Parser.SyntaxNode, depth: number = 0) {
            // --- Control Flow ---
            switch (node.type) {
                case "if_statement":
                    constructs.add("if");
                    constructs.add("branching");
                    maxNesting = Math.max(maxNesting, depth);
                    break;
                case "ternary_expression":
                    constructs.add("ternary operator");
                    constructs.add("branching");
                    break;
                case "for_statement":
                    constructs.add("for");
                    maxNesting = Math.max(maxNesting, depth);
                    break;
                case "while_statement":
                    constructs.add("while");
                    maxNesting = Math.max(maxNesting, depth);
                    break;
                case "enhanced_for_statement":
                    constructs.add("foreach");
                    break;

                // --- Classes & Methods ---
                case "class_declaration": {
                    constructs.add("class");
                    constructs.add("classes");
                    const members = node.namedChildren.filter(c =>
                        ["method_declaration", "field_declaration"].includes(c.type)
                    );
                    if (members.length > 10) {
                        constructs.add("god class");
                    }
                    break;
                }
                case "method_declaration": {
                    constructs.add("methods");
                    const params = node.namedChildren.filter(c => c.type === "formal_parameter");
                    if (params.length > 4) {
                        constructs.add("long parameter list");
                        constructs.add("parameters");
                    }
                    const lines = node.endPosition.row - node.startPosition.row;
                    if (lines > 20) {
                        constructs.add("long method");
                        constructs.add("method length");
                    }
                    break;
                }
                case "constructor_declaration":
                    constructs.add("constructors");
                    break;

                // --- Fields / Parameters ---
                case "field_declaration":
                    constructs.add("fields");
                    break;
                case "formal_parameter":
                    constructs.add("parameters");
                    break;
                case "primitive_type":
                    constructs.add("primitive types");
                    break;
                case "enum_declaration":
                    constructs.add("enum");
                    break;

                // --- Literals ---
                case "string_literal":
                    constructs.add("magic strings");
                    constructs.add("strings");
                    break;
                case "decimal_integer_literal":
                case "floating_point_literal":
                    constructs.add("magic numbers");
                    break;

                // --- OOP / Dependency ---
                case "object_creation_expression":
                    constructs.add("new");
                    constructs.add("coupling");
                    break;
                case "superclass":
                    constructs.add("inheritance");
                    break;
                case "interface_declaration":
                    constructs.add("interfaces");
                    break;

                // --- Errors & Exceptions ---
                case "throw_statement":
                case "catch_clause":
                    constructs.add("exceptions");
                    constructs.add("errors");
                    break;

                // --- Comments ---
                case "comment":
                    constructs.add("comments");
                    if (/should|expected/i.test(node.text)) {
                        constructs.add("comments instead of tests");
                    }
                    if (node.text.split("\n").length > 3) {
                        constructs.add("excessive comments");
                    }
                    break;

                // --- Imports ---
                case "import_declaration":
                    constructs.add("imports");
                    break;

                // --- Identifiers / Method Invocations for Collections ---
                case "type_identifier":
                case "scoped_type_identifier":
                case "method_invocation": {
                    const text = node.text;
                    if (/ArrayList/.test(text)) {
                        constructs.add("ArrayList");
                        constructs.add("List");
                    }
                    if (/List/.test(text)) {
                        constructs.add("List");
                    }
                    if (/HashMap/.test(text)) {
                        constructs.add("Map");
                    }
                    if (/Map/.test(text)) {
                        constructs.add("Map");
                    }
                    if (/HashSet/.test(text)) {
                        constructs.add("Set");
                        constructs.add("Set");
                    }
                    if (/Set/.test(text)) {
                        constructs.add("Set");
                    }
                    if (/LinkedHashMap/.test(text)) {
                        constructs.add("LinkedHashMap");
                    }
                    if (/TreeSet/.test(text)) {
                        constructs.add("TreeSet");
                    }
                    if (/iterator/.test(text)) {
                        constructs.add("Iterator");
                    }
                    if (/containsKey/.test(text)) {
                        constructs.add("containsKey");
                    }
                    if (/Collections\.sort/.test(text)) {
                        constructs.add("Collections.sort");
                        constructs.add("sorting");
                    }
                    if (/remove/.test(text)) {
                        constructs.add("remove");
                    }
                    if (/add/.test(text)) {
                        constructs.add("add");
                    }
                    break;
                }
            }

            // --- Duplication detection: hash statements ---
            if (
                ["expression_statement", "if_statement", "for_statement", "while_statement"].includes(node.type)
            ) {
                const h = hash(node.text);
                statementHashes[h] = (statementHashes[h] || 0) + 1;
            }

            // recurse children
            for (let i = 0; i < node.namedChildCount; i++) {
                walk(
                    node.namedChild(i)!,
                    depth + (["if_statement", "for_statement", "while_statement"].includes(node.type) ? 1 : 0)
                );
            }
        }

        walk(tree.rootNode);

        // --- Post-analysis heuristics ---
        if (maxNesting > 3) {
            constructs.add("nesting");
            constructs.add("deep nesting");
        }

        // check for duplication
        if (Object.values(statementHashes).some(count => count > 1)) {
            constructs.add("duplication");
            constructs.add("dry");
        }

        return Array.from(constructs);
    }
}