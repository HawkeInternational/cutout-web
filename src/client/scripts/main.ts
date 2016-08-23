/// <reference path='../../../typings/globals/jquery/index.d.ts' />

'use strict';

import { AppController } from './appController';

let appController = null;

/** Application entry point */
$(document).ready(() => {
    console.log('Document is ready');
    if (!appController) {
        appController = new AppController();
    }
    appController.initialize();
});