/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/framecharts/ZFrameCharts/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});