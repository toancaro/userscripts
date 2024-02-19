import { CompositeTextElement, PlainTextElement } from './01.text-element';

/**
 * Single sentence in cardtext.
 */
export class ConditionText extends CompositeTextElement {
  public constructor(private readonly text: string) {
    super([]);
    this.processText();
  }

  private processText(): void {}

  public render(): string {
    return `<span class="condition">${this.text}</span>`;
  }
}
