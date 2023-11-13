export abstract class TokenBase {
  public constructor(protected readonly text: string) {}

  public getText(): string {
    return this.text;
  }
}

/**
 * 2 Level 10 Monsters
 */
export class MaterialsToken extends TokenBase {}

/**
 * During your opponent's Main Phase (Quick Effect):
 */
export class ConditionToken extends TokenBase {}

/**
 * You can send this card from your hand to the GY, then target 1 Effect Monster your opponent controls;
 */
export class ActivationToken extends TokenBase {}

/**
 * negate the effects of that face-up monster your opponent controls, until the end of this turn.
 * (text comes after condition or activation)
 */
export class ChainableEffectToken extends TokenBase {}

/**
 * Text does not come after condition or activation.
 */
export class InherentEffectToken extends TokenBase {}

/**
 * [Pendulum Effect]
 */
export class PendulumEffectToken extends TokenBase {
  public constructor() {
    super('[Pendulum Effect]');
  }
}

/**
 * [Monster Effect]
 */
export class MonsterEffectToken extends TokenBase {
  public constructor() {
    super('[Monster Effect]');
  }
}

export class MonsterFlavorToken extends TokenBase {
  public constructor() {
    super('[Flavor Effect]');
  }
}

/**
 * (This Token's ATK/DEF become the combined original ATK/DEF of the Tributed monsters.)
 * (This card's original Rank is always treated as 1. This card is always treated as a "Utopic Future" card.)
 * (Transfer its materials to this card.)
 */
export class ParenthesisToken extends TokenBase {}

export class QuickEffectToken extends TokenBase {
  public constructor() {
    // No semicolon after this because we want to make this color diferently, while keep the ':' color as effect text.
    super('(Quick Effect)');
  }
}

export class BulletToken extends TokenBase {
  public constructor() {
    super('●');
  }
}

/**
 * For unexpected text. We need to render every text no matter what.
 */
export class UnknownToken extends TokenBase {}
