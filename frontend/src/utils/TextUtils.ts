export function limitText(text: string, characterLimit: number) {
    if (characterLimit < 0 || text.length <= characterLimit) return text;
    return text.substring(0, characterLimit) + "...";
}

export function getREMInPixels() {
    const rootElementFontSize = window.getComputedStyle(
        document.documentElement,
    ).fontSize;
    return parseFloat(rootElementFontSize);
}
