import { extractKeywords } from '../keywords-extractor';
import { CompositeTextElement } from './01.text-element';

/**
 * Single sentence in cardtext.
 */
export class EffectChainableText extends CompositeTextElement {
  public constructor(private readonly text: string) {
    super([]);
    this.processText();
  }

  private processText(): void {}

  public render(): string {
    const children = extractKeywords(this.text);
    const childrenHtml = children.map((child) => child.render()).join('');
    return `<span class="effect-chainable">${childrenHtml}</span>`;
  }
}
