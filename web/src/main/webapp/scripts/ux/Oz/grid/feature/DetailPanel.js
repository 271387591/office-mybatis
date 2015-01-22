/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/7/11
 * Time: 11:39 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.grid.feature.DetailPanel', {
  /* Begin Definitions */
  extend: 'Ext.grid.feature.Feature',
  alias: 'feature.detailpanel',
  requires : [
    'Ext.panel.Panel'
  ],

  /* End Definitions */
  detailCls: 'detail',
  tplDetail: [],
  detailPlugins : [],

  startingDetail: 'Please select a record to see additional details',

  attachEvents: function() {
    var me = this,
      grid = me.getGridPanel(),
      sm = grid.getSelectionModel();

    me.createDetail(grid);

    this.mon(sm, 'selectionchange', function(sm, rs) {
      if (rs.length) {
        grid.ownerCt.down('#editButton').enable();
        me.detail.update(rs[0].data);
      }
      else{
        grid.ownerCt.down('#editButton').setDisabled(true);
        me.detail.update(me.startingDetail);
      }
    });
  },

  createDetail : function(grid){
    var me = this, detail;
    if(!me.detail){
      detail = me.detail = Ext.create('Ext.panel.Panel', {
        flex : 5,
        autoScroll: true,
        plugins : me.detailPlugins,
        baseCls: me.detailCls,
        margin : '5 5 5 5',
        padding: me.detailPadding,
        tpl: me.tplDetail,
        html: me.startingDetail
      });
      grid.ownerCt.add(detail);
    }

  },

  getGridPanel : function(){
     return this.view.up('gridpanel');
  }

});