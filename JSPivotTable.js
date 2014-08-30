define(["jquery", "text!./JSPivotTable.css", "./d3.min", "./pivot"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 1000
				}]
			},
			InitialNumRows: 1,
			InitialNumCols: 1,
			InitialRows: "",
			InitialCols: "",
			RenderName: "Table",
			AllowChanges: true,
			Aggregation: "Count"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 2,
					max : 9
				},
				measures : {
					uses : "measures",
					min : 1,
					max : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						Pivot: {
							type: "items",
							label: "Pivot Table",
							items: {
								InitialNumRows:{
									ref: "InitialNumRows",
									expression:"optional",
									translation: "Number of Dimensions in Rows (1 to 9)",
									type: "integer",
									defaultValue: 1,
									component: "slider",
									min: 1,
									max: 9,
									step: 1
								},
								RenderName:{
									ref: "RenderName",
									expression:"optional",
									translation: "Type of visualization in the pivot table",
									type: "string",
									defaultValue: "Table",
									component: "dropdown",
									options: [ {
											value: "Table",
											label: "Table"
										}, {
											value: "Table Barchart",
											label: "Table Barchart"
										}, {
											value: "Heatmap",
											label: "Heatmap"
										}, {
											value: "Row Heatmap",
											label: "Row Heatmap"
										}, {
											value: "Col Heatmap",
											label: "Col Heatmap"
										}]
								},
								// Aggregation:{
									// ref: "Aggregation",
									// expression:"optional",
									// translation: "Data aggregation",
									// type: "string",
									// defaultValue: "Count",
									// component: "dropdown",
									// options: [ {
											// value: "Count",
											// label: "Count"
										// }, {
											// value: "Count Unique Values",
											// label: "Count Unique Values"
										// }, {
											// value: "List Unique Values",
											// label: "List Unique Values"
										// }, {
											// value: "Sum",
											// label: "Sum"
										// }, {
											// value: "Integer Sum",
											// label: "Integer Sum"
										// }, {
											// value: "Average",
											// label: "Average"
										// }, {
											// value: "Sum over Sum",
											// label: "Sum over Sum"
										// }, {
											// value: "80% Upper Bound",
											// label: "80% Upper Bound"
										// }, {
											// value: "80% Lower Bound",
											// label: "80% Lower Bound"
										// }, {
											// value: "Sum as Fraction of Total",
											// label: "Sum as Fraction of Total"
										// }, {
											// value: "Sum as Fraction of Rows",
											// label: "Sum as Fraction of Rows"
										// }, {
											// value: "Sum as Fraction of Columns",
											// label: "Sum as Fraction of Columns"
										// }, {
											// value: "Count as Fraction of Total",
											// label: "Count as Fraction of Total"
										// }, {
											// value: "Count as Fraction of Rows",
											// label: "Count as Fraction of Rows"
										// }, {
											// value: "Count as Fraction of Columns",
											// label: "Count as Fraction of Columns"
										// }]
								// },
								AllowChanges:{
									ref: "AllowChanges",
									expression:"optional",
									translation: "Allow the user to change the layout",
									type: "bool",
									defaultValue: true,
									component: "switch",
									options: [ { // Must be exactly 2 options for the switch type, the first option is shown when value is true
										value: true,
										label: "Yes"
									}, {
										value: false,
										label: "No"
									} ]
								}
							}
						}
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			var i;	// Generic counter
		
		
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			var dimensionLabels =  layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qFallbackTitle;
			});

 			var data = qMatrix.map(function(d) {
				var retdata = {};
				
				// Add the measure
				retdata[measureLabels[0]] = d[d.length - 1].qText;

				// Add the dimensions
				for	(i = 0; i < d.length - 1; i++) {
					retdata[dimensionLabels[i]] = d[i].qText;
				}

				return retdata;
			});
 
			var listrows = [];
			for (i = 0; i < layout.InitialNumRows; i++){
				listrows[i] = dimensionLabels[i];
			}
			
			var listcols = [];
			for (i = i; i < dimensionLabels.length; i++){
				listcols[listcols.length] = dimensionLabels[i];
			};
			
			// var listaggregators = {};
			// listaggregators
			
			var distribution = {
				rows: listrows, 
				cols: listcols,
				rendererName: layout.RenderName
				// aggregators: layout.Aggregation
				};
				

			// Chart object width
			var width = $element.width();
			// Chart object height
			var height = $element.height();
			// Chart object id
			var id = "container_" + layout.qInfo.qId;

			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropiate id and size
				$element.append($('<div />').attr("id", id).width(width).height(height));
			}
			
			if(layout.AllowChanges){
				// User can change the fields distribution
				$("#" + id).pivotUI(data, distribution);
			} else {
				// Read only pivot table
				$("#" + id).pivot(data, distribution);
			}
		}
	};
});
