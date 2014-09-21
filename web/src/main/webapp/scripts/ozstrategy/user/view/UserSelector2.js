/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 12/7/13
 * Time: 2:24 PM
 * type:'SINGLE, SIMPLE, and MULTI'
 * resultBack: function(ids,names){console.log(ids,names)} ids is selected user‘s primary key join with comma, names is selected user's firstName join with comma
 * examples:
 Ext.widget('userSelector',{
              type:'SINGLE',
              resultBack: function(ids,names){
                 console.log(ids,names);
              }
            }).show();
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.UserSelector2', {
  extend: 'Ext.window.Window',
  alias: 'widget.userSelector2',
  layout: 'fit',

  requires: [
    'FlexCenter.user.store.Users',
    'Ext.selection.CheckboxModel',
//    'OzSOA.jiuzhai.store.system.OrgTree',
//    'OzSOA.jiuzhai.store.system.PositionTree',
    'FlexCenter.user.store.RoleTree'
  ],
  initComponent: function () {
    var me = this;
    var availableUserStore = me.getAvailableUserStore();
    availableUserStore.load({
      params: {
        keyword: ''
      }
    });
//    var orgStore = me.getOrgStore();
//    orgStore.load();
//    var positionStore = me.getPositionStore();
//    positionStore.load();
//    var roleStore = me.getRoleStore();
//    roleStore.load();
    var csm = Ext.create('Ext.selection.CheckboxModel', {
      mode: this.type ? this.type : 'MULTI'
    });
    Ext.apply(this, {
      border: false,
      title: '人员选择器',
      iconCls: 'user-icon',
      width: 560,
      modal: true,
      height: 350,
      items: [
        {
          xtype: 'panel',
          border: false,
          layout: 'border',
          items: [
//            {
//              xtype: 'panel',
//              region: 'west',
////              resizable:false,
//              width: 200,
//              height: 290,
//              split: true,
//              defaults: {
//                bodyStyle: 'padding:0'
//              },
//              layout: {
//                type: 'accordion',
//                titleCollapse: false,
//                animate: true,
//                activeOnTop: true
//              },
//              items: [
//                  {
//                      xtype: 'treepanel',
//                      rootVisible: false,
//                      autoScroll: true,
//                      width: 200,
//                      title: '所有用户',
//                      listeners: {
//                          'itemclick': function (tree, record, item, index, e, eOpts) {
//                              if (!record.data || !record.data.id || record.data.path == '0.1.') {
//                                  availableUserStore.getProxy().extraParams = {keyword: '', orgId: null};
//                                  availableUserStore.loadPage(1);
//                              } else {
//                                  me.orgId = record.data.id;
//                                  me.posId = null;
//                                  me.roleId = null;
//                                  me.down('textfield#searchKeyword').setValue("");
//                                  availableUserStore.getProxy().extraParams = {keyword: '', orgId: record.data.id};
//                                  availableUserStore.loadPage(1);
//                              }
//                          }
//                      }
//
//                  }
//                {
//                  xtype: 'treepanel',
//                  rootVisible: false,
//                  autoScroll: true,
//                  width: 200,
//                  title: '按部门查找',
//                  store: orgStore,
//                  listeners: {
//                    'itemclick': function (tree, record, item, index, e, eOpts) {
//                      if (!record.data || !record.data.id || record.data.path == '0.1.') {
//                        availableUserStore.getProxy().extraParams = {keyword: '', orgId: null};
//                        availableUserStore.loadPage(1);
//                      } else {
//                        me.orgId = record.data.id;
//                        me.posId = null;
//                        me.roleId = null;
//                        me.down('textfield#searchKeyword').setValue("");
//                        availableUserStore.getProxy().extraParams = {keyword: '', orgId: record.data.id};
//                        availableUserStore.loadPage(1);
//                      }
//                    }
//                  }
//                },
//                {
//                  xtype: 'treepanel',
//                  rootVisible: false,
//                  autoScroll: true,
//                  width: 200,
//                  title: '按岗位查找',
//                  store: positionStore,
//                  listeners: {
//                    'itemclick': function (tree, record, item, index, e, eOpts) {
//                      if (!record.data || !record.data.id || record.data.path == '0.1.') {
//                        availableUserStore.getProxy().extraParams = {keyword: '', posId: null};
//                        availableUserStore.loadPage(1);
//                      } else {
//                        me.posId = record.data.id;
//                        me.orgId = null;
//                        me.roleId = null;
//                        me.down('textfield#searchKeyword').setValue("");
//                        availableUserStore.getProxy().extraParams = {keyword: '', posId: record.data.id};
//                        availableUserStore.loadPage(1);
//                      }
//                    }
//                  }
//                }
                  
//                ,
//                {
//                  xtype: 'treepanel',
//                  title: '按角色查找',
//                  autoScroll: true,
////                  autoDestroy: true,
//                  width: 200,
//                  store: me.getRoleStore(),
//                  listeners: {
//                    'itemclick': function (tree, record, item, index, e, eOpts) {
//                      if (!record.data || !record.data.id || record.data.id == 0) {
//                        availableUserStore.getProxy().extraParams = {keyword: '', roleId: null};
//                        availableUserStore.loadPage(1);
//                      } else {
//                        me.roleId = record.data.id;
//                        me.orgId = null;
//                        me.posId = null;
//                        me.down('textfield#searchKeyword').setValue("");
//                        availableUserStore.getProxy().extraParams = {keyword: '', roleId: record.data.id};
//                        availableUserStore.loadPage(1);
//                      }
//                    }
//                  }
//                }
//              ]
//            },
            {
              xtype: 'grid',
              title: '人员列表',
              store: availableUserStore,
              height: 290,
              region: 'center',
              autoHeight: true,
              selModel: csm,
              tbar: [
                {
                  xtype: 'textfield',
                  itemId: 'searchKeyword'
                },
                {
                  text: '查询',
                  iconCls: 'search',
                  scope: this,
                  handler: this.onSearchClick
                },
                {
                  text: '清空',
                  iconCls: 'clear',
                  handler: function () {
                    me.down('textfield#searchKeyword').setValue("");
                    me.onSearchClick();
                  }
                }
              ],
              columns: [new Ext.grid.RowNumberer(),
                {
                  header: '姓名',
                  dataIndex: 'fullName',
                  flex: 1,
                    renderer:function(v,matadata,rec){
                        if(rec.get('id')==null){
                            return '<font color="red">'+v+'</font>';
                        }
                        return v;
                    }
                    
                },
                {
                  header: '登陆名',
                  dataIndex: 'username',
                  flex: 1,
                    renderer:function(v,matadata,rec){
                        if(rec.get('id')==null){
                            return '';
                        }
                        return v;
                    }
                }
              ],
              dockedItems: [
                {
                  xtype: 'pagingtoolbar',
                  store: availableUserStore,
                  dock: 'bottom',
                  displayInfo: false
                }
              ]
            }
          ],
          buttons: [
            {
              text: '确定',
              formBind: true,
              scope: me,
              handler: me.onSubmitClick
            },
            {
              text: '取消',
              handler: function () {
                me.close();
              }
            }
          ]
        }
      ]
    });
    this.callParent(arguments);
  },
  getAvailableUserStore: function () {
      var me=this;
    var store = Ext.StoreManager.lookup('availableUserStore');
    if (!store) {
      store = Ext.create('FlexCenter.user.store.Users', {
        proxy: {
          type: 'ajax',
          url: 'userController.do?method=listUsers',
          reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            messageProperty: 'message'
          }
        },
          listeners:{
              beforeload: function (s, e) {
                  e.params = {processAssignee:me.processAssignee || ''}; //ajax 附加参数
              }
          },
        storeId: 'availableUserStore'
      });
    }
    return store;

  },

  onSubmitClick: function () {
    var me = this;
    var selMode = me.down('grid').getSelectionModel();
    var hasSelect = selMode.hasSelection();
    if (hasSelect) {
      var records = selMode.getSelection();
      var selectedId = [];
      var selectedValue = [];
      var selectUserName = [];
      var callBackRecords = [];
      Ext.Array.each(records, function (record, index, recordsItSelf) {
        selectedId.push(record.data.id);
        selectedValue.push(record.data.fullName);
        selectUserName.push(record.data.username);
        callBackRecords.push({value: record.data.id,label: record.data.fullName,userName: record.data.username});
      });
      if (me.returnObj && me.returnObj == true) {
        if (me.resultBack) {
          me.resultBack(selectedId.join(','), selectedValue.join(','), selectUserName.join(','),callBackRecords);
          me.close();
        }
      }else{
        if (me.resultBack) {
          me.resultBack(selectedId.join(','), selectedValue.join(','), selectUserName.join(','));
          me.close();
        }
      }

    } else {
      Ext.MessageBox.show({
        title: '提示消息',
        width: 200,
        msg: '对不起，请选择人员',
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
      });
    }
  },
  getOrgStore: function () {
    var store = Ext.StoreManager.lookup('orgTreeStore1');
    if (!store) {
      store = Ext.create('OzSOA.jiuzhai.store.system.OrgTree', {
        storeId: 'orgTreeStore1'
      })
    }
    return store;
  },
  getPositionStore: function () {
    var store = Ext.StoreManager.lookup('positionTree1');
    if (!store) {
      store = Ext.create('OzSOA.jiuzhai.store.system.PositionTree', {
        storeId: 'positionTree1'
      })
    }
    return store;
  },
  getRoleStore: function () {
    var store = Ext.StoreManager.lookup('roleTree');
    if (!store) {
      store = Ext.create('FlexCenter.user.store.RoleTree', {
        storeId: 'roleTree'
      })
    }
    return store;
  },
  onSearchClick: function () {
    var me = this;
    var textField = me.down('textfield#searchKeyword');
    var store = me.getAvailableUserStore();
    store.getProxy().extraParams = {roleId: me.roleId ? me.roleId : null, orgId: me.orgId ? me.orgId : null, posId: me.posId ? me.posId : null, keyword: textField.getValue()};
    store.loadPage(1);
  }
});