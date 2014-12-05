/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 7/9/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.system.view.GlobalTypeView', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.globalTypeView',
//  autoScroll: true,

  requires: [
    'FlexCenter.system.store.GlobalTypes',
    'Ext.ux.form.SearchField',
    'FlexCenter.system.view.GlobalTypeForm'
  ],

  getStore: function () {
    var store = Ext.StoreManager.lookup("baseGlobalTypeStore");
    if (!store) {
      store = Ext.create("FlexCenter.system.store.GlobalTypes", {
        storeId: 'baseGlobalTypeStore',
        pageSize:15
      });
    }
    return store;
  },

  initComponent: function () {

    var me = this;
    var globalTypeStore = me.getStore();
    globalTypeStore.load({
       params:{
         keyword: ''
       }
    });
    Ext.apply(this, {
      layout: 'fit',
      
      items: {
        xtype: 'grid',
        border: false,
        forceFit: true,
        autoScroll: true,
        tbar: [
          {
            frame: true,
            iconCls: 'add',
            xtype: 'button',
            text: '添加',
            scope: this,
            handler: this.onAddClick
          },
          '-',
          {
            frame: true,
            iconCls: 'update',
            xtype: 'button',
            text: '编辑',
            scope: this,
            handler: this.onUpdateClick
          },
          {
            frame: true,
            iconCls: 'delete',
            xtype: 'button',
            text: '删除',
            scope: this,
            handler: this.onDeleteClick
          }
        ],
        dockedItems: [
          {
            xtype: 'pagingtoolbar',
            store: globalTypeStore,
            dock: 'bottom',
            displayInfo: true
          }
        ],
          features:[{
            ftype: 'search',
            disableIndexes : ['id','typeKey','catKey','parentName','createDate'],
            paramNames: {
              fields: 'fields',
              query: 'keyword'
            },
            selectAllText:'',
            searchMode : 'remote'
          }],
        columns: [
          {
            header: '名称',
            dataIndex: 'typeName'
          },
          {
            header: '分类Key',
            dataIndex: 'typeKey'
          },
          {
            header: '标识值',
            dataIndex: 'catKey',
            renderer:function(v){
              if(v){
                var value='';
               Ext.Array.each(FlexCenter.Constants.GLOBAL_TYPE_KEY,function(o){
                 if(o.key==v){
                   value = o.text;
                   return;
                 }
               });
               return value;
              } else{
                return '';
              }
            }
          },
          {
            header: '父级',
            dataIndex: 'parentName',
            renderer: function (v) {
              if(!v){
                return '无'
              }
              return v;
            }
          },
          {
            header: '创建时间',
            dataIndex: 'createDate',
            renderer: function (v) {
              return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
          }
        ],
        store: globalTypeStore
      }
    });
    this.callParent();
  }
  ,
  onAddClick: function () {
    var me = this;
    var win = Ext.widget('globalTypeForm',{
      title:'添加分类',
      catKey: this.catKey?this.catKey:'',
      parentId: this.parentId?this.parentId:'',
      isEdit:false
    });
    win.setActiveRecord(null);
    this.mon(win, 'addType', function (twin, data) {
      me.saveOrUpdate(twin, data);
      win = twin;
      win.close();
    });
    win.show();
  },

  onUpdateClick: function () {
    var me = this;
    var grid = me.down('grid');
    var selection = grid.getView().getSelectionModel().getSelection()[0];
    if (selection) {
    var win = Ext.widget('globalTypeForm',{
      title:'编辑分类',
      isEdit:true
      });
    win.setActiveRecord(selection);
    this.mon(win, 'updateType', function (twin, data) {
      me.saveOrUpdate(twin, data);
      win = twin;
      win.close();
    });
    win.show();
    }else{
      Ext.MessageBox.alert({
        title: '编辑分类',
        icon: Ext.MessageBox.ERROR,
        msg: "请先选择分类",
        buttons: Ext.MessageBox.OK
      });
    }
  },

  onDeleteClick: function () {
    var me = this;
    var selects = me.down('grid').getSelectionModel().getSelection();
    me.deleteClick(selects);
  },

  deleteClick: function (selects) {
    var me = this, globalTypeIds = [];
    if (!selects || selects.length < 1) {
      Ext.MessageBox.alert({
        title: '删除分类',
        icon: Ext.MessageBox.ERROR,
        msg: "请选择要删除的分类",
        buttons: Ext.MessageBox.OK
      });
      return;
    }
    Ext.Array.each(selects, function (mode) {
      globalTypeIds.push(mode.get("typeId"));
    });
    globalTypeIds = globalTypeIds.join(",");
    Ext.MessageBox.show({
      title: '删除分类',
      buttons: Ext.MessageBox.YESNO,
      msg: '删除该分类会一并删除其子分类，确定要删除选中的分类吗?',
      icon: Ext.MessageBox.QUESTION,
      fn: function (btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            url: 'globalTypeController.do?method=removeGlobalType',
            params: {
              globalTypeIds: globalTypeIds
            },
            method: 'POST',
            success: function (response, options) {
              var result = Ext.decode(response.responseText);
              if (result.success) {
                me.down('grid').getStore().load();
              } else {
                Ext.MessageBox.alert({
                  title: '提示信息',
                  icon: Ext.MessageBox.ERROR,
                  msg: result.message,
                  buttons: Ext.MessageBox.OK
                });
              }
            },
            failure: function (response, options) {
              Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
          })
        }
      }
    });

  },
  saveOrUpdate: function (win, data, action) {
    var me = this;
    Ext.Ajax.request({
      url: 'globalTypeController.do?method=saveOrUpdate',
      params: data,
      method: 'POST',
      success: function (response, options) {
        var result = Ext.decode(response.responseText);
        if (result.success) {
          me.down('grid').getStore().load();
          me.ownerCt.ownerCt.down('#globalTypeLeftTree').getStore().load();
        } else {
          Ext.MessageBox.alert({
            title: '提示信息',
            icon: Ext.MessageBox.ERROR,
            msg: result.message,
            buttons: Ext.MessageBox.OK
          });
        }
      },
      failure: function (response, options) {
        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
      }
    })
  },
  onSearchClick: function () {
    var me = this;
    var textField = me.down('textfield#searchKeyword');
    var store = me.getStore();
    store.getProxy().extraParams = {keyword: textField.getValue(),catKey: this.catKey?this.catKey:''};
    store.loadPage(1);
  }
});
