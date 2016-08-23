/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />
/// <reference path='../../../typings/kld/kld.d.ts' />

'use strict';

import { Cutout, Outline } from './cutouts';

export interface CutoutInfo {
    id: string;
    placement: {
        x: number;
        y: number;
    };
    size: string;
}

/**
 * Represents model for cutout placement. Model has one outline and multiple cutouts.
 * In current version the outline is a rectangle and cutouts are circular
 */
export class CutoutModel {
    private _document: SVG.Doc;
    private _clientRect: ClientRect;
    private _outline: Outline;
    private _cutouts: Cutout[];

    /**
     * Creates new model
     * @param {SVG.Doc} document - input SVG document to store graphics.
     */
    constructor(document: SVG.Doc) {
        this._document = document;
        this._clientRect = this._document.node.getBoundingClientRect();
        this._cutouts = [];
    }

    /**
     * Returns information about cutouts ine the model.
     * @return {Array<CutoutInfo>} array of CutoutIinfo items
     */
    public get cutoutInfo(): CutoutInfo[] {
        let result = [];

        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout: Cutout = this._cutouts[i];

            result.push({
                id: cutout.element.id(),
                placement: {
                    x: cutout.x,
                    y: cutout.y
                },
                size: cutout.size
            });
        }
        return result;
    }

    /**
     * Returns associated document.
     * @return {SVG.Doc} document
     */
    public get document(): SVG.Doc {
        return this._document;
    }

    /**
     * Returns selected cutouts.
     * @return {Array<Cutout>} array of cutouts
     */
    public get selection(): Cutout[] {
        let result: Cutout[] = [];

        this._cutouts.forEach((cutout: Cutout) => {
            if (cutout.selected) {
                result.push(cutout);
            }
        });
        return result;
    }

    /**
     * Adds new cutout to the model
     * @param {Cutout} cutout - cutout to add.
     */
    public addCutout(cutout: Cutout): void {
        cutout.add(this.document, this._clientRect);
        this._cutouts.push(cutout);
    }

    /**
     * Adds new outline to the model. If outline already exists then it's replaced
     * by new one and all existing cutouts are removed.
     * @param {Outline} outline - outline to add.
     */
    public addOutline(outline: Outline): void {
        outline.add(this.document, this._clientRect);
        this._outline = outline;
        this._cutouts = [];
    }

    /**
     * Locates cutout gy given coordinates.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @return {Cutout} cutout at given location.
     */
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

    /**
     * Returns cuout by id of its element.
     * @param {string} id - ID of SVG element
     * @return {Cutout} cutout
     */
    public getCutoutById(id: string): Cutout {
        for (let i = 0; i < this._cutouts.length; i++) {
            let cutout = this._cutouts[i];

            if (cutout.element.id() === id) {
                return cutout;
            }
            // check internal elements as well
            if (cutout.element instanceof SVG.G) {
                let group = (<SVG.G> cutout.element);

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

    /**
     * Moves cutout to given location. It also checks possible clashes and invalid location.
     * @param {Cutout} cutout - cutout to move
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
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
        // calculate local coordinates of cutout relative to outline (origin = lower left corner, cartesian)
        let baseX = bbox2.cx - halfWidth;
        let baseY = bbox2.cy + halfHeight;

        cutout.x = bbox1.cx - baseX;
        cutout.y = baseY - bbox1.cy;
    }

    /**
     * Deletes given cutout.
     * @param {Cutout} cutout - cutout to delete
     */
    public deleteCutout(cutout: Cutout): void {
        let group = <SVG.G> cutout.element;

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

    /**
     * Selects given cutout
     * @param {Cutout} cutout - cutout to select
     * @param {boolean} flag - controls if cutout is selected (true) or unselected (false)
     */
    public selectCutout(cutout: Cutout, select = true): void {
        cutout.showSelected(select);
    }

    private static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}
