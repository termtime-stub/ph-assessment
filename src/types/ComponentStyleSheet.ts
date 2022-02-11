export class ComponentStyleSheet {
  static create<Styles extends CSSProperties>(styles: Styles): Styles {
    return styles;
  }
}
