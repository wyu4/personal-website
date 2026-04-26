/**
 * Limit text length by truncating excess and appending `'...'`
 * @param text Original text
 * @param characterLimit Character limit
 * @returns New truncated text
 */
export function limitText(text: string, characterLimit: number) {
  if (characterLimit < 0 || text.length <= characterLimit) return text;
  return text.substring(0, characterLimit) + "...";
}
