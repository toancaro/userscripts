import { TextElementBase } from './01.text-element';

/**
 * [Flavor Effect]
 */
export class HeaderMonsterFlavorText extends TextElementBase {
  public render(): string {
    return `<span class="header-flavor-text">[Flavor Text]</span>`;
  }
}
