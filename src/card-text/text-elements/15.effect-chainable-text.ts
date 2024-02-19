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
    return `<span class="effect-chainable">${this.text}</span>`;
  }
}
