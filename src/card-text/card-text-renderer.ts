import { logger } from '../utils/logger';
import { utils } from '../utils/utils';
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
import { assertIsDefined } from '../utils/assertion';

export class CardTextRenderer {
  private currOl?: HTMLOListElement;
  private currLi?: HTMLLIElement;

  public constructor(private readonly cardDescContainer: HTMLElement, private readonly tokens: TokenBase[]) {}

  public render(): void {
    logger.debug('Card description container', this.cardDescContainer);
    logger.debug('Tokens', [...this.tokens]);

    // Clear all children
    this.cardDescContainer.textContent = null;
    this.cardDescContainer.classList.add('card-desc-custom');

    for (let i = 0; i < this.tokens.length; i += 1) {
      const currToken = this.tokens[i];
      const prevToken = i === 0 ? null : this.tokens[i - 1];

      if (currToken instanceof PendulumEffectToken) {
        this.handlePendulumEffect(currToken);
      }
      //
      else if (currToken instanceof MonsterEffectToken) {
        this.handleMonsterEffect(currToken);
      }
      //
      else if (currToken instanceof MonsterFlavorToken) {
        this.handleMonsterFlavor(currToken);
      }
      //
      else if (currToken instanceof MaterialsToken) {
        this.handleMaterials(currToken);
      }
      //
      else if (currToken instanceof ConditionToken) {
        this.handleCondition(currToken, prevToken);
      }
      //
      else if (currToken instanceof ActivationToken) {
        this.handleActivation(currToken, prevToken);
      }
      //
      else if (currToken instanceof EffectToken) {
        this.handleEffect(currToken, prevToken);
      }
      //
      else if (currToken instanceof ParenthesisToken) {
        this.handleParenthesis(currToken);
      }
      //
      else if (currToken instanceof QuickEffectToken) {
        this.handleQuickEffect(currToken, prevToken);
      }
      //
      else if (currToken instanceof UnknownToken) {
        this.handleUnknown(currToken);
      }
    }
  }

  private handleCondition(currToken: ConditionToken, prevToken: ActivationToken | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Condition always starts new <li> if previous token is not a (Quick Effect)
    if (!(prevToken instanceof QuickEffectToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const span = utils.htmlToElement(`<span class="condition">${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleActivation(currToken: ActivationToken, prevToken: ActivationToken | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Only create new li if previous token is null, or NOT a activation
    if (prevToken == null || !(prevToken instanceof ConditionToken || prevToken instanceof QuickEffectToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const space = prevToken instanceof ConditionToken ? ' ' : '';
    const span = utils.htmlToElement(`<span class="activation">${space}${currToken.getText()}</span>`);

    this.currLi!.appendChild(span);
  }

  private handleEffect(currToken: EffectToken, prevToken: ActivationToken | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Only create new li if previous token is null, or NOT a activation or condtion
    if (prevToken == null || !(prevToken instanceof ConditionToken || prevToken instanceof ActivationToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const space = prevToken instanceof ConditionToken || prevToken instanceof ActivationToken ? ' ' : '';
    const clazz =
      prevToken instanceof ConditionToken || prevToken instanceof ActivationToken
        ? 'effect-chainable'
        : 'effect-inherent';
    const span = utils.htmlToElement(`<span class="${clazz}">${space}${currToken.getText()}</span>`);

    this.currLi!.appendChild(span);
  }

  private handleQuickEffect(currToken: QuickEffectToken, prevToken: ActivationToken | null) {
    this.createNewOList({ onlyWhenNull: true });

    // Create a new li if previous is not a condition
    if (!(prevToken instanceof ConditionToken)) {
      this.createNewLI({ onlyWhenNull: false });
    }

    const space = prevToken instanceof ConditionToken ? ' ' : '';
    const span = utils.htmlToElement(`<span class="quick-effect">${space}${currToken.getText()}</span>`);

    this.currLi!.appendChild(span);
  }

  private handleParenthesis(currToken: ParenthesisToken) {
    this.createNewOList({ onlyWhenNull: true });
    this.createNewLI({ onlyWhenNull: false }); // Always create

    const span = utils.htmlToElement(`<span class="parenthesis">${currToken.getText()}</span>`);
    this.currLi!.appendChild(span);
  }

  private handleMaterials(currToken: MaterialsToken) {
    const span = utils.htmlToElement(`<span class="materials">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handlePendulumEffect(currToken: PendulumEffectToken) {
    this.currOl = this.currLi = undefined;

    const span = utils.htmlToElement(`<span class="pendulum-effect">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handleMonsterEffect(currToken: MonsterEffectToken) {
    this.currOl = this.currLi = undefined;

    const span = utils.htmlToElement(`<span class="monster-effect">${currToken.getText()}</span>`);
    this.cardDescContainer.appendChild(span);
  }

  private handleMonsterFlavor(currToken: MonsterFlavorToken) {
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
