import { extractKeywords } from '../keywords-extractor';
import { CompositeTextElement, PlainTextElement } from './01.text-element';
import { ConditionText } from './13.condition-text';
import { ActivationText } from './14.activation-text';
import { EffectChainableText } from './15.effect-chainable-text';

/**
 * Single sentence in cardtext.
 */
export class EffectItemText extends CompositeTextElement {
  public constructor(private readonly texts: string[]) {
    super([]);
    this.processTexts();
  }

  private processTexts(): void {
    const isChainableEffect = this.texts.some((text) => text.endsWith(':') || text.endsWith(';'));

    // Condition - Activation - Chainable effect
    if (isChainableEffect) {
      this.texts.forEach((text) => {
        // Condition
        if (text.endsWith(':')) {
          this.addChild(new ConditionText(text));
        }
        // Activation
        else if (text.endsWith(';')) {
          this.addChild(new ActivationText(text));
        }
        // Chainable effect
        else if (text.endsWith('.')) {
          this.addChild(new EffectChainableText(text));
        }
        // Error
        else {
          throw new Error('Unknown type of text');
        }
      });
    }
    // Inherent effect
    else {
      this.texts.forEach((text) => {
        const children = extractKeywords(text);
        children.forEach((child) => this.addChild(child));
      });
    }
  }
}
