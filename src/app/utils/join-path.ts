interface IHaveToString {
    toString(): string
}

export function joinPath(...parts: IHaveToString[]) {
    return parts.map(p => trimEnd(trimStart(p.toString()))).join("/")
}

function trimStart(str: string) {
    for (let index = 0; index < str.length; index++) {
        if (str[index] !== "/") return str.slice(index)
    }
    return str
}

function trimEnd(str: string) {
    for (let index = str.length - 1; index >= 0; index--) {
        if (str[index] !== "/") return str.slice(0, index + 1)
    }
    return str
}