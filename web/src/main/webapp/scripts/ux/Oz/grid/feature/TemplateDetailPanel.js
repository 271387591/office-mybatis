/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/27/11
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */


Ext.define('Oz.grid.feature.TemplateDetailPanel',{
  extend: 'Ext.grid.feature.Feature',
  alias: 'feature.templatedetail',
  requires : [
    'Ext.panel.Panel'
  ],

  panelHeight: 50,

  detailCls: 'detail',
  tplDetail: [],
  detailPlugins : [],

  startingDetail: 'Please select a record to see additional details',

  attachEvents: function(){
    var me = this,
      grid = me.getGridPanel(),
      sm = grid.getSelectionModel();

    me.createDetail(grid);

    this.mon(sm, 'selectionchange', function(sm, rs) {
      if (rs.length) {
        me.detail.update(rs[0].data);
      }
      else{
        me.detail.update(me.startingDetail);
      }
    });

  },

  createDetail: function(grid){
    var me = this, detail;
    if(!me.detail){
      detail = me.detail = Ext.create('Ext.panel.Panel', {
        height : me.panelHeight,
        autoScroll: true,
        plugins : me.detailPlugins,
        baseCls: me.detailCls,
        margin : '5 5 5 5',
        padding: me.detailPadding,
        tpl: me.tplDetail,
        html: me.startingDetail
      });
      var items = [],dockItems = grid.getDockedItems('panel')[0].items.items;
      items.push(detail);
      for(var i = 0,len = dockItems.length;i<len;i++){
        items.push(dockItems[i]);
      }

      grid.getDockedItems('panel')[0].items.items = [];
      grid.getDockedItems('panel')[0].items.items = items;
      delete items;
    }
  },



  getGridPanel: function(){
    return this.view.up('gridpanel');
  }
});