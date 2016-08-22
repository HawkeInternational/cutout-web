﻿/// <reference path='../../../typings/globals/jquery/index.d.ts' />
/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />

'use strict';

import { CutoutModel } from './cutoutModel';
import { Cutout, CircularCutout } from './cutouts';

export interface Tool {
    start?(): boolean;
    stop?(): void;
    onMouseMove?(x: number, y: number): boolean;
    onClick?(event: MouseEvent): boolean;
}

export class CutoutPlaceTool implements Tool {
    private _model: CutoutModel;
    private _size: string;
    private _cutout: CircularCutout;

    constructor(model: CutoutModel, size: string) {
        this._model = model;
        this._size = size;
    }

    public start(): boolean {
        $('#cutout-panel').toggleClass('hidden', false);
        $('#cutout-size').on('change', () => {
            this.onChangeSize();
        });
        return true;
    }

    public stop(): void {
        $('#cutout-panel').toggleClass('hidden', true);
        $('#cutout-size').off('change');
        this._cutout = null;
    }

    public onClick(event: MouseEvent): boolean {
        if (this._cutout.hasClash) {
            $('#notify-panel').toggleClass('hidden', false);
            $('#notify-panel-message').text('Cutout has clashes, unable to place.');
            return true;
        }
        $('#notify-panel').toggleClass('hidden', true);
        if (this._cutout) {
            this._cutout.showZone(false);
        }
        // don't continue
        return false;
    }

    public onMouseMove(x: number, y: number): boolean {
        if (!this._cutout) {
            this._cutout = new CircularCutout(this._size);
            this._model.addCutout(this._cutout);
        }
        this._model.moveCutout(this._cutout, x, y);
        return true;
    }

    private onChangeSize(): void {
        console.log('onChangeSize');
        let selectedSize = $('#cutout-size').val();

        console.log(selectedSize);
        if (this._cutout) {
            this._cutout.size = selectedSize;
        }
    }
}

export class CutoutSelectTool implements Tool {
    private _model: CutoutModel;

    constructor(model: CutoutModel) {
        this._model = model;
    }

    public onClick(event: MouseEvent): boolean {
        let cutout: Cutout = this._model.cutoutFromPoint(event.x, event.y);

        if (cutout) {
            this._model.selectCutout(cutout, !cutout.selected);
        }
        return true;
    }
}

export class CutoutDeleteTool implements Tool {
    private _model: CutoutModel;

    constructor(model: CutoutModel) {
        this._model = model;
    }

    public start(): boolean {
        let cutouts: Cutout[] = this._model.selection;

        cutouts.forEach((cutout) => {
            this._model.removeCutout(cutout);
        });
        // stop command
        return false;
    }
}

export class CutoutMoveTool implements Tool {
    private _model: CutoutModel;
    private _cutout: Cutout;

    constructor(model: CutoutModel) {
        this._model = model;
    }

    public start(): boolean {
        let cutouts: Cutout[] = this._model.selection;

        if (cutouts.length === 0) {
            return false;
        }
        this._cutout = cutouts[0];
        this._cutout.showZone(true);
        return true;
    }

    public stop(): void {
        if (this._cutout) {
            this._cutout.showZone(false);
            this._cutout = null;
        }
    }

    public onMouseMove(x: number, y: number): boolean {
        this._model.moveCutout(this._cutout, x, y);
        return true;
    }

    public onClick(event: MouseEvent): boolean {
        this._model.selectCutout(this._cutout, false);
        return false;
    }
}
