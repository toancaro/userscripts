import { ITextElement, PlainTextElement } from './text-elements/01.text-element';
import { KeywordText } from './text-elements/keyword-text';

const KEYWORDS: string[] = [
  '(quick effect)',
  //
  'add',
  'added',
  //
  'banish',
  'banished',
  'banishing',
  //
  'destroy',
  'destroyed',
  //
  'discard',
  //
  'negate',
  //
  'return',
  //
  'send',
  'sent',
  //
  'special summon',
  'special summons',
  'special summoned',
  //
  'target',
  'targets',
  'targeted',
].sort((a, b) => {
  if (a.length - b.length !== 0) return b.length - a.length; // Longer first
  return a.localeCompare(b); // Then a-z
});

const isKeyword = (text: string): boolean => KEYWORDS.some((keyword) => keyword.toLowerCase() === text.toLowerCase());

const indexOf = (text: string, keyword: string): number => text.toLowerCase().indexOf(keyword.toLowerCase());

export function extractKeywords(text: string): ITextElement[] {
  let texts = [text];

  KEYWORDS.forEach((keyword) => {
    const newTexts: string[] = [];

    texts.forEach((text) => {
      // Avoid split 'destroyed' -> 'destroy'
      if (isKeyword(text)) {
        newTexts.push(text);
      }
      //
      else {
        while (indexOf(text, keyword) >= 0) {
          const index = indexOf(text, keyword);

          if (index > 0) {
            newTexts.push(text.slice(0, index));
          }

          newTexts.push(text.slice(index, index + keyword.length));

          if (index + keyword.length < text.length) {
            text = text.slice(index + keyword.length);
          }
        }

        if (text.length > 0) newTexts.push(text);
      }
    });

    texts = newTexts;
  });

  const result: ITextElement[] = [];

  texts.forEach((text) => {
    if (isKeyword(text)) {
      result.push(new KeywordText(text));
    } else {
      result.push(new PlainTextElement(text));
    }
  });

  return result;
}
