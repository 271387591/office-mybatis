/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 13-9-17
 * Time: pm 2:49
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.view.GlobalTypeLeftTree', {
  extend: 'Ext.tree.Panel',
  requires: [
  ],
  alias: 'widget.globalTypeLeftTree',
  itemId: 'globalTypeLeftTree',
  rootVisible: true,
  autoScroll: true,
  title: '分类',
  border: true,
  header: false,
  root: {
    text: '所有',
    id: 'src1',
    expanded: true
  },
  initComponent: function () {
    var me  = this;
    Ext.apply(this, {
      store: Ext.create('FlexCenter.system.store.GlobalTypeTree', {
        storeId: 'globalTypeTreeStore'
      }),
      tbar: [
        {
          xtype: 'button',
          iconCls: 'btn-refresh',
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
          me.showGlobalType(record);
        },
          itemcontextmenu: function (view, record, item, index, e, eOpts) {
              e.preventDefault();
              e.stopEvent();
//              this.addMenu(view, record, item, index, e, eOpts);
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
  showGlobalType:function(record){
    var me = this;
    var catKey =me.ownerCt.ownerCt.down("combo#catKey").value;
    if(!catKey){catKey = record.get('catKey');}
    var globalTypeId = record.get('typeId');
    var path = record.get('path');
    var globalTypeView = me.ownerCt.ownerCt.down('globalTypeView');
    globalTypeView.catKey = catKey;
    globalTypeView.parentId = globalTypeId;
    var globalTypeStore = globalTypeView.down('grid').getStore();
    globalTypeStore.getProxy().extraParams = {keyword: '',catKey: catKey,path:path};
    globalTypeStore.loadPage(1);
  }
});