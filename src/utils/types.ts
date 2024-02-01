declare interface ITamperMonkey {
  /**
   * @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_addStyle
   */
  addStyle(css: string): void;
  /**
   * @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_notification
   */
  notification(details: string, onDone?: () => void): void;
  /**
   * @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_registerMenuCommand
   */
  registerMenuCommand(
    name: string,
    callback?: (event: MouseEvent | KeyboardEvent) => void,
    options_or_accessKey?: string | IMenuCommandOptions
  ): Promise<number>;
}

declare interface IMenuCommandOptions {
  /**
   * An optional number that was returned by a previous GM_registerMenuCommand call.
   * If specified, the according menu item will be updated with the new options.
   * If not specified or the menu item can't be found, a new menu item will be created.
   */
  id?: number | string;
  /**
   * An optional access key for the menu item.
   * This can be used to create a shortcut for the menu item.
   * For example, if the access key is "s", the user can select the menu item by pressing "s" when Tampermonkey's popup-menu is open.
   * Please note that there are browser-wide shortcuts configurable to open Tampermonkey's popup-menu.
   */
  accessKey?: string;
  /**
   * An optional boolean parameter that specifies whether the popup menu should be closed after the menu item is clicked.
   * The default value is true.
   * Please note that this setting has no effect on the menu command section that is added to the page's context menu.
   */
  autoClose?: boolean;
  /**
   * An optional string that specifies the title of the menu item.
   * This is displayed as a tooltip when the user hovers the mouse over the menu item.
   */
  title?: string;
}

declare const unsafeWindow: any;
declare const GM: ITamperMonkey;

declare module '*.css';
