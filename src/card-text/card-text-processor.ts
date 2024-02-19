import { PREFIX_MATERIALS } from '../utils/constants';
import { logger } from '../utils/logger';
import {
  ActivationText,
  BulletToken,
  ChainableEffectText,
  ConditionText,
  InherentEffectText,
  ParenthesisText,
  PendulumEffectText,
  QuickEffectText,
  UnknownToken,
} from './text-elements/02.card-text';
import { HeaderMonsterFlavorText } from './text-elements/header-monster-flavor-text';
import { MonsterEffectText } from './text-elements/header-monster-effect-text';
import { MaterialsText } from './text-elements/materials-text';
import { TextElementBase } from './text-elements/01.text-element';

export class CardTextProcessor {
  private readonly cardTexts: string[];

  public constructor(cardTexts: string[]) {
    this.cardTexts = this.normalizeCardTexts(cardTexts);
    logger.debug('Card texts: ', [...this.cardTexts]);
  }

  private normalizeCardTexts(cardTexts: string[]): string[] {
    return cardTexts.map((text) => text.trim());
  }

  public process(): TextElementBase[] {
    const tokens: TextElementBase[] = [];

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
      // Bullet ●
      else if (currText.startsWith('●')) {
        this.handleBullet(tokens, currText);
      }
      // Condition + quick effect
      else if (currText.endsWith(':')) {
        this.handleCondition(tokens, currText);
      }
      // Activation
      else if (currText.endsWith(';')) {
        tokens.push(new ActivationText(currText));
      }
      // Effect
      else if (currText.endsWith('.')) {
        this.handleEffect(tokens, currText);
      }
      // We need to render every text no matter what
      else {
        tokens.push(new UnknownToken(currText));
      }
    }

    return tokens;
  }

  private handleEffect(tokens: TextElementBase[], currText: string) {
    const prevToken = tokens[tokens.length - 1];

    if (prevToken instanceof ConditionText || prevToken instanceof ActivationText) {
      tokens.push(new ChainableEffectText(currText));
    } else {
      tokens.push(new InherentEffectText(currText));
    }
  }

  private handleBullet(tokens: TextElementBase[], currText: string) {
    tokens.push(new BulletToken());

    const newText = currText.replace(/\s*●\s*/, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handleCondition(tokens: TextElementBase[], currText: string) {
    const regex = /(.*)\(Quick\s+Effect\)(.*)/i;
    const matches = regex.exec(currText);

    if (matches) {
      if (matches[1]) {
        tokens.push(new ConditionText(matches[1]));
      }
      tokens.push(new QuickEffectText());
      // Must have ':'
      if (matches[2]) {
        tokens.push(new ConditionText(matches[2]));
      }
    } else {
      tokens.push(new ConditionText(currText));
    }
  }

  private handleParenthesis(currText: string, tokens: TextElementBase[]) {
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

    tokens.push(new ParenthesisText(newText));
  }

  private handlePendulumEffect(tokens: TextElementBase[], currText: string) {
    tokens.push(new PendulumEffectText());

    const newText = currText.replace(/\[\s*Pendulum\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handleMonsterFlavor(tokens: TextElementBase[], currText: string) {
    tokens.push(new HeaderMonsterFlavorText());

    const newText = currText.replace(/\[\s*Flavor\s?Text\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handleMonsterEffect(tokens: TextElementBase[], currText: string) {
    tokens.push(new MonsterEffectText());

    const newText = currText.replace(/\[\s*Monster\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handlePrefixMaterials(currText: string, tokens: TextElementBase[]) {
    const newText = currText.replace(PREFIX_MATERIALS, '');

    // [ Monster Effect ] 1 Tuner + 1+ non-Tuner monsters
    const regex = /(\[\s*Monster\s?Effect\s*\])\s*(.*)/i; // For pendulum cards
    const matches = regex.exec(newText);

    // Plunder Patrollship Jord
    if (matches) {
      tokens.push(new MonsterEffectText());
      tokens.push(new MaterialsText(matches[2]));
    } else {
      tokens.push(new MaterialsText(newText));
    }
  }
}
