/// <reference path='../../../typings/svgjs/svgjs.d.ts' />

'use strict';

/**
 * Base interface for outline
 */
export interface Outline {
    element: SVG.Element;

    add(document: SVG.Doc, clientRect: ClientRect): void;
}

/**
 * Implementation of rectangular outline
 */
export class RectangularOutline implements Outline {
    private _width: number;
    private _height: number;
    private _element: SVG.Element;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public get element(): SVG.Element {
        return this._element;
    }

    public add(document: SVG.Doc, clientRect: ClientRect): void {
        document.clear();
        let xoffset = (clientRect.width - this._width) / 2;
        let yoffset = (clientRect.height - this._height) / 2;

        this._element = document.rect(this._width, this._height);
        this._element.x(xoffset);
        this._element.y(yoffset);
        this._element.addClass('outline');
    }
}
