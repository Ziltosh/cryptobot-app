export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const convertFromMarkdown = (str: string) => {
    // gras
    str = str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    return str
}