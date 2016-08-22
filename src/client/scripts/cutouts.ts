/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />

'use strict';

export interface Cutout {
    x: number;
    y: number;
    height: number;
    width: number;
    safeHeight: number;
    safeWidth: number;
    element: SVG.Element;

    add(document: SVG.Doc, clientRect: ClientRect): SVG.Element;
    //move(x: number, y: number): void;
    showClash(show: boolean): void;
    showZone(show: boolean): void;
    remove(): void;
}

export class CircularCutout implements Cutout {
    private _document: SVG.Doc;
    private _group: SVG.G;
    private _size: string;
    private _diameter: number;
    private _keepoutZoneDiameter: number;
    private _x: number;
    private _y: number;

    constructor(size: string) {
        this._size = size;
        this._diameter = parseFloat(this._size);
        this._keepoutZoneDiameter = this._diameter * 2.0;
    }

    public get element(): SVG.Element {
        return this._group;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get height(): number {
        return this._diameter;
    }

    public get width(): number {
        return this._diameter;
    }

    public get safeHeight(): number {
        return this._keepoutZoneDiameter;
    }

    public get safeWidth(): number {
        return this._keepoutZoneDiameter;
    }

    public get size(): string {
        return this._size;
    }

    public set size(value: string) {
        this._diameter = parseFloat(value);
        this._keepoutZoneDiameter = this._diameter * 2.0;
        let outline: SVG.Circle = (<SVG.Circle> this._group.get(0));

        outline.radius(this._diameter * 0.5);
        if (this._group.children().length === 2) {
            let keepoutZone: SVG.Circle = (<SVG.Circle> this._group.get(1));

            keepoutZone.radius(this._keepoutZoneDiameter * 0.5);
        }
    }

    public add(document: SVG.Doc, clientRect: ClientRect): SVG.Element {
        this._document = document;
        this._group = document.group();
        let outline = document.circle(this._diameter);

        outline.addClass('cutout-outline');
        this._group.add(outline);
        let keepoutZone = document.circle(this._keepoutZoneDiameter);

        keepoutZone.addClass('cutout-keepoutzone');
        keepoutZone.x((this._diameter - this._keepoutZoneDiameter) * 0.5);
        keepoutZone.y((this._diameter - this._keepoutZoneDiameter) * 0.5);
        this._group.add(keepoutZone);
        return this._group;
    }

    public showClash(show: boolean): void {
        if (show) {
            this._group.children().forEach((element) => {
                element.addClass('clash');
            });
        }
        else {
            this._group.children().forEach((element) => {
                element.removeClass('clash');
            });
        }
    }

    public showZone(show: boolean): void {
        if (show) {
            this._group.get(1).show();
        }
        else {
            this._group.get(1).hide();
        }
    }

    public remove(): void {
        if (this._group) {
            this._group.remove();
        }
    }
}

export interface Outline {
    add(document: SVG.Doc, clientRect: ClientRect): void;
}

export class RectangularOutline implements Outline {
    private _width: number;
    private _height: number;
    private _element: SVG.Element;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public add(document: SVG.Doc, clientRect: ClientRect): void {
        document.clear();
        let xoffset = (clientRect.width - this._width) / 2;
        let yoffset = (clientRect.height - this._height) / 2;

        this._element = document.rect(this._width, this._height);
        this._element.x(xoffset);
        this._element.y(yoffset);
        this._element.fill({
            color: 'none'
        });
        this._element.stroke({
            color: '#fff',
            width: 2
        });
    }
}
