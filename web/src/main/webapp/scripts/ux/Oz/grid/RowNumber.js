/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 11/8/11
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.grid.RowNumber', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.rownumber',

    /**
     * @cfg {String} text
     * Any valid text or HTML fragment to display in the header cell for the row number column.
     */
    text: "&#160",

    /**
     * @cfg {Number} width
     * The default width in pixels of the row number column.
     */
    width: 23,

    /**
     * @cfg {Boolean} sortable
     * True if the row number column is sortable.
     * @hide
     */
    sortable: false,

    align: 'right',

    constructor : function(config){
        this.callParent(arguments);
        if (this.rowspan) {
            this.renderer = Ext.Function.bind(this.renderer, this);
        }
    },

    // private
    resizable: false,
    hideable: false,
    menuDisabled: true,
    dataIndex: '',
    cls: Ext.baseCSSPrefix + 'row-numberer',
    rowspan: undefined,

    // private
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {
        if (this.rowspan){
            metaData.cellAttr = 'rowspan="'+this.rowspan+'"';
        }

        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
        return rowIdx + 1;
    }
});