import { CardPopupWatcher } from './card-popup/card-popup-watcher';

async function main() {
  unsafeWindow.cardPopupWatcher = CardPopupWatcher.start();
}

main();
