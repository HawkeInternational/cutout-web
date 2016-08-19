declare function SVG(element: string): SVG.Doc;

declare module SVG {
    export class LinkedHTMLElement extends HTMLElement {
    }

    export class Element {
        node: LinkedHTMLElement;

        addClass(name: string): Element;
        fill(options: {
            color?: string;
            opacity?: number;
        }): Element;
        hide(): Element;
        id(): string;
        id(id: string): string;
        remove(): Element;
        removeClass(name: string): Element;
        show(): Element;
        stroke(options: {
            color?: string;
            dasharray?: string;
            opacity?: number;
            width?: number;
        }): Element;
        transform(): Matrix;
        transform(t: Matrix): Element;
        translate(x: number, y: number): Element;
        visible(): boolean;
        x(): number;
        x(value: number): Element;
        y(): number;
        y(value: number): Element;
    }

    export class Shape extends Element {
    }

    export class Circle extends Shape {
        radius(): number;
        radius(radius: number): SVG.Circle;
    }

    export class Parent extends Element {
        add(element: Element, index?: number): Parent;
        children(): SVG.Element[];
        get(index: number): Element;
        put(element: Element, index: number): Element;
    }

    export class Container extends Parent {
    }

    export class G extends Container {
    }

    export class Doc extends Container {
        circle(diameter: number): Element;
        clear(): Doc;
        group(): G;
        on(event: string, callback: Function): void;
        rect(w: number, h: number): Element;
    }
    export class Matrix {
        constructor();
        constructor(value: string);
    }
}