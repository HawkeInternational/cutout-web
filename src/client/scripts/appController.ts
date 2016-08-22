/// <reference path='../../../typings/globals/jquery/index.d.ts' />
/// <reference path='../../../typings/globals/svgjs/svgjs.d.ts' />

'use strict';

import { CutoutModel } from './cutoutModel';
import { Tool, CutoutPlaceTool, CutoutSelectTool, CutoutDeleteTool, CutoutMoveTool } from './tools';
import { RectangularOutline } from './cutouts';

export class AppController {
    private _activeTool: Tool;
    private _model: CutoutModel;
    private _snap: number;

    constructor() {
       this._snap = 1;
    }

    public initialize(): void {
        $('#btn-new').on('click', (event) => {
            this.onNew(event);
        });
        $('#btn-cutout-add').on('click', (event) => {
            this.onCutoutAdd(event);
        });
        $('#btn-cutout-select').on('click', (event) => {
            this.onCutoutSelect(event);
        });
        $('#btn-cutout-delete').on('click', (event) => {
            this.onCutoutDelete(event);
        });
        $('#btn-cutout-move').on('click', (event) => {
            this.onCutoutMove(event);
        });
        $('#grid-snap-toggle').on('click', (event) => {
            this.onChangeSnap(event);
        });
        $('#grid-snap').on('change', (event) => {
            this.onChangeSnap(event);
        });
        let svgDocument: SVG.Doc = SVG('svg-canvas');

        this._model = new CutoutModel(svgDocument);
        svgDocument.on('mouseover', (event) => {
            this.onMouseOver(event);
        });
        svgDocument.on('mousemove', (event) => {
            this.onMouseMove(event);
        });
        svgDocument.on('click', (event) => {
            this.onClick(event);
        });
    }

    private startTool(tool: Tool): void {
        this._activeTool = tool;
        if (this._activeTool.start) {
            if (!this._activeTool.start()) {
                this.stopTool();
            }
        }
    }

    private stopTool(): void {
        if (!this._activeTool) {
            return;
        }
        if (this._activeTool.stop) {
            this._activeTool.stop();
        }
        this._activeTool = null;
    }

    private onChangeSnap(event): void {
        if ($('#grid-snap-toggle').is(':checked')) {
            this._snap = parseInt($('#grid-snap').val());
        }
        else {
            this._snap = 1;
        }
    }

    private onNew(event): void {
        let width = parseFloat($('#plate-width').val());
        let height = parseFloat($('#plate-height').val());
        let outline = new RectangularOutline(width, height);

        this._model.addOutline(outline);
    }

    private onCutoutAdd(event): void {
        console.log('onCutoutAdd');
        let size = $('#cutout-size').val();
        let tool = new CutoutPlaceTool(this._model, size);

        this.startTool(tool);
    }

    private onCutoutSelect(event): void {
        console.log('onCutoutSelect');
        let tool = new CutoutSelectTool(this._model);

        this.startTool(tool);
    }

    private onCutoutDelete(event): void {
        console.log('onCutoutDelete');
        let tool = new CutoutDeleteTool(this._model);

        this.startTool(tool);
    }

    private onCutoutMove(event): void {
        console.log('onCutoutMove');
        let tool = new CutoutMoveTool(this._model);

        this.startTool(tool);
    }

    private onClick(event: MouseEvent): void {
        console.log('onClick');
        if (this._activeTool && this._activeTool.onClick) {
            if (!this._activeTool.onClick(event)) {
                this.stopTool();
            }
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this._activeTool && this._activeTool.onMouseMove) {
            let x = Math.round(event.x / this._snap) * this._snap;
            let y = Math.round(event.y / this._snap) * this._snap;

            if (!this._activeTool.onMouseMove(x, y)) {
                this.stopTool();
            }
        }
    }

    private onMouseOver(event: MouseEvent): void {
        if (!this._activeTool) {
            console.log('onMouseOver: ' + (<any> event).path[0].id);
        }
    }
}