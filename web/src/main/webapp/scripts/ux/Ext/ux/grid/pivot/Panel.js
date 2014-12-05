/**
 * Created by lihao on 12/5/14.
 */
Ext.grid.PivotAggregatorMgr = new Ext.AbstractManager();

Ext.grid.PivotAggregatorMgr.registerType('sum', function(records, measure) {
    var length = records.length,
        total  = 0,
        i;

    for (i = 0; i < length; i++) {
        total += records[i].get(measure);
    }

    return total;
});

Ext.grid.PivotAggregatorMgr.registerType('avg', function(records, measure) {
    var length = records.length,
        total  = 0,
        i;

    for (i = 0; i < length; i++) {
        total += records[i].get(measure);
    }

    return (total / length) || 'n/a';
});

Ext.grid.PivotAggregatorMgr.registerType('min', function(records, measure) {
    var data   = [],
        length = records.length,
        i;

    for (i = 0; i < length; i++) {
        data.push(records[i].get(measure));
    }

    return Math.min.apply(this, data) || 'n/a';
});

Ext.grid.PivotAggregatorMgr.registerType('max', function(records, measure) {
    var data   = [],
        length = records.length,
        i;

    for (i = 0; i < length; i++) {
        data.push(records[i].get(measure));
    }

    return Math.max.apply(this, data) || 'n/a';
});

Ext.grid.PivotAggregatorMgr.registerType('count', function(records, measure) {
    return records.length;
});
Ext.define('Ext.ux.grid.pivot.Panel', {
    extend: 'Ext.grid.Panel',
    requires:[
        'Ext.ux.grid.pivot.ColumnModel',
        'Ext.ux.grid.pivot.PivotAxis',
        'Ext.ux.grid.pivot.View'
    ],
    alternateClassName:'Ext.grid.PivotGrid',
    /**
     * @cfg {String|Function} aggregator The aggregation function to use to combine the measures extracted
     * for each dimension combination. Can be any of the built-in aggregators (sum, count, avg, min, max).
     * Can also be a function which accepts two arguments (an array of Records to aggregate, and the measure
     * to aggregate them on) and should return a String.
     */
    aggregator: 'sum',


    /**
     * @cfg {Function} renderer Optional renderer to pass values through before they are rendered to the dom. This
     * gives an opportunity to modify cell contents after the value has been computed.
     */
    renderer: undefined,


    /**
     * @cfg {String} measure The field to extract from each Record when pivoting around the two axes. See the class
     * introduction docs for usage
     */


    /**
     * @cfg {Array|Ext.grid.PivotAxis} leftAxis Either and array of {@link #dimension} to use on the left axis, or
     * a {@link Ext.grid.PivotAxis} instance. If an array is passed, it is turned into a PivotAxis internally.
     */


    /**
     * @cfg {Array|Ext.grid.PivotAxis} topAxis Either and array of {@link #dimension} to use on the top axis, or
     * a {@link Ext.grid.PivotAxis} instance. If an array is passed, it is turned into a PivotAxis internally.
     */

    //inherit docs
    initComponent: function() {
        this.callParent(arguments);

        this.initAxes();

        //no resizing of columns is allowed yet in PivotGrid
        this.enableColumnResize = false;

        this.viewConfig = Ext.apply(this.viewConfig || {}, {
            forceFit: true
        });

        //TODO: dummy col model that is never used - GridView is too tightly integrated with ColumnModel
        //in 3.x to remove this altogether.
        this.colModel = new Ext.grid.ColumnModel({});
    },


    /**
     * Returns the function currently used to aggregate the records in each Pivot cell
     * @return {Function} The current aggregator function
     */
    getAggregator: function() {
        if (typeof this.aggregator == 'string') {
            return Ext.grid.PivotAggregatorMgr.types[this.aggregator];
        } else {
            return this.aggregator;
        }
    },


    /**
     * Sets the function to use when aggregating data for each cell.
     * @param {String|Function} aggregator The new aggregator function or named function string
     */
    setAggregator: function(aggregator) {
        this.aggregator = aggregator;
    },


    /**
     * Sets the field name to use as the Measure in this Pivot Grid
     * @param {String} measure The field to make the measure
     */
    setMeasure: function(measure) {
        this.measure = measure;
    },


    /**
     * Sets the left axis of this pivot grid. Optionally refreshes the grid afterwards.
     * @param {Ext.grid.PivotAxis} axis The pivot axis
     * @param {Boolean} refresh True to immediately refresh the grid and its axes (defaults to false)
     */
    setLeftAxis: function(axis, refresh) {

        /**
         * The configured {@link Ext.grid.PivotAxis} used as the left Axis for this Pivot Grid
         * @property leftAxis
         * @type Ext.grid.PivotAxis
         */
        this.leftAxis = axis;

        if (refresh) {
            this.view.refresh();
        }
    },


    /**
     * Sets the top axis of this pivot grid. Optionally refreshes the grid afterwards.
     * @param {Ext.grid.PivotAxis} axis The pivot axis
     * @param {Boolean} refresh True to immediately refresh the grid and its axes (defaults to false)
     */
    setTopAxis: function(axis, refresh) {

        /**
         * The configured {@link Ext.grid.PivotAxis} used as the top Axis for this Pivot Grid
         * @property topAxis
         * @type Ext.grid.PivotAxis
         */
        this.topAxis = axis;

        if (refresh) {
            this.view.refresh();
        }
    },

    /**
     * @private
     * Creates the top and left axes. Should usually only need to be called once from initComponent
     */
    initAxes: function() {
        var PivotAxis = Ext.grid.PivotAxis;

        if (!(this.leftAxis instanceof PivotAxis)) {
            this.setLeftAxis(new PivotAxis({
                orientation: 'vertical',
                dimensions : this.leftAxis || [],
                store      : this.store
            }));
        };

        if (!(this.topAxis instanceof PivotAxis)) {
            this.setTopAxis(new PivotAxis({
                orientation: 'horizontal',
                dimensions : this.topAxis || [],
                store      : this.store
            }));
        };
    },

    /**
     * @private
     * @return {Array} 2-dimensional array of cell data
     */
    extractData: function() {
        var records  = this.store.data.items,
            recCount = records.length,
            cells    = [],
            record, i, j, k;

        if (recCount == 0) {
            return [];
        }

        var leftTuples = this.leftAxis.getTuples(),
            leftCount  = leftTuples.length,
            topTuples  = this.topAxis.getTuples(),
            topCount   = topTuples.length,
            aggregator = this.getAggregator();

        for (i = 0; i < recCount; i++) {
            record = records[i];

            for (j = 0; j < leftCount; j++) {
                cells[j] = cells[j] || [];

                if (leftTuples[j].matcher(record) === true) {
                    for (k = 0; k < topCount; k++) {
                        cells[j][k] = cells[j][k] || [];

                        if (topTuples[k].matcher(record)) {
                            cells[j][k].push(record);
                        }
                    }
                }
            }
        }

        var rowCount = cells.length,
            colCount, row;

        for (i = 0; i < rowCount; i++) {
            row = cells[i];
            colCount = row.length;

            for (j = 0; j < colCount; j++) {
                cells[i][j] = aggregator(cells[i][j], this.measure);
            }
        }

        return cells;
    },


    /**
     * Returns the grid's GridView object.
     * @return {Ext.grid.PivotGridView} The grid view
     */
    getView: function() {
        if (!this.view) {
            this.view = new Ext.grid.PivotGridView(this.viewConfig);
        }

        return this.view;
    }
});