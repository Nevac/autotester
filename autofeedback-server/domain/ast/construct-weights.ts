const CONSTRUCT_WEIGHTS: Record<string, number> = {
    // High-priority: diagnostic smells, strong signals
    "god class": 3,
    "duplication": 3,
    "long method": 3,
    "method length": 3,
    "magic numbers": 2.5,
    "magic strings": 2.5,
    "coupling": 2.5,
    "exceptions": 2,
    "errors": 2,
    "nesting": 2,
    "deep nesting": 2,

    // Medium: structural OOP/code constructs
    "inheritance": 1.5,
    "composition": 1.5,
    "interfaces": 1.5,
    "parameters": 1.5,
    "fields": 1.5,
    "enum": 1.5,
    "constants": 1.5,

    // Lower: common flow/control constructs
    "if": 1,
    "branching": 1,
    "for": 1,
    "while": 1,
    "foreach": 1,

    // Very low: trivial/common
    "add": 0.5,
    "get": 0.5,
    "put": 0.5,
    "List": 0.5,
    "ArrayList": 0.5,
    "Map": 0.5,
    "HashMap": 0.5,
    "Set": 0.5,
    "HashSet": 0.5,
    "LinkedHashMap": 0.5,
    "TreeSet": 0.5
};
export default CONSTRUCT_WEIGHTS;