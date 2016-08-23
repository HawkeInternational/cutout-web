# HAWKE Cutout Editor

Prototype of web based cutout editor using SVG and JavaScript.

## Installation
* Install [Node.js](https://nodejs.org).
* You may want to install following components globally:
  * Bower `npm install -g bower`
  * Gulp `npm install -g gulp`
  * TypeScript `npm install -g typescript`
  * Typings `npm install -g typings`
* Clone repository from Git:
`git clone https://github.com/HawkeInternational/cutout-web.git`
* Run `npm install` to install all dependencies. This will autmatically transpile TypeScript code into JavaScript.

## Usage

### Running the server
* Run `npm start`
* Navigate to http://localhost:3000

### Using editor
The prototype shows possible approach for implementation of web based cutout editor. It isn't complete at this point (Aug/2016).

Following functions are available:
* __Show Grid__ - shows grid on the background.
* __Grid Snap__ - restricts mouse movement based on specfied snap size.
* __New__ - creates new outline (rectangle) based on provided dimensions.
* __Add__ - adds new cutout using mouse. During placement the keep out zone is displayed. Use left mouse button to place cutout. When cutout is clashing with outline or another cutout then color is changed to red. Such cutout can't be place - there will be small popup message displayed.
* __Select__ - selects cutout by mouse. Selected cutout is indicated by green color.
* __Move__ - moves selected cutout. During placement then clash validation is  also performed.
* __Delete__ - deletes selected cutouts.
* __List__ - displays information about all cutouts in the model.
