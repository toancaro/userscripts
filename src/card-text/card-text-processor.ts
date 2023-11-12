import { PREFIX_MATERIALS } from '../utils/constants';
import { logger } from '../utils/logger';
import {
  ActivationToken,
  ConditionToken,
  EffectToken,
  MaterialsToken,
  MonsterEffectToken,
  MonsterFlavorToken,
  ParenthesisToken,
  PendulumEffectToken,
  QuickEffectToken,
  TokenBase,
  UnknownToken,
} from './card-text-token';

export class CardTextProcessor {
  private readonly cardTexts: string[];

  public constructor(cardTexts: string[]) {
    this.cardTexts = this.normalizeCardTexts(cardTexts);
    logger.debug('Card texts: ', [...this.cardTexts]);
  }

  private normalizeCardTexts(cardTexts: string[]): string[] {
    return cardTexts.map((text) => text.trim());
  }

  public process(): TokenBase[] {
    const tokens: TokenBase[] = [];

    while (this.cardTexts.length > 0) {
      const currText = this.cardTexts.shift()!;

      if (currText.startsWith(PREFIX_MATERIALS)) {
        this.handlePrefixMaterials(currText, tokens);
      }
      // Check [Monster Effect]. Eg: Plunder Patrollship Jord
      else if (/\[\s*Monster\s?Effect\s*\]/i.test(currText)) {
        this.handleMonsterEffect(tokens, currText);
      }
      // Check [Pendulum Effect]. Eg: Plunder Patrollship Jord
      else if (/\[\s*Pendulum\s?Effect\s*\]/i.test(currText)) {
        this.handlePendulumEffect(tokens, currText);
      }
      // Check [Flavor Text]. Eg: Odd-Eyes Arc Pendulum Dragon
      else if (/\[\s*Flavor\s?Text\s*\]/i.test(currText)) {
        this.handleMonsterFlavor(tokens, currText);
      }
      // Parenthesis
      else if (currText.startsWith('(') && !/^\(\s*Quick\s+Effect\s*\)/i.test(currText)) {
        this.handleParenthesis(currText, tokens);
      }
      // Condition + quick effect
      else if (currText.endsWith(':')) {
        this.handleCondition(tokens, currText);
      }
      // Activation
      else if (currText.endsWith(';')) {
        tokens.push(new ActivationToken(currText));
      }
      // EFfect
      else if (currText.endsWith('.')) {
        tokens.push(new EffectToken(currText));
      }
      // We need to render every text no matter what
      else {
        tokens.push(new UnknownToken(currText));
      }
    }

    return tokens;
  }

  private handleCondition(tokens: TokenBase[], currText: string) {
    const regex = /(.*)\(Quick\s+Effect\)(.*)/i;
    const matches = regex.exec(currText);

    if (matches) {
      if (matches[1]) {
        tokens.push(new ConditionToken(matches[1]));
      }
      tokens.push(new QuickEffectToken());
      // Must have ':'
      if (matches[2]) {
        tokens.push(new ConditionToken(matches[2]));
      }
    } else {
      tokens.push(new ConditionToken(currText));
    }
  }

  private handleParenthesis(currText: string, tokens: TokenBase[]) {
    let newText = currText;

    while (
      this.cardTexts.length > 0 &&
      !(
        newText.endsWith(')') ||
        // Divine Arsenal AA-ZEUS - Sky Thunder: (Transfer its materials to this card).
        newText.endsWith(').')
      )
    ) {
      const nextText = this.cardTexts.shift()!;
      newText += ' ' + nextText;
    }

    tokens.push(new ParenthesisToken(newText));
  }

  private handlePendulumEffect(tokens: TokenBase[], currText: string) {
    tokens.push(new PendulumEffectToken());

    const newText = currText.replace(/\[\s*Pendulum\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handleMonsterFlavor(tokens: TokenBase[], currText: string) {
    tokens.push(new MonsterFlavorToken());

    const newText = currText.replace(/\[\s*Flavor\s?Text\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handleMonsterEffect(tokens: TokenBase[], currText: string) {
    tokens.push(new MonsterEffectToken());

    const newText = currText.replace(/\[\s*Monster\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handlePrefixMaterials(currText: string, tokens: TokenBase[]) {
    const newText = currText.replace(PREFIX_MATERIALS, '');

    // [ Monster Effect ] 1 Tuner + 1+ non-Tuner monsters
    const regex = /(\[\s*Monster\s?Effect\s*\])\s*(.*)/i; // For pendulum cards
    const matches = regex.exec(newText);

    // Plunder Patrollship Jord
    if (matches) {
      tokens.push(new MonsterEffectToken());
      tokens.push(new MaterialsToken(matches[2]));
    } else {
      tokens.push(new MaterialsToken(newText));
    }
  }
}
