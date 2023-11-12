declare interface ITamperMonkey {
  /**
   * @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_addStyle
   */
  addStyle(css: string): void;
  /**
   * @see https://www.tampermonkey.net/documentation.php?locale=en#api:GM_notification
   */
  notification(details: string, onDone?: () => void): void;
}

declare const unsafeWindow: any;
declare const GM: ITamperMonkey;

declare module '*.css';
