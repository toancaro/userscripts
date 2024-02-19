import { PREFIX_MATERIALS } from '../../utils/constants';
import { CompositeTextElement } from './01.text-element';
import { EffectListText } from './11.effect-list-text';
import { MonsterEffectText as HeaderMonsterEffectText } from './header-monster-effect-text';
import { HeaderMonsterFlavorText } from './header-monster-flavor-text';
import { HeaderPendulumEffectText } from './header-pendulum-effect-text';
import { MaterialsText } from './materials-text';

/**
 * Whole text of a card.
 */
export class CardText extends CompositeTextElement {
  /**
   * [
    "$MATERIALS$1 Tuner + 1+ non-Tuner monsters",
    "Once per turn:",
    "You can target 1 card on the field;",
    "destroy it.",
    "Once while face-up on the field, when a card or effect is activated (Quick Effect):",
    "You can negate the activation, and if you do, destroy that card.",
    "You can only use the previous effect of \"Baronne de Fleur\" once per turn.",
    "Once per turn, during the Standby Phase:",
    "You can target 1 Level 9 or lower monster in your GY;",
    "return this card to the Extra Deck, and if you do, Special Summon that monster."
   ]
   */
  private readonly cardTexts: string[];

  public constructor(cardTexts: string[]) {
    super([]);
    this.cardTexts = cardTexts.map((text) => text.trim()).filter(Boolean);
    this.processTexts();
  }

  private processTexts(): void {
    while (this.cardTexts.length > 0) {
      const currText = this.cardTexts.shift()!;

      if (currText.startsWith(PREFIX_MATERIALS)) {
        this.handlePrefixMaterials(currText);
      }
      // Check [Monster Effect]. Eg: Plunder Patrollship Jord
      else if (/\[\s*Monster\s?Effect\s*\]/i.test(currText)) {
        this.handleMonsterEffect(currText);
      }
      // Check [Pendulum Effect]. Eg: Plunder Patrollship Jord
      else if (/\[\s*Pendulum\s?Effect\s*\]/i.test(currText)) {
        this.handlePendulumEffect(currText);
      }
      // Check [Flavor Text]. Eg: Odd-Eyes Arc Pendulum Dragon
      else if (/\[\s*Flavor\s?Text\s*\]/i.test(currText)) {
        this.handleMonsterFlavor(currText);
      }
      // Get effect list
      else {
        this.handEffectList(currText);
      }
      // // Parenthesis
      // else if (currText.startsWith('(') && !/^\(\s*Quick\s+Effect\s*\)/i.test(currText)) {
      //   this.handleParenthesis(currText, tokens);
      // }
      // // Bullet ●
      // else if (currText.startsWith('●')) {
      //   this.handleBullet(tokens, currText);
      // }
      // // Condition + quick effect
      // else if (currText.endsWith(':')) {
      //   this.handleCondition(tokens, currText);
      // }
      // // Activation
      // else if (currText.endsWith(';')) {
      //   tokens.push(new ActivationText(currText));
      // }
      // // Effect
      // else if (currText.endsWith('.')) {
      //   this.handleEffect(tokens, currText);
      // }
      // // We need to render every text no matter what
      // else {
      //   tokens.push(new UnknownToken(currText));
      // }
    }
  }

  private handlePrefixMaterials(currText: string) {
    const newText = currText.replace(PREFIX_MATERIALS, '');

    // [ Monster Effect ] 1 Tuner + 1+ non-Tuner monsters
    const regex = /(\[\s*Monster\s?Effect\s*\])\s*(.*)/i; // For pendulum cards
    const matches = regex.exec(newText);

    // Plunder Patrollship Jord
    if (matches) {
      this.addChild(new HeaderMonsterEffectText());
      this.addChild(new MaterialsText(matches[2]));
    } else {
      this.addChild(new MaterialsText(newText));
    }
  }

  private handleMonsterEffect(currText: string) {
    this.addChild(new HeaderMonsterEffectText());

    // Check [Monster Effect]. Eg: Plunder Patrollship Jord
    // Some cards have [Monster Effect] but not .materials class.
    const newText = currText.replace(/\[\s*Monster\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handlePendulumEffect(currText: string) {
    this.addChild(new HeaderPendulumEffectText());

    // Some cards have [Pendulum Effect] but not .materials class.
    const newText = currText.replace(/\[\s*Pendulum\s?Effect\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  /**
   * For pendulum normal monsters.
   */
  private handleMonsterFlavor(currText: string) {
    this.addChild(new HeaderMonsterFlavorText());

    const newText = currText.replace(/\[\s*Flavor\s?Text\s*\]\s*/i, '').trim();
    if (newText) {
      this.cardTexts.unshift(newText);
    }
  }

  private handEffectList(currText: string) {
    const isEffectText = (text: string): boolean => {
      // Not above conditions
      return (
        !text.startsWith(PREFIX_MATERIALS) &&
        !/\[\s*Monster\s?Effect\s*\]/i.test(text) &&
        !/\[\s*Pendulum\s?Effect\s*\]/i.test(text) &&
        !/\[\s*Flavor\s?Text\s*\]/i.test(text)
      );
    };

    const effects: string[] = [currText];
    while (this.cardTexts.length > 0 && isEffectText(this.cardTexts[0])) {
      effects.push(this.cardTexts.shift()!);
    }

    this.addChild(new EffectListText(effects));
  }
}

// /**
//  * During your opponent's Main Phase (Quick Effect):
//  */
// export class ConditionText extends TextElementBase {}

// /**
//  * You can send this card from your hand to the GY, then target 1 Effect Monster your opponent controls;
//  */
// export class ActivationText extends TextElementBase {}

// /**
//  * negate the effects of that face-up monster your opponent controls, until the end of this turn.
//  * (text comes after condition or activation)
//  */
// export class ChainableEffectText extends TextElementBase {}

// /**
//  * Text does not come after condition or activation.
//  */
// export class InherentEffectText extends TextElementBase {}

// /**
//  * (This Token's ATK/DEF become the combined original ATK/DEF of the Tributed monsters.)
//  * (This card's original Rank is always treated as 1. This card is always treated as a "Utopic Future" card.)
//  * (Transfer its materials to this card.)
//  */
// export class ParenthesisText extends TextElementBase {}

// export class QuickEffectText extends TextElementBase {
//   public constructor() {
//     // No semicolon after this because we want to make this color diferently, while keep the ':' color as effect text.
//     super('(Quick Effect)');
//   }
// }

// export class BulletToken extends TextElementBase {
//   public constructor() {
//     super('●');
//   }
// }

// /**
//  * For unexpected text. We need to render every text no matter what.
//  */
// export class UnknownToken extends TextElementBase {}
