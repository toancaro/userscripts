import { TextElementBase } from './01.text-element';

/**
 * 2 Level 10 Monsters
 */

export class KeywordText extends TextElementBase {
  public constructor(private readonly text: string) {
    super();
  }

  public render(): string {
    return `<span class="keyword">${this.text}</span>`;
  }
}
