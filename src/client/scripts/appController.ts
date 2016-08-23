/// <reference path='../../../typings/globals/jquery/index.d.ts' />
/// <reference path='../../../typings/svgjs/svgjs.d.ts' />

'use strict';

import { CutoutModel } from './cutoutModel';
import { Tool, CutoutPlaceTool, CutoutSelectTool, CutoutDeleteTool, CutoutMoveTool, CutoutListTool } from './tools';
import { RectangularOutline } from './cutouts';

/** Application controller */
export class AppController {
    private _activeTool: Tool;
    private _model: CutoutModel;
    private _snap: number;

    constructor() {
       this._snap = 1;
    }

    /**
     * Initializes application/page
     */
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
        $('#btn-cutout-list').on('click', (event) => {
            this.onCutoutList(event);
        });
        $('#grid-show-toggle').on('click', (event) => {
            this.onShowGrid(event);
        });
        $('#grid-snap-toggle').on('click', (event) => {
            this.onChangeSnap(event);
        });
        $('#grid-snap').on('change', (event) => {
            this.onChangeSnap(event);
        });
        let svgDocument: SVG.Doc = SVG('svg-canvas');

        this._model = new CutoutModel(svgDocument);
        svgDocument.on('mousemove', (event) => {
            this.onMouseMove(event);
        });
        svgDocument.on('click', (event) => {
            this.onClick(event);
        });
    }

    /**
     * Called when new tool is started. Stops active tool.
     * @param {Tool} tool - tool to start.
     */
    private startTool(tool: Tool): void {
        if (this._activeTool) {
            this.stopTool();
        }
        this._activeTool = tool;
        if (this._activeTool.start) {
            if (!this._activeTool.start()) {
                this.stopTool();
            }
        }
    }

    /**
     * Called wne tool is stopped.
     */
    private stopTool(): void {
        if (!this._activeTool) {
            return;
        }
        if (this._activeTool.stop) {
            this._activeTool.stop();
        }
        this._activeTool = null;
    }

    /**
     * Handler for 'grid-show-toggle' checkbox. Shows/hides grid.
     * @param {JQueryEventObject} event - event object
     */
    private onShowGrid(event: JQueryEventObject): void {
        let showGrid: boolean = false;

        if ($('#grid-show-toggle').is(':checked')) {
            showGrid = true;
        }
        $('#container').toggleClass('grid', showGrid);
    }

    /**
     * Handler for 'grid-snap-toggle' checkbox. Sets grid snap.
     * @param {JQueryEventObject} event - event object
     */
    private onChangeSnap(event: JQueryEventObject): void {
        if ($('#grid-snap-toggle').is(':checked')) {
            this._snap = parseInt($('#grid-snap').val());
        }
        else {
            this._snap = 1;
        }
    }

    /**
     * Handler for 'btn-new' button. Creates new outline.
     * @param {JQueryEventObject} event - event object
     */
    private onNew(event: JQueryEventObject): void {
        let width = parseFloat($('#plate-width').val());
        let height = parseFloat($('#plate-height').val());
        let outline = new RectangularOutline(width, height);

        this._model.addOutline(outline);
    }

    /**
     * Handler for 'btn-cutout-add' button. Starts place tool.
     * @param {JQueryEventObject} event - event object
     */
    private onCutoutAdd(event: JQueryEventObject): void {
        console.log('onCutoutAdd');
        let size = $('#cutout-size').val();
        let tool = new CutoutPlaceTool(this._model, size);

        this.startTool(tool);
    }

    /**
     * Handler for 'btn-cutout-select' button. Starts select tool.
     * @param {JQueryEventObject} event - event object
     */
    private onCutoutSelect(event: JQueryEventObject): void {
        console.log('onCutoutSelect');
        let tool = new CutoutSelectTool(this._model);

        this.startTool(tool);
    }

    /**
     * Handler for 'btn-cutout-delete' button. Starts delete tool.
     * @param {JQueryEventObject} event - event object
     */
    private onCutoutDelete(event: JQueryEventObject): void {
        console.log('onCutoutDelete');
        let tool = new CutoutDeleteTool(this._model);

        this.startTool(tool);
    }

    /**
     * Handler for 'btn-cutout-list' button. Starts list tool.
     * @param {JQueryEventObject} event - event object
     */
    private onCutoutList(event: JQueryEventObject): void {
        console.log('onCutoutList');
        let tool = new CutoutListTool(this._model);

        this.startTool(tool);
    }

     /**
     * Handler for 'btn-cutout-move' button. Starts move tool.
     * @param {JQueryEventObject} event - event object
     */
    private onCutoutMove(event: JQueryEventObject): void {
        console.log('onCutoutMove');
        let tool = new CutoutMoveTool(this._model);

        this.startTool(tool);
    }

    /**
     * Handler for 'click' event. Updates active tool.
     * @param {MouseEvent} event - event object
     */
    private onClick(event: MouseEvent): void {
        console.log('onClick');
        if (this._activeTool && this._activeTool.onClick) {
            if (!this._activeTool.onClick(event)) {
                this.stopTool();
            }
        }
    }

    /**
     * Handler for 'mousemove' event. Updates active tool.
     * @param {MouseEvent} event - event object
     */
    private onMouseMove(event: MouseEvent): void {
        if (this._activeTool && this._activeTool.onMouseMove) {
            let x = Math.round(event.x / this._snap) * this._snap;
            let y = Math.round(event.y / this._snap) * this._snap;

            if (!this._activeTool.onMouseMove(x, y)) {
                this.stopTool();
            }
        }
    }
}
