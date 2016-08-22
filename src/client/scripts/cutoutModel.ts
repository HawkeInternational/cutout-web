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

    public cutoutFromPoint(x: number, y: number): Cutout {
        let mindist: number = NaN;
        let index: number = -1;

        for (let i: number = 0; i < this._cutouts.length; i++) {
            let cutout: Cutout = this._cutouts[i];
            let bbox = cutout.element.tbox();
            let radius = Math.max(bbox.w, bbox.h) * 0.7;
            // uncomment for debugging
            /*let l = this.document.line(x - this._clientRect.left, y - this._clientRect.top, bbox.cx, bbox.cy);

            l.stroke({
                color: '#ff0000'
            });*/
            let dist: number = CutoutModel.distance(x - this._clientRect.left, y - this._clientRect.top, bbox.cx, bbox.cy);

            if (dist <= radius) {
                if (index === -1) {
                    mindist = dist;
                    index = i;
                }
                else {
                    if (dist < mindist) {
                        mindist = dist;
                        index = i;
                    }
                }
            }
        }
        if (index >= 0) {
            return this._cutouts[index];
        }
        return null;
    }

    public getCutoutById(id: string): Cutout {
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout = this._cutouts[i];

            if (cutout.element.id() === id) {
                return cutout;
            }
            if (cutout.element instanceof SVG.G) {
                let group = (<SVG.G>cutout.element);

                for (let j = 0; j < group.children().length; j++) {
                    let childElement = group.get(j);

                    if (childElement.id() === id) {
                        return cutout;
                    }
                }
            }
        }
        return null;
    }

    public moveCutout(cutout: Cutout, x: number, y: number): void {
        let group = <SVG.G> cutout.element;

        if (group) {
            group.translate(x - this._clientRect.left - cutout.width * 0.5, y - this._clientRect.top - cutout.height * 0.5);
        }
        // get bounding box of cutout
        let bbox1: SVG.TBox = group.tbox();
        let safeRadius1: number = Math.max(cutout.safeHeight, cutout.safeWidth) * 0.5;
        let numClashes: number = 0;

        // check for collision
        for (let i = 0; i < this._cutouts.length; i++) {
            let otherCutout: Cutout = this._cutouts[i];

            if (cutout.element.id() === otherCutout.element.id()) {
                continue;
            }
            let bbox2: SVG.TBox = otherCutout.element.tbox();
            let safeRadius2: number = Math.max(otherCutout.safeHeight, otherCutout.safeWidth) * 0.5;
            let dist: number = CutoutModel.distance(bbox1.cx, bbox1.cy, bbox2.cx, bbox2.cy);

            if (dist <= (safeRadius1 + safeRadius2)) {
                otherCutout.showZone(true);
                otherCutout.showClash(true);
                numClashes++;
            }
            else {
                otherCutout.showZone(false);
                otherCutout.showClash(false);
            }
        }
        if (numClashes > 0) {
            cutout.showClash(true);
        }
        else {
            cutout.showClash(false);
        }
    }

    public removeCutout(cutout: Cutout): void {
        cutout.remove();
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout2 = this._cutouts[i];

            if (cutout2.element.id() === cutout.element.id()) {
                this._cutouts.splice(i, 1);
            }
        }
    }

    public selectCutout(cutout: Cutout, select = true): void {
        cutout.showSelected(select);
        for (let i = 0; i < this._selection.length; i++) {
            if (this._selection[i].element.id() === cutout.element.id()) {
                if (select) {
                    return; // already added - do nothing
                }
                else {
                    this.selection.splice(i, 1);
                    break;
                }
            }
        }
        if (select) {
            this._selection.push(cutout);
        }

    }

    private static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}
