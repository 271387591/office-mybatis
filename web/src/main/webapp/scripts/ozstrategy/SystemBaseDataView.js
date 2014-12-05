/**
 * Created by IntelliJ IDEA.
 * User: kangpan
 * Date: 3/21/12
 * Time: 5:48 PM
 * To change this template use File | Settings | File Templates.
 */


Ext.define('FlexCenter.SystemBaseDataView', {
  extend: 'Oz.desktop.Module',

  requires: [
    'FlexCenter.system.view.GlobalTypeView',
    'FlexCenter.system.view.GlobalTypeLeftTree',
    'Ext.grid.*',
    'Ext.data.*',
    'Oz.access.RoleAccess'
  ],

  id: 'systemBaseDataView',
  moduleName: 'systemBaseDataView',

  init: function () {
    this.launcher = {
      text: '基础数据管理',
      iconCls: 'icon-globalType',
      handler: this.createWindow,
      scope: this
    };
  },
  createWindow: function () {
    var desktop = this.app.getDesktop(), win;
    win = desktop.getWindow('mySystemBaseDataView');
    if (!win) {
      win = desktop.createWindow({
        id: 'mySystemBaseDataView',
        title: '基础数据管理',
        iconCls: 'icon-globalType',
        width: 850,
        height: 500,
        shim: false,
//        modal: true,
        resizable: false,
        border: false,
        maximizable: false,
        layout: 'fit',
        items: [
          {
            xtype: 'tabpanel',
//            border: false,
            items: [
              {
                title: '系统分类',
                layout: 'border',
                border: false,
                items: [
                  {
                    region: 'west',
                    layout: 'border',
                    border: false,
                    width: 200,
//                    height: 420,
                    items: [
                      {
                        region: 'north',
                        margins: '1',
                        xtype:'toolbar',
                        items: [
                          {
                            xtype: 'combo',
                            margins: '1',
                            itemId:'catKey',
                            width:140,
                            triggerAction: 'all',
                            editable: false,
                            name: 'catKey',
                            hiddenName: 'catKey',
                            queryMode: 'local',
                            displayField: 'text',
                            valueField: 'key',
                            store: Ext.create('Ext.data.Store', {
                              fields: ['key', 'text'],
                              data: FlexCenter.Constants.GLOBAL_TYPE_KEY
                            }),
                            listeners: {
                              'change': function (combo, records) {
                                win.loadTree(win, combo.value)
                              }
                            }
                          },
                          {
                            text: '清空',
                            width:48,
                            xtype:'button',
                            iconCls: 'clear',
                            handler: function () {
                              win.down('combo#catKey').setValue("");
                            }
                          }
                        ]
                      },
                      {
                        xtype: 'globalTypeLeftTree',
                        region: 'center',
                        collapsible: true,
                        margins: '1',
                        split: true
                      }
                    ]
                  },
                  {
                    xtype: 'globalTypeView',
                    margins: '1',
                    region: 'center'
                  }
                ]
              }
//              {
//                title: '数据字典',
//                layout: 'border',
//                border: false,
//                items: [
//                  {
//                    xtype: 'dictionaryLeftTree',
//                    region: 'west',
//                    width: 200,
//                    height: 420,
//                    collapsible: true,
//                    margins: '1',
//                    split: true
//                  },
//                  {
//                    xtype: 'dictionaryView',
//                    region: 'center',
//                    margins: '1'
//                  }
//                ]
//              }
            ]
          }
        ],
        buttons: [
          {
            text: '关闭',
            handler: function () {
              win.close();
            }
          }
        ],
        loadTree:function(obj,catKey){
          var globalTypeStore = obj.down('globalTypeLeftTree').getStore();
          globalTypeStore.getProxy().extraParams = {keyword: '', catKey: catKey};
          globalTypeStore.load();
          var globalTypeView = win.down('globalTypeView');
          globalTypeView.catKey = catKey;
          var globalTypeGirdStore = globalTypeView.down('grid').getStore();
          globalTypeGirdStore.getProxy().extraParams = {keyword: '',catKey: catKey};
          globalTypeGirdStore.loadPage(1);
        }
      });
    }
    win.show();
  }
});