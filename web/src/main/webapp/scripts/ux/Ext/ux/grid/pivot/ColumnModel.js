/**
 * Created by lihao on 12/5/14.
 */
Ext.define('Ext.ux.grid.pivot.ColumnModel', {
    extend: 'Ext.util.Observable',
    alternateClassName:'Ext.grid.ColumnModel',
    /**
     * @cfg {Number} defaultWidth (optional) The width of columns which have no {@link #width}
     * specified (defaults to 100).  This property shall preferably be configured through the
     * {@link #defaults} config property.
     */
    defaultWidth: 100,


    /**
     * @cfg {Boolean} defaultSortable (optional) Default sortable of columns which have no
     * sortable specified (defaults to false).  This property shall preferably be configured
     * through the {@link #defaults} config property.
     */
    defaultSortable: false,


    /**
     * @cfg {Array} columns An Array of object literals.  The config options defined by
     * {@link Ext.grid.Column} are the options which may appear in the object literal for each
     * individual column definition.
     */


    /**
     * @cfg {Object} defaults Object literal which will be used to apply {@link Ext.grid.Column}
     * configuration options to all {@link #columns}.  Configuration options specified with
     * individual {@link Ext.grid.Column column} configs will supersede these {@link #defaults}.
     */

    constructor : function(config) {

        /**
         * An Array of {@link Ext.grid.Column Column definition} objects representing the configuration
         * of this ColumnModel.  See {@link Ext.grid.Column} for the configuration properties that may
         * be specified.
         * @property config
         * @type Array
         */
        if (config.columns) {
            Ext.apply(this, config);
            this.setConfig(config.columns, true);
        } else {
            this.setConfig(config, true);
        }

        this.addEvents(

            /**
             * @event widthchange
             * Fires when the width of a column is programmaticially changed using
             * {@link #setColumnWidth}.
             * Note internal resizing suppresses the event from firing. See also
             * {@link Ext.grid.GridPanel}.{@link #columnresize}.
             * @param {ColumnModel} this
             * @param {Number} columnIndex The column index
             * @param {Number} newWidth The new width
             */
            "widthchange",


            /**
             * @event headerchange
             * Fires when the text of a header changes.
             * @param {ColumnModel} this
             * @param {Number} columnIndex The column index
             * @param {String} newText The new header text
             */
            "headerchange",


            /**
             * @event hiddenchange
             * Fires when a column is hidden or "unhidden".
             * @param {ColumnModel} this
             * @param {Number} columnIndex The column index
             * @param {Boolean} hidden true if hidden, false otherwise
             */
            "hiddenchange",


            /**
             * @event columnmoved
             * Fires when a column is moved.
             * @param {ColumnModel} this
             * @param {Number} oldIndex
             * @param {Number} newIndex
             */
            "columnmoved",


            /**
             * @event configchange
             * Fires when the configuration is changed
             * @param {ColumnModel} this
             */
            "configchange"
        );

        Ext.grid.ColumnModel.superclass.constructor.call(this);
    },


    /**
     * Returns the id of the column at the specified index.
     * @param {Number} index The column index
     * @return {String} the id
     */
    getColumnId : function(index) {
        return this.config[index].id;
    },

    getColumnAt : function(index) {
        return this.config[index];
    },
    defaultRenderer:function(value) {
        if (typeof value == "string" && value.length < 1) {
            return " ";
        }
        return value;
    },


    /**
     *
     Reconfigures this column model according to the passed Array of column definition objects.
     * For a description of the individual properties of a column definition object, see the
     * Config Options.


     *
     Causes the {@link #configchange} event to be fired. A {@link Ext.grid.GridPanel GridPanel}
     * using this ColumnModel will listen for this event and refresh its UI automatically.


     * @param {Array} config Array of Column definition objects.
     * @param {Boolean} initial Specify true to bypass cleanup which deletes the totalWidth
     * and destroys existing editors.
     */
    setConfig : function(config, initial) {
        var i, c, len;

        if (!initial) { // cleanup
            delete this.totalWidth;

            for (i = 0, len = this.config.length; i < len; i++) {
                c = this.config[i];

                if (c.setEditor) {
                    //check here, in case we have a special column like a CheckboxSelectionModel
                    c.setEditor(null);
                }
            }
        }

        // backward compatibility
        this.defaults = Ext.apply({
            width: this.defaultWidth,
            sortable: this.defaultSortable
        }, this.defaults);

        this.config = config;
        this.lookup = {};

        for (i = 0, len = config.length; i < len; i++) {
            c = Ext.applyIf(config[i], this.defaults);

            // if no id, create one using column's ordinal position
            if (Ext.isEmpty(c.id)) {
                c.id = i;
            }

            if (!c.isColumn) {
                var Cls = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
                c = new Cls(c);
                config[i] = c;
            }

            this.lookup[c.id] = c;
        }

        if (!initial) {
            this.fireEvent('configchange', this);
        }
    },


    /**
     * Returns the column for a specified id.
     * @param {String} id The column id
     * @return {Object} the column
     */
    getColumnById : function(id) {
        return this.lookup[id];
    },


    /**
     * Returns the index for a specified column id.
     * @param {String} id The column id
     * @return {Number} the index, or -1 if not found
     */
    getIndexById : function(id) {
        for (var i = 0, len = this.config.length; i < len; i++) {
            if (this.config[i].id == id) {
                return i;
            }
        }
        return -1;
    },


    /**
     * Moves a column from one position to another.
     * @param {Number} oldIndex The index of the column to move.
     * @param {Number} newIndex The position at which to reinsert the coolumn.
     */
    moveColumn : function(oldIndex, newIndex) {
        var config = this.config,
            c      = config[oldIndex];

        config.splice(oldIndex, 1);
        config.splice(newIndex, 0, c);
        this.dataMap = null;
        this.fireEvent("columnmoved", this, oldIndex, newIndex);
    },


    /**
     * Returns the number of columns.
     * @param {Boolean} visibleOnly Optional. Pass as true to only include visible columns.
     * @return {Number}
     */
    getColumnCount : function(visibleOnly) {
        var length = this.config.length,
            c = 0,
            i;

        if (visibleOnly === true) {
            for (i = 0; i < length; i++) {
                if (!this.isHidden(i)) {
                    c++;
                }
            }

            return c;
        }

        return length;
    },


    /**
     * Returns the column configs that return true by the passed function that is called
     * with (columnConfig, index)

     // returns an array of column config objects for all hidden columns
     var columns = grid.getColumnModel().getColumnsBy(function(c){
  return c.hidden;
});

     * @param {Function} fn A function which, when passed a {@link Ext.grid.Column Column} object, must
     * return true if the column is to be included in the returned Array.
     * @param {Object} scope (optional) The scope (this reference) in which the function
     * is executed. Defaults to this ColumnModel.
     * @return {Array} result
     */
    getColumnsBy : function(fn, scope) {
        var config = this.config,
            length = config.length,
            result = [],
            i, c;

        for (i = 0; i < length; i++){
            c = config[i];

            if (fn.call(scope || this, c, i) === true) {
                result[result.length] = c;
            }
        }

        return result;
    },


    /**
     * Returns true if the specified column is sortable.
     * @param {Number} col The column index
     * @return {Boolean}
     */
    isSortable : function(col) {
        return !!this.config[col].sortable;
    },


    /**
     * Returns true if the specified column menu is disabled.
     * @param {Number} col The column index
     * @return {Boolean}
     */
    isMenuDisabled : function(col) {
        return !!this.config[col].menuDisabled;
    },


    /**
     * Returns the rendering (formatting) function defined for the column.
     * @param {Number} col The column index.
     * @return {Function} The function used to render the cell. See {@link #setRenderer}.
     */
    getRenderer : function(col) {
        return this.config[col].renderer || Ext.grid.ColumnModel.defaultRenderer;
    },

    getRendererScope : function(col) {
        return this.config[col].scope;
    },


    /**
     * Sets the rendering (formatting) function for a column.  See {@link Ext.util.Format} for some
     * default formatting functions.
     * @param {Number} col The column index
     * @param {Function} fn The function to use to process the cell's raw data
     * to return HTML markup for the grid view. The render function is called with
     * the following parameters:

     *
     value : Object
     The data value for the cell.


     *
     metadata : Object
     An object in which you may set the following attributes:


     *
     css : String
     A CSS class name to add to the cell's TD element.


     *
     attr : String
     An HTML attribute definition string to apply to the data container element within the table cell
     * (e.g. 'style="color:red;"').


     *
     record : Ext.data.record
     The {@link Ext.data.Record} from which the data was extracted.


     *
     rowIndex : Number
     Row index


     *
     colIndex : Number
     Column index


     *
     store : Ext.data.Store
     The {@link Ext.data.Store} object from which the Record was extracted.


     */
    setRenderer : function(col, fn) {
        this.config[col].renderer = fn;
    },


    /**
     * Returns the width for the specified column.
     * @param {Number} col The column index
     * @return {Number}
     */
    getColumnWidth : function(col) {
        var width = this.config[col].width;
        if(typeof width != 'number'){
            width = this.defaultWidth;
        }
        return width;
    },


    /**
     * Sets the width for a column.
     * @param {Number} col The column index
     * @param {Number} width The new width
     * @param {Boolean} suppressEvent True to suppress firing the {@link #widthchange}
     * event. Defaults to false.
     */
    setColumnWidth : function(col, width, suppressEvent) {
        this.config[col].width = width;
        this.totalWidth = null;

        if (!suppressEvent) {
            this.fireEvent("widthchange", this, col, width);
        }
    },


    /**
     * Returns the total width of all columns.
     * @param {Boolean} includeHidden True to include hidden column widths
     * @return {Number}
     */
    getTotalWidth : function(includeHidden) {
        if (!this.totalWidth) {
            this.totalWidth = 0;
            for (var i = 0, len = this.config.length; i < len; i++) {
                if (includeHidden || !this.isHidden(i)) {
                    this.totalWidth += this.getColumnWidth(i);
                }
            }
        }
        return this.totalWidth;
    },


    /**
     * Returns the header for the specified column.
     * @param {Number} col The column index
     * @return {String}
     */
    getColumnHeader : function(col) {
        return this.config[col].header;
    },


    /**
     * Sets the header for a column.
     * @param {Number} col The column index
     * @param {String} header The new header
     */
    setColumnHeader : function(col, header) {
        this.config[col].header = header;
        this.fireEvent("headerchange", this, col, header);
    },


    /**
     * Returns the tooltip for the specified column.
     * @param {Number} col The column index
     * @return {String}
     */
    getColumnTooltip : function(col) {
        return this.config[col].tooltip;
    },

    /**
     * Sets the tooltip for a column.
     * @param {Number} col The column index
     * @param {String} tooltip The new tooltip
     */
    setColumnTooltip : function(col, tooltip) {
        this.config[col].tooltip = tooltip;
    },


    /**
     * Returns the dataIndex for the specified column.

     // Get field name for the column
     var fieldName = grid.getColumnModel().getDataIndex(columnIndex);

     * @param {Number} col The column index
     * @return {String} The column's dataIndex
     */
    getDataIndex : function(col) {
        return this.config[col].dataIndex;
    },


    /**
     * Sets the dataIndex for a column.
     * @param {Number} col The column index
     * @param {String} dataIndex The new dataIndex
     */
    setDataIndex : function(col, dataIndex) {
        this.config[col].dataIndex = dataIndex;
    },


    /**
     * Finds the index of the first matching column for the given dataIndex.
     * @param {String} col The dataIndex to find
     * @return {Number} The column index, or -1 if no match was found
     */
    findColumnIndex : function(dataIndex) {
        var c = this.config;
        for(var i = 0, len = c.length; i < len; i++){
            if(c[i].dataIndex == dataIndex){
                return i;
            }
        }
        return -1;
    },


    /**
     * Returns true if the cell is editable.

     var store = new Ext.data.Store({...});
     var colModel = new Ext.grid.ColumnModel({
  columns: [...],
  isCellEditable: function(col, row) {
    var record = store.getAt(row);
    if (record.get('readonly')) { // replace with your condition
      return false;
    }
    return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, col, row);
  }
});
     var grid = new Ext.grid.GridPanel({
  store: store,
  colModel: colModel,
  ...
});

     * @param {Number} colIndex The column index
     * @param {Number} rowIndex The row index
     * @return {Boolean}
     */
    isCellEditable : function(colIndex, rowIndex) {
        var c = this.config[colIndex],
            ed = c.editable;

        //force boolean
        return !!(ed || (!Ext.isDefined(ed) && c.editor));
    },


    /**
     * Returns the editor defined for the cell/column.
     * @param {Number} colIndex The column index
     * @param {Number} rowIndex The row index
     * @return {Ext.Editor} The {@link Ext.Editor Editor} that was created to wrap
     * the {@link Ext.form.Field Field} used to edit the cell.
     */
    getCellEditor : function(colIndex, rowIndex) {
        return this.config[colIndex].getCellEditor(rowIndex);
    },


    /**
     * Sets if a column is editable.
     * @param {Number} col The column index
     * @param {Boolean} editable True if the column is editable
     */
    setEditable : function(col, editable) {
        this.config[col].editable = editable;
    },


    /**
     * Returns true if the column is {@link Ext.grid.Column#hidden hidden},
     * false otherwise.
     * @param {Number} colIndex The column index
     * @return {Boolean}
     */
    isHidden : function(colIndex) {
        return !!this.config[colIndex].hidden; // ensure returns boolean
    },


    /**
     * Returns true if the column is {@link Ext.grid.Column#fixed fixed},
     * false otherwise.
     * @param {Number} colIndex The column index
     * @return {Boolean}
     */
    isFixed : function(colIndex) {
        return !!this.config[colIndex].fixed;
    },


    /**
     * Returns true if the column can be resized
     * @return {Boolean}
     */
    isResizable : function(colIndex) {
        return colIndex >= 0 && this.config[colIndex].resizable !== false && this.config[colIndex].fixed !== true;
    },


    /**
     * Sets if a column is hidden.

     myGrid.getColumnModel().setHidden(0, true); // hide column 0 (0 = the first column).

     * @param {Number} colIndex The column index
     * @param {Boolean} hidden True if the column is hidden
     */
    setHidden : function(colIndex, hidden) {
        var c = this.config[colIndex];
        if(c.hidden !== hidden){
            c.hidden = hidden;
            this.totalWidth = null;
            this.fireEvent("hiddenchange", this, colIndex, hidden);
        }
    },


    /**
     * Sets the editor for a column and destroys the prior editor.
     * @param {Number} col The column index
     * @param {Object} editor The editor object
     */
    setEditor : function(col, editor) {
        this.config[col].setEditor(editor);
    },


    /**
     * Destroys this column model by purging any event listeners. Destroys and dereferences all Columns.
     */
    destroy : function() {
        var length = this.config.length,
            i = 0;

        for (; i < length; i++){
            this.config[i].destroy(); // Column's destroy encapsulates all cleanup.
        }
        delete this.config;
        delete this.lookup;
        this.purgeListeners();
    },

    /**
     * @private
     * Setup any saved state for the column, ensures that defaults are applied.
     */
    setState : function(col, state) {
        state = Ext.applyIf(state, this.defaults);
        Ext.apply(this.config[col], state);
    }
});