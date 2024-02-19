import { assertIsDefined } from '../utils/assertion';
import { utils } from '../utils/utils';
import {
  ActivationText,
  BulletToken,
  CardText,
  ChainableEffectText,
  ConditionText,
  InherentEffectText,
  ParenthesisText,
  QuickEffectText,
  UnknownToken,
} from './text-elements/02.card-text';
import { MaterialsText } from './text-elements/materials-text';
import { MonsterEffectText } from './text-elements/header-monster-effect-text';
import { HeaderMonsterFlavorText } from './text-elements/header-monster-flavor-text';

export class CardTextRenderer {
  private currOl?: HTMLOListElement;
  private currLi?: HTMLLIElement;

  public constructor(private readonly cardDescContainer: HTMLElement, private readonly cardText: CardText) {}

  public render(): void {
    // Clear all children
    this.cardDescContainer.textContent = null;
    this.cardDescContainer.classList.add('card-desc-custom');

    const child = utils.htmlToElement(this.cardText.render());
    this.cardDescContainer.appendChild(child);
  }

  // public render(): void {
  //   logger.debug('Card description container', this.cardDescContainer);
  //   logger.debug('Tokens', [...this.tokens]);

  //   // Clear all children
  //   this.cardDescContainer.textContent = null;
  //   this.cardDescContainer.classList.add('card-desc-custom');

  //   for (let i = 0; i < this.tokens.length; i += 1) {
  //     const currToken = this.tokens[i];
  //     const prevToken = i === 0 ? null : this.tokens[i - 1];

  //     if (currToken instanceof PendulumEffectText) {
  //       this.handlePendulumEffect(currToken);
  //     }
  //     //
  //     else if (currToken instanceof MonsterEffectText) {
  //       this.handleMonsterEffect(currToken);
  //     }
  //     //
  //     else if (currToken instanceof MonsterFlavorText) {
  //       this.handleMonsterFlavor(currToken);
  //     }
  //     //
  //     else if (currToken instanceof MaterialsText) {
  //       this.handleMaterials(currToken);
  //     }
  //     //
  //     else if (currToken instanceof ConditionText) {
  //       this.handleCondition(currToken, prevToken);
  //     }
  //     //
  //     else if (currToken instanceof ActivationText) {
  //       this.handleActivation(currToken, prevToken);
  //     }
  //     //
  //     else if (currToken instanceof ChainableEffectText) {
  //       this.handleChainableEffect(currToken);
  //     }
  //     //
  //     else if (currToken instanceof InherentEffectText) {
  //       this.handleInherentEffect(currToken, prevToken);
  //     }
  //     //
  //     else if (currToken instanceof ParenthesisText) {
  //       this.handleParenthesis(currToken);
  //     }
  //     //
  //     else if (currToken instanceof BulletToken) {
  //       this.handleBullet(currToken);
  //     }
  //     //
  //     else if (currToken instanceof QuickEffectText) {
  //       this.handleQuickEffect(currToken, prevToken);
  //     }
  //     //
  //     else if (currToken instanceof UnknownToken) {
  //       this.handleUnknown(currToken);
  //     }
  //   }
  // }

  private handleCondition(currToken: ConditionText, prevToken: ActivationText | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Condition always starts new <li> if previous token is not a (Quick Effect) or a bullet ●
    if (!(prevToken instanceof QuickEffectText || prevToken instanceof BulletToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const span = utils.htmlToElement(`<span class="condition">${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleActivation(currToken: ActivationText, prevToken: ActivationText | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Only create new li if previous token is null, ...
    if (
      prevToken == null ||
      !(prevToken instanceof ConditionText || prevToken instanceof QuickEffectText || prevToken instanceof BulletToken)
    ) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const space = prevToken instanceof ConditionText ? ' ' : '';
    const span = utils.htmlToElement(`<span class="activation">${space}${currToken.getText()}</span>`);

    this.currLi!.appendChild(span);
  }

  private handleChainableEffect(currToken: ChainableEffectText) {
    const span = utils.htmlToElement(`<span class="effect-chainable"> ${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleInherentEffect(currToken: InherentEffectText, prevToken: ActivationText | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Only NOT create li if previous is a bullet
    if (!(prevToken instanceof BulletToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const span = utils.htmlToElement(`<span class="effect-inherent"> ${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleQuickEffect(currToken: QuickEffectText, prevToken: ActivationText | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Create a new li if previous is not a condition or a bullet
    if (!(prevToken instanceof ConditionText || prevToken instanceof BulletToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const space = prevToken instanceof ConditionText ? ' ' : '';
    const span = utils.htmlToElement(`<span class="quick-effect">${space}${currToken.getText()}</span>`);

    this.currLi!.appendChild(span);
  }

  private handleParenthesis(currToken: ParenthesisText) {
    this.createNewOList({ onlyWhenNull: true });
    this.createNewLI({ onlyWhenNull: false }); // Always create

    const span = utils.htmlToElement(`<span class="parenthesis">${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleBullet(currToken: BulletToken) {
    this.createNewOList({ onlyWhenNull: true });
    this.createNewLI({ onlyWhenNull: false }); // Always create

    const span = utils.htmlToElement(`<span class="bullet">${currToken.getText()} </span>`);
    this.currLi!.appendChild(span);
  }

  private handleMaterials(currToken: MaterialsText) {
    const span = utils.htmlToElement(`<span class="materials">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handlePendulumEffect(currToken: PendulumEffectText) {
    this.currOl = this.currLi = undefined;

    const span = utils.htmlToElement(`<span class="pendulum-effect">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handleMonsterEffect(currToken: MonsterEffectText) {
    this.currOl = this.currLi = undefined;

    const span = utils.htmlToElement(`<span class="monster-effect">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handleMonsterFlavor(currToken: HeaderMonsterFlavorText) {
    this.currOl = this.currLi = undefined;

    const span = utils.htmlToElement(`<span class="monster-flavor">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handleUnknown(currToken: UnknownToken) {
    this.createNewOList({ onlyWhenNull: true });
    this.createNewLI({ onlyWhenNull: false });

    const span = utils.htmlToElement(`<span class="unknown">${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private createNewOList(options: { onlyWhenNull: boolean }): HTMLOListElement {
    if (!this.currOl || !options.onlyWhenNull) {
      this.currOl = utils.htmlToElement<HTMLOListElement>('<ol></ol>');
      this.cardDescContainer.appendChild(this.currOl);
    }

    return this.currOl;
  }

  private createNewLI(options: { onlyWhenNull: boolean }): HTMLLIElement {
    assertIsDefined(this.currOl, 'Must create ol before creating li');

    if (!this.currLi || !options.onlyWhenNull) {
      this.currLi = utils.htmlToElement<HTMLLIElement>('<li></li>');
      this.currOl.appendChild(this.currLi);
    }

    return this.currLi;
  }
}
