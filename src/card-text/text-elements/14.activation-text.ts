import { extractKeywords } from '../keywords-extractor';
import { CompositeTextElement, PlainTextElement } from './01.text-element';

/**
 * Single sentence in cardtext.
 */
export class ActivationText extends CompositeTextElement {
  public constructor(private readonly text: string) {
    super([]);
    this.processText();
  }

  private processText(): void {}

  public render(): string {
    const children = extractKeywords(this.text);
    const childrenHtml = children.map((child) => child.render()).join('');
    return `<span class="activation">${childrenHtml}</span>`;
  }
}
