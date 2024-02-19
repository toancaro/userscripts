import { CompositeTextElement, PlainTextElement, TextElementBase } from './01.text-element';
import { EffectItemText } from './12.effect-item-text';

/**
 * 2 Level 10 Monsters
 */

export class EffectListText extends CompositeTextElement {
  public constructor(private readonly texts: string[]) {
    super([]);
    this.processTexts();
  }

  private processTexts(): void {
    while (this.texts.length > 0) {
      const currText = this.texts.shift()!;

      // Condition or activation
      if (currText.endsWith(':') || currText.endsWith(';')) {
        const texts: string[] = [currText];
        while (this.texts.length > 0) {
          const text = this.texts.shift()!;
          texts.push(text);

          if (text.endsWith('.')) break;
        }

        this.addChild(new EffectItemText(texts));
      }
      // Number 39: Utopia Double
      else if (currText.endsWith('.') && currText.startsWith('(')) {
        const texts: string[] = [currText];
        while (this.texts.length > 0) {
          const text = this.texts.shift()!;
          texts.push(text);

          // Divine Arsenal AA-ZEUS - Sky Thunder
          if (text.endsWith(')' || text.endsWith(').'))) break;
        }

        this.addChild(new EffectItemText(texts));
      }
      // Single sentence, no : or ;
      else if (currText.endsWith('.') || currText.endsWith(')')) {
        this.addChild(new PlainTextElement(currText));
      }
      // Something went wrong
      else {
        throw new Error('[effect-list:process-texts] Something went wrong');
      }
    }
  }

  public render(): string {
    let result = `<ol class="effect-list">`;

    this.getChild().forEach((child) => {
      result += `<li>${child.render()}</li>`;
    });

    result += `</ol>`;
    return result;
  }
}
