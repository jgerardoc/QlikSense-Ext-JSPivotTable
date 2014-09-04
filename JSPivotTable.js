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
			AllowChanges: false,
			Aggregation: "Sum"
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
								Aggregation:{
									ref: "Aggregation",
									expression:"optional",
									translation: "Totals aggregation",
									type: "string",
									defaultValue: "Sum",
									component: "dropdown",
									options: [ {
											value: "Count",
											label: "Count"
										}, {
											value: "Count Unique Values",
											label: "Count Unique Values"
										}, {
											value: "List Unique Values",
											label: "List Unique Values"
										}, {
											value: "Sum",
											label: "Sum"
										}, {
											value: "Average",
											label: "Average"
										}]
								},
								AllowChanges:{
									ref: "AllowChanges",
									expression:"optional",
									translation: "Allow the user to change the layout",
									type: "bool",
									defaultValue: false,
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
			
			var tpl = $.pivotUtilities.aggregatorTemplates;			
			var aggregator = tpl.sum()(measureLabels);
			var aggregators = {};
			
			switch(layout.Aggregation){
				case "Count":
					aggregators = {"Count": function() { return tpl.count()(measureLabels) }};
					aggregator = tpl.count()(measureLabels)
					break;
				case "Count Unique Values":
					aggregators = {"Count Unique Values": function() { return tpl.countUnique()(measureLabels) }};
					aggregator = tpl.countUnique()(measureLabels)
					break;
				case "List Unique Values":
					aggregators = {"List Unique Values": function() { return tpl.listUnique()(measureLabels) }};
					aggregator = tpl.listUnique()(measureLabels)
					break;
				case "Sum":
					aggregators = {"Sum": function() { return tpl.sum()(measureLabels) }};
					aggregator = tpl.sum()(measureLabels)
					break;
				case "Average":
					aggregators = {"Average": function() { return tpl.average()(measureLabels) }};
					aggregator = tpl.average()(measureLabels)
					break;
				default:
					aggregators = {"Sum": function() { return tpl.sum()(measureLabels) }};
					aggregator = tpl.sum()(measureLabels)
					break;
			}
			
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

				var distribution = {
					rows: listrows, 
					cols: listcols,
					vals: measureLabels,
					hiddenAttributes: measureLabels,
					rendererName: layout.RenderName,
					aggregators: aggregators
/* 	 				aggregators: {
								"Sum":		function() { return tpl.sum()(measureLabels) },
								"Count":	function() { return tpl.count()(measureLabels) },
								"Average":	function() { return tpl.average()(measureLabels)}
							}
 */					};

				$("#" + id).pivotUI(data, distribution);

			} else {
				// Read only pivot table

				var distribution = {
					rows: listrows, 
					cols: listcols,
	//				vals: measureLabels,
	//				hiddenAttributes: measureLabels,
					rendererName: layout.RenderName,
					aggregator: aggregator
					//aggregator: tpl.sum()(measureLabels)
					};

				$("#" + id).pivot(data, distribution);
			}
		}
	};
});
