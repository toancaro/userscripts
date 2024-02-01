export class SettingPopup {
  private constructor() {
    GM.registerMenuCommand('Settings', (event) => {
      alert('Not implemented');
    });
  }

  public static initialize(): SettingPopup {
    const popup = new SettingPopup();
    return popup;
  }
}
