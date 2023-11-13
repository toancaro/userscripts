import { CardTextProcessor } from '../card-text/card-text-processor';
import { CardTextRenderer } from '../card-text/card-text-renderer';
import styles from '../card-text/card-text-renderer.css';
import { assertIsDefined } from '../utils/assertion';
import { PREFIX_MATERIALS } from '../utils/constants';
import { logger } from '../utils/logger';

export class CardPopupWatcher {
  private readonly observer: MutationObserver;
  private static started = false;

  private constructor(targetNode: HTMLElement) {
    // Options for the observer (which mutations to observe)
    const config: MutationObserverInit = {
      attributes: false,
      childList: true,
      subtree: false,
    };

    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationList, observer) => {
      // console.log('[mm] Mutation list', mutationList);
      for (const mutation of mutationList) {
        for (const addedNode of mutation.addedNodes) {
          this.processAddedNode(addedNode as Element);
        }
      }
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    this.observer.observe(targetNode, config);
  }

  private processAddedNode(addedNode: Element): void {
    logger.debug('Process added node to tooltip-root', addedNode);

    const cardDescContainer = addedNode.querySelector<HTMLElement>(`.card-desc`);
    assertIsDefined(cardDescContainer, 'Cannot find card desc container');

    // If this node this process before -> do nothing now
    if (cardDescContainer.dataset.processed) return;
    cardDescContainer.dataset.processed = 'true';

    const cardTexts: string[] = [];
    cardDescContainer.childNodes.forEach((level1Child) => {
      level1Child.childNodes.forEach((level2Child) => {
        let text = level2Child.textContent;

        // Not null and not white spaces
        if (text && !/^\s*$/.test(text)) {
          if (level1Child instanceof HTMLElement && level1Child.classList.contains('materials')) {
            text = PREFIX_MATERIALS + text;
          }

          cardTexts.push(text);
        }
      });
    });

    const tokens = new CardTextProcessor(cardTexts).process();
    logger.debug('Tokens', tokens);

    const renderer = new CardTextRenderer(cardDescContainer, tokens);
    renderer.render();
  }

  public static start(): CardPopupWatcher | undefined {
    if (this.started) {
      throw new Error(`Cannot start a new ${CardPopupWatcher.name} because another one already started`);
    }
    this.started = true;

    GM.addStyle(styles);

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('tooltip-root');

    let watcher: CardPopupWatcher | undefined;
    if (targetNode) {
      watcher = new CardPopupWatcher(targetNode);
    } else {
      GM.notification('Cannot find #tooltip-root');
    }

    return watcher;
  }
}
