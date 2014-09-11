/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-05
 * Time: 12:46 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.panel.PickListGrid', {
  extend: 'Ext.panel.Panel',
  alias : 'widget.picklistgrid',

  requires: [
    'Ext.grid.Panel',
    'Ext.dd.**'
//    'Ext.grid.RowNumberer',
  ],

//  width        : 650,
//  height       : 300,
  defaultGridConfig: {
    xtype: 'grid',
    multiSelect: true,
    forceFit: true
  },

  firstConfig: {
    title: 'Available'
  },

  secondConfig: {
    title: 'Assigned'
  },

  initComponent: function() {
    var me = this,
      //First grid config
        firstGrid = Ext.apply({}, this.defaultGridConfig, this.firstConfig),
      //Second grid config
        secondGrid = Ext.apply({}, this.defaultGridConfig, this.secondConfig);

    Ext.applyIf(this, {
      layout       : {
        type: 'hbox',
//        padding: 5,
        align: 'stretch'
      },
      items:[
        firstGrid,
        secondGrid
      ],
      defaults     : { flex : 1 } //auto stretch
    });
    this.callParent();
  }
});