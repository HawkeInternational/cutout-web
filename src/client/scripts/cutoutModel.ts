/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />

'use strict';

import { Cutout, Outline } from './cutouts';

export class CutoutModel {
    private _document: SVG.Doc;
    private _clientRect: ClientRect;
    private _outline: Outline;
    private _cutouts: Cutout[];
    private _selection: Cutout[];

    constructor(document: SVG.Doc) {
        this._document = document;
        this._clientRect = this._document.node.getBoundingClientRect();
        this._cutouts = [];
        this._selection = [];
    }

    public get document(): SVG.Doc {
        return this._document;
    }

    public get selection(): Cutout[] {
        return this._selection;
    }

    public addCutout(cutout: Cutout): void {
        cutout.add(this.document, this._clientRect);
        this._cutouts.push(cutout);
    }

    public addOutline(outline: Outline): void {
        outline.add(this.document, this._clientRect);
    }

    public getCutoutById(id: string): Cutout {
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout = this._cutouts[i];

            if (cutout.element.node.id === id) {
                return cutout;
            }
            if (cutout.element instanceof SVG.G) {
                let group = (<SVG.G>cutout.element);

                for (let j = 0; j < group.children().length; j++) {
                    let childElement = group.get(j);

                    if (childElement.node.id === id) {
                        return cutout;
                    }
                }
            }
        }
        return null;
    }

    public removeCutout(cutout: Cutout): void {
        cutout.remove();
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout2 = this._cutouts[i];

            if (cutout2.element.node.id === cutout.element.node.id) {
                this._cutouts.splice(i, 1);
            }
        }
    }

    public selectCutout(cutout: Cutout, select = true): void {
        let group: SVG.G = <SVG.G> cutout.element;
        
        group.children().forEach((element) => {
            if (select) {
                element.addClass('selected');
            }
            else {
                element.removeClass('selected');
            }
        });
        if (select) {
            this._selection.push(cutout);
        }
        else {
            for (let i = 0; i < this._selection.length; i++) {
                if (this._selection[i].element.id() === cutout.element.id()) {
                    this.selection.splice(i, 1);
                    break;
                }
            }
        }
    }
}
