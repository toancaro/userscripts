export interface ITextElement {
  /**
   * Render to html text.
   */
  render(): string;
}

export abstract class TextElementBase implements ITextElement {
  /**
   * Render to HTML text.
   */
  public abstract render(): string;
}

/**
 * Simple plain text.
 */
export class PlainTextElement extends TextElementBase {
  public constructor(private readonly text: string) {
    super();
  }

  public render(): string {
    return this.text;
  }
}

export class CompositeTextElement extends TextElementBase {
  private readonly children: ITextElement[];

  public constructor(children: ITextElement[]) {
    super();
    this.children = [...children];
  }

  public render(): string {
    let result = '';

    this.children.forEach((child) => {
      result += child.render();
    });

    return result;
  }

  public addChild(child: ITextElement): void {
    this.children.push(child);
  }

  public getChild(): ITextElement[] {
    return this.children;
  }
}
