export class Utils {
  public htmlToElement<T extends HTMLElement>(html: string): T {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild as T;
  }

  public htmlToElements(html: string): HTMLElement[] {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return Array.from(template.content.childNodes) as HTMLElement[];
  }
}

export const utils = new Utils();
