/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 13-9-17
 * Time: pm 2:49
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.view.GlobalTypeTree', {
  extend: 'Ext.tree.Panel',
  requires: [
      'FlexCenter.system.store.GlobalTypeTree'
  ],
  alias: 'widget.globalTypeTree',
  itemId: 'globalTypeTree',
  rootVisible: true,
  autoScroll: true,
  border: true,
  split: true,
//  header: false,
  root: {
    text: '所有',
    id: 'src1',
    expanded: true
  },
  initComponent: function () {
    var me  = this;
    var treeStore =  Ext.create('FlexCenter.system.store.GlobalTypeTree', {
        storeId: 'globalTypeStore'
      });
    treeStore.getProxy().extraParams = {catKey: me.catKey?me.catKey:null};
    Ext.apply(this, {
      store: treeStore,
      tbar: [
        {
          xtype: 'button',
          iconCls: 'refresh',
          text: '刷新',
          tooltip:'刷新',
          scope: this,
          handler: function () {
            this.getStore().reload();
          }
        },
        '-',
        {
          xtype: 'button',
          text: '展开',
          tooltip:'展开',
          iconCls: 'btn-expand',
          itemId: 'expandBtn',
          scope: this,
          disabled: true,
          handler: this.clickExpandAll

        },
        '-',
        {
          xtype: 'button',
          text: '收起',
          tooltip:'收起',
          itemId: 'collapseBtn',
          scope: this,
          iconCls: 'btn-collapse',
          handler: this.clickCollapseAll
        }
      ],
      listeners: {
        itemclick: function (view, record, item, index, e, eOpts) {
          e.preventDefault();
          e.stopEvent();
          me.showFileAttachType(record);
        }
      }
    });

    this.callParent();
  },
  clickExpandAll: function () {
    var me = this;
    me.down('#expandBtn').disable();
    this.getEl().mask('正在展开树...');
    me.expandAll(function () {
      me.getEl().unmask();
      me.down('#collapseBtn').enable();
    });

  },
  clickCollapseAll: function () {
    var me = this;
    me.down('#collapseBtn').disable();
    this.getEl().mask('正在收起树...');
    me.collapseAll(function () {
      me.getEl().unmask();
      me.down('#expandBtn').enable();
    });
  },
  showFileAttachType:function(record){
    var me = this;
    var typeId = record.get('typeId');
    var catKey = me.catKey?me.catKey:null;
    var centerPanelView = me.ownerCt.ownerCt.down('#'+(me.gridViewItemId?me.gridViewItemId:'centerPanelView'));
    var searchField = centerPanelView.down('textfield#searchKeyword');
    if(searchField)searchField.setValue("");
    centerPanelView.catKey = catKey;
    centerPanelView.typeId = typeId;
    var centerPanelGridStore = centerPanelView.down('grid').getStore();
    centerPanelGridStore.getProxy().extraParams = {typeId: typeId};
    centerPanelGridStore.loadPage(1);
  }
});