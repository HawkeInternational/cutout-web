/// <reference path='../../../typings/svgjs/svgjs.d.ts' />

'use strict';

/**
 * Base interface for cutout
 */
export interface Cutout {
    x: number;
    y: number;
    height: number;
    width: number;
    safeHeight: number;
    safeWidth: number;
    hasClash: boolean;
    selected: boolean;
    size: string;
    element: SVG.Element;

    add(document: SVG.Doc, clientRect: ClientRect): SVG.Element;
    showSelected(show: boolean): void;
    showClash(show: boolean): void;
    showZone(show: boolean): void;
}

/**
 * Implementation of circular cutout
 */
export class CircularCutout implements Cutout {
    private _group: SVG.G;
    private _size: string;
    private _diameter: number;
    private _keepoutZoneDiameter: number;
    private _x: number;
    private _y: number;
    private _hasClash: boolean;
    private _selected: boolean;

    constructor(size: string) {
        this._x = 0;
        this._y = 0;
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

    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
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

    public get hasClash(): boolean {
        return this._hasClash;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public get size(): string {
        return this._size;
    }

    public set size(value: string) {
        this._size = value;
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
        this._hasClash = show;
    }

    public showSelected(show: boolean): void {
        if (show) {
            this._group.children().forEach((element) => {
                element.addClass('selected');
            });
        }
        else {
            this._group.children().forEach((element) => {
                element.removeClass('selected');
            });
        }
        this._selected = show;
    }

    public showZone(show: boolean): void {
        if (show) {
            this._group.get(1).show();
        }
        else {
            this._group.get(1).hide();
        }
    }
}
