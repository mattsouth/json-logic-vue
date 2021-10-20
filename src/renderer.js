// a map of strategies for rendering all known operators
const rendermap = {
    var: (args) => Array.isArray(args) ? args[0] : args,
    ">=": infix2(">="),
    "<=": infix2("<="),
    "<": infix2("<"),
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
    "!!": prefix1("!!")
}

function infix2(functor) {
    return function(args) {
        return render(args[0]) + " " + functor + " " + render(args[1]);
    }
}

function prefix1(functor) {
    return function(args) {
        return Array.isArray(args) ? functor + render(args[0]) : functor + render(args);
    }
}

export function render(rules) {
    let result = "";
    // console.log(JSON.stringify(rules), typeof rules);
    if (typeof rules === "object") {
        for (const [key, value] of Object.entries(rules)) {
            // console.log(key, value);
            result += rendermap[key](value)
        }
    } else {
        // JSON.stringify will suffice for all other (primitive) types
        result = result + JSON.stringify(rules);
    }
    return result;
}
