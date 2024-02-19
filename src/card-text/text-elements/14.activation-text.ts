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
    return `<span class="activation">${this.text}</span>`;
  }
}
