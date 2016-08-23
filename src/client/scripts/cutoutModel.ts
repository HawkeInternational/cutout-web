/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />
/// <reference path='../../../typings/kld/kld.d.ts' />

'use strict';

import { Cutout, Outline } from './cutouts';

export class CutoutModel {
    private _document: SVG.Doc;
    private _clientRect: ClientRect;
    private _outline: Outline;
    private _cutouts: Cutout[];

    constructor(document: SVG.Doc) {
        this._document = document;
        this._clientRect = this._document.node.getBoundingClientRect();
        this._cutouts = [];
    }

    public get document(): SVG.Doc {
        return this._document;
    }

    public get selection(): Cutout[] {
        let result: Cutout[] = [];

        this._cutouts.forEach((cutout: Cutout) => {
            if (cutout.selected) {
                result.push(cutout);
            }
        });
        return result;
    }

    public addCutout(cutout: Cutout): void {
        cutout.add(this.document, this._clientRect);
        this._cutouts.push(cutout);
    }

    public addOutline(outline: Outline): void {
        outline.add(this.document, this._clientRect);
        this._outline = outline;
        this._cutouts = [];
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

        // check collision against outline
        let bbox2: SVG.TBox = this._outline.element.tbox();
        let halfHeight = bbox2.h * 0.5;
        let halfWidth = bbox2.w * 0.5;
        let outlineShape = IntersectionParams.newRect(bbox2.cx - halfWidth, bbox2.cy - halfHeight, bbox2.w, bbox2.h);
        let cutoutShape = IntersectionParams.newCircle(new Point2D(bbox1.cx, bbox1.cy), safeRadius1);
        let result = Intersection.intersectShapes(outlineShape, cutoutShape);

        if (result.points.length > 0) {
            numClashes++;
        }
        else {
            // check if it's outside
            let dist1 = Math.abs(bbox1.cx - bbox2.cx);
            let dist2 = Math.abs(bbox1.cy - bbox2.cy);

            if ((dist1 > (halfWidth + safeRadius1)) || (dist2 > (halfHeight + safeRadius1))) {
                numClashes++;
            }
        }
        // check for collision
        for (let i = 0; i < this._cutouts.length; i++) {
            let otherCutout: Cutout = this._cutouts[i];

            if (cutout.element.id() === otherCutout.element.id()) {
                continue;
            }
            let bbox3: SVG.TBox = otherCutout.element.tbox();
            let safeRadius2: number = Math.max(otherCutout.safeHeight, otherCutout.safeWidth) * 0.5;
            let otherShape = IntersectionParams.newCircle(new Point2D(bbox3.cx, bbox3.cy), safeRadius2);
            let result = Intersection.intersectShapes(cutoutShape, otherShape);

            if (result.points.length > 0) {
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
        let group = <SVG.G>cutout.element;

        if (group) {
            group.remove();
        }
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout2 = this._cutouts[i];

            if (cutout2.element.id() === cutout.element.id()) {
                this._cutouts.splice(i, 1);
            }
        }
    }

    public selectCutout(cutout: Cutout, select = true): void {
        cutout.showSelected(select);
    }

    private static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}
