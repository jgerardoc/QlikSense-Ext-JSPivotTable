QlikSense-Ext-JSPivotTable
==========================

Pivot Table extension for QlikSense


This extension is built using Nicolas Kruchten’s pivot table found here:
(https://github.com/nicolaskruchten/pivottable)


This is a very preliminar version, with many points to improve:

  - Initial aggregation for values
  - Persistence of user layout changes
  - Selection of items
  - Automatic sizing of column widths, without to refresh manually (F5)
  - Not tested with large amount of data



*********************************
Installation & Use
*********************************
To install, copy all files to folder "C:\Users\(your user name)\Documents\Qlik\Sense\Extensions\JSPivotTable".

To use, just drag the "JSPivotTable" object from the object menu on the left in Edit mode.

Given the nature of the visualization, it uses one measure and maximum 9 dimensions.

Under Appearance --> Pivot Table there are some specific attributes for this extension:

  - Number of Dimensions in Rows (1 to 9)
      It defines how many dimensions are used for rows, the rest are used for columns. Always for the x first dimensions defined in the Dimensions tab.

  - Type of visualization in the pivot table:
      Some options to show the data as table, bars, heatmap, etc.

  - Allow the user to change the layout:
      If Yes, the user will be able to modify the pivot table distribution of rows, columns and aggregation.


Juan Gerardo
