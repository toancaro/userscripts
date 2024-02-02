export class SearchModal {
  private constructor() {
    this.updateStyle();
  }

  private updateStyle() {
    GM.addStyle(`
      .dlm-modal.search-modal {
        width: 968px !important;
      }

      .dlm-modal.search-modal .content.scrollbar > div {
        --desktopRowSize: 10 !important;
        --maxWidth: 1040px !important;
      }
    `);
  }

  public static initialize(): SearchModal {
    const modal = new SearchModal();
    return modal;
  }
}
