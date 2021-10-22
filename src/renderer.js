// a map of strategies for rendering all known operators
const rendermap = {
    var: (args) => Array.isArray(args) ? args[0] : args,
    ">=": infix2(">="),
    "<=": infix2("<="),
    "<": infix2("<"),
    ">": infix2(">"),
    "==": infix2("=="),
    "===": infix2("==="),
    "!=": infix2("!="),
    "!==": infix2("!=="),
    and: infix2("&&"),
    or: infix2("||"),
    "+": infix2("+"),
    "-": infix2("-"),
    "*": infix2("*"),
    "/": infix2("/"),
    "%": infix2("%"),
    "!": prefix1("!"),
    "!!": prefix1("!!"),
    missing: prefix("missing"),
    missing_some: prefix("missing_some"),
    cat: prefix("cat"),
    if: (args, depth) => render(args[0], depth) + " ? " + render(args[1], depth) + " : " + render(args[2], depth),
    max: prefix("max"),
    min: prefix("min"),
    map: prefix("map"),
    reduce: prefix("reduce"),
    filter: prefix("reduce"),
    all: prefix("all"),
    none: prefix("none"),
    some: prefix("some"),
    merge: prefix("merge"),
    in: prefix("in"),
    substr: prefix("substr")
}

// [">=","<=","<",">","==","===","!=","!==","and","or","+","-","*","/","%"].forEach(function(sym) { rendermap[sym] = infix2(sym) });

function infix2(functor) {
    return function(args, depth) {
        const rendered = render(args[0], depth) + " " + functor + " " + render(args[1], depth);
        return depth>1 ? "(" + rendered + ")" : rendered;
    }
}

function prefix(functor) {
    return function(args, depth) {
        return functor + "(" + args.map((arg) => render(arg, depth)).join(", ") + ")";
    }
}

function prefix1(functor) {
    return function(args, depth) {
        return Array.isArray(args) ? functor + render(args[0], depth) : functor + render(args, depth);
    }
}

function render(expr, depth=0) {
    if (typeof expr === "object") {
        const [key, value] = Object.entries(expr)[0];
        return rendermap[key](value, depth+1);
    } else {
        // should suffice for all non-object valued expressions
        return JSON.stringify(expr);
    }
}

export function renderJsonLogic(expr) {
    return render(expr);
}
