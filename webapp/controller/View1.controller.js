sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/BindingMode',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	"sap/ui/Device",
	"com/framecharts/ZFrameCharts/model/columns"
], function (Controller, BindingMode, JSONModel, FlattenedDataset, ChartFormatter, Format, Device, columns) {
	"use strict";

	return Controller.extend("com.framecharts.ZFrameCharts.controller.View1", {
		settingsModel: {
			dataset: {
				name: "Dataset",
				defaultSelected: 1,
				values: [{
					name: "Small",
					value: "/betterSmall.json"
				}, {
					name: "Medium",
					value: "/betterMedium.json"
				}, {
					name: "Large",
					value: "/betterLarge.json"
				}]
			},
			series: {
				name: "Series",
				defaultSelected: 0,
				values: [{
					name: "1 Series",
					value: ["Revenue"]
				}, {
					name: '2 Series',
					value: ["Revenue", "Cost"]
				}]
			},
			dataLabel: {
				name: "Value Label",
				defaultState: true
			},
			axisTitle: {
				name: "Axis Title",
				defaultState: false
			},
			dimensions: {
				Small: [{
					name: 'Seasons',
					value: "{Seasons}"
				}],
				Medium: [{
					name: 'Week',
					value: "{Week}"
				}],
				Large: [{
					name: 'Week',
					value: "{Week}"
				}]
			},
			measures: [{
				name: 'Revenue',
				value: '{Revenue}'
			}, {
				name: 'Cost',
				value: '{Cost}'
			}]
		},

		oVizFrame: null,

		onInit: function (evt) {
			var oview = this.getView();
			// set explored app's demo model on this sample
			// var sPath = jQuery.sap.getModulePath("your.app.namespace", "/path/to/file.json"); 
			// var oModel = new JSONModel(this.settingsModel);
			// oModel.setDefaultBindingMode(BindingMode.OneWay);
			// this.getView().setModel(oModel);

			var sPath1 = jQuery.sap.getModulePath("com.framecharts.ZFrameCharts", "/model/Products.json");
			this.byId("idcb").setModel(new JSONModel(sPath1));
			//var sPath = jQuery.sap.getModulePath("com.framecharts.ZFrameCharts", "/model/betterMedium.json"); 
			this.getTable();
			this.initPageSettings(oview);
		},
		initPageSettings: function (oView) {
			//debugger;
			// Hide Settings Panel for phone
			if (Device.system.phone) {
				var oSettingsPanel = oView.byId('settingsPanel');
				if (oSettingsPanel) {
					oSettingsPanel.setExpanded(false);
				}
			}

			// try to load sap.suite.ui.commons for using ChartContainer
			// sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
			var libraries = sap.ui.getVersionInfo().libraries || [];
			var bSuiteAvailable = libraries.some(function (lib) {
				return lib.name.indexOf("sap.suite.ui.commons") > -1;
			});
			if (bSuiteAvailable) {
				jQuery.sap.require("sap/suite/ui/commons/ChartContainer");
				var vizframe = oView.byId("idVizFrame");
				var vizframe2 = oView.byId("idVizFrame2");
				//var otable = this.getTable();

				var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://bar-chart",
					title: "vizFrame Column Chart Sample",
					content: [vizframe]
				});
				var oChartContainerContent1 = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://pie-chart",
					title: "vizFrame Column Chart Sample",
					content: [vizframe2]
				});
				var oChartContainerContent2 = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://table-view",
					title: "vizFrame Column Chart Sample",
					content: [this._Table]
				});
				var oChartContainer = new sap.suite.ui.commons.ChartContainer({
					content: [oChartContainerContent, oChartContainerContent1,oChartContainerContent2]
				});
				oChartContainer.setShowFullScreen(true);
				oChartContainer.setAutoAdjustHeight(true);
				debugger;
				oView.byId('chartFixFlex').setFlexContent(oChartContainer);
			}
		},
		Onchange: function (ev) {
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;
			var arr = [];
			var obj = ev.getSource().getSelectedItem().getBindingContext().getObject();
			arr.push(obj);
			var dataModel = new JSONModel({
				"results": arr
			});

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			var oVizFrame2 = this.oVizFrame = this.getView().byId("idVizFrame2");
			oVizFrame2.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: "Quantity by all numeric Properties  - PIEcharts"
				}
			});
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: true
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: 'Quantity by Price,Width,Depth,Height,WeightMeasure - VIZcharts'
				}
			});
			oVizFrame.setModel(dataModel);
			oVizFrame2.setModel(dataModel);
			this._Table.setModel(dataModel);
			this._Table.bindAggregation("items","/results", new sap.m.ColumnListItem({
				cells: columns.cols.map(function (colname) {
					return new sap.m.Label({
						text: "{" + colname.Value + "}"
					});
				})
			}));

			console.log(oVizFrame.getModel().getData());

			var oPopOver = this.getView().byId("idPopOver");
			var oPopOver1 = this.getView().byId("idPopOver1");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
			oPopOver1.connect(oVizFrame2.getVizUid());
			oPopOver1.setFormatString(formatPattern.STANDARDFLOAT);

		},
		getTable: function () {

			var oTable = new sap.m.Table("idRandomDataTable", {
				headerToolbar: new sap.m.Toolbar({
					content: [
						new sap.m.Label({
							text: "Summary Data"
						}),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button("idPersonalizationButton", {
							icon: "sap-icon://person-placeholder"
						})
					]
				}),
				columns: columns.cols.map(function (colname) {
					return new sap.m.Column({
						header: new sap.m.Label({
							text: colname.Label
						})
					});
				})
			});
			this._Table = oTable;

		}

	});
});