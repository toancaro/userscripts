import { CardPopupWatcher } from './card-popup/card-popup-watcher';
import { DefaultSorting } from './default-sorting/default-sorting';
import { SearchModal } from './search-modal/search-modal';
import { SettingPopup } from './setting-popup/setting-popup';

async function main() {
  unsafeWindow.cardPopupWatcher = CardPopupWatcher.start();
  unsafeWindow.settingPopup = SettingPopup.initialize();
  unsafeWindow.defaultSorting = DefaultSorting.initialize();
  unsafeWindow.searchModal = SearchModal.initialize();
}

main();
