/**
 * Created with IntelliJ IDEA.
 * User: wangym
 * Date: 1/30/13
 * Time: 2:08 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.RoleView',{
  extend: 'Ext.grid.Panel',
  alias: 'widget.roleView',

  requires: [
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.toolbar.Paging',
    'Ext.toolbar.TextItem',
    'FlexCenter.user.store.Roles',
    'FlexCenter.user.view.RoleForm',
    'FlexCenter.user.store.AllFeatures',
      'Oz.access.RoleAccess'
  ],

  layout: 'fit',
  border: false,

  getStore: function () {
    var store = Ext.StoreManager.lookup('roleStore');
    if (!store) {
      store = Ext.create('FlexCenter.user.store.Roles', {
        storeId: 'roleStore'
      });
    }
    return store;
  },
  initComponent: function () {
    var me = this;

    me.store = me.getStore();

    me.tbar = [{
      text:globalRes.buttons.add,
      iconCls:'user-add',
      scope:me,
        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'addRole',mode:'hide'}),
      handler:me.onAddClick
    },{
      text:globalRes.buttons.edit,
      iconCls:'user-edit',
      itemId:'roleEditBtn',
        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'updateRole',mode:'hide'}),
      scope:me,
      handler:me.onEditClick
    },{
      text:globalRes.buttons.remove,
      iconCls:'user-delete',
      itemId:'roleDeleteBtn',
        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'deleteRole',mode:'hide'}),
      scope:me,
      handler:me.onDeleteClick
    }
    //    ,'->','-',
    //{
    //  xtype:'textfield',
    //  itemId:'searchRoleName',
    //  listeners:{
    //    change: function(self,newValue){
    //      if(!newValue){
    //        me.onSearchClick();
    //      }
    //    }
    //  }
    //},
    //  {
    //    text:globalRes.buttons.search,
    //    iconCls:'search',
    //    scope:me,
    //    handler: me.onSearchClick
    //  },{
    //    text:globalRes.buttons.clear,
    //    iconCls:'clear',
    //    handler: function(){
    //      me.down('textfield#searchRoleName').setValue("");
    //      me.onSearchClick();
    //    }
    //  }
    ];
      me.plugins = Ext.create('Oz.access.RoleAccess', {featureName:'updateRole',mode:'hide'});

    me.columns = [{
      header:userRoleRes.header.roleName,
      dataIndex:'name',
      flex:1
    },{
      header:userRoleRes.header.displayName,
      dataIndex:'displayName',
      flex:1
    },{
      header: userRoleRes.header.description,
      dataIndex: 'description',
      flex:1
    },{
      header: globalRes.header.createDate,
      dataIndex: 'createDate',
      flex:1
    }];
      me.features=[{
          id: 'detail',
              ftype: 'detail',
              tplDetail:[
              '<tpl for=".">',
                  userRoleRes.header.roleName + ' : <b>{name}</b><br/>',
                  userRoleRes.header.displayName + ' : <b>{displayName}</b><br/>',
                  userRoleRes.roleFeatures + ' : <b><tpl for="simpleFeatures"><tpl if="xindex != 1">, </tpl>{#}. {displayName}</tpl></b><br/>',
                  globalRes.header.createDate + ' : <b>{createDate}</b><br/>',
              '</tpl>'
          ]
      },{
          ftype: 'search',
          disableIndexes : ['id','description','createDate'],
          paramNames: {
              fields: 'fields',
              query: 'keyword'
          },
          searchMode : 'remote'
      }];

    me.dockedItems = [{
      xtype: 'pagingtoolbar',
      store: me.getStore(),
      dock: 'bottom',
      displayInfo: true
    }];
      me.viewConfig= {
          getRowClass : function(record) {
              if(record.get('name')=='ROLE_ADMIN'){
                  return 'disabled-row';
              }
          }
      };
        me.listeners={
            itemclick: function(self,record){
                if(record.get('name')=='ROLE_ADMIN'){
                    me.down('button#roleEditBtn').disable();
                    me.down('button#roleDeleteBtn').disable();
                }else{
                    me.down('button#roleEditBtn').enable();
                    me.down('button#roleDeleteBtn').enable();
                }
            },
          itemdblclick:function( view, record, item, index, e, eOpts ){
              if(record.get('name')=='ROLE_ADMIN'){
                  return;
              }
              me.onEditClick();
          }
      };

    me.on('afterrender',function(){
      me.getStore().load();
    });
    me.callParent();
  },

  onAddClick: function(){
      var me=this;
      ajaxPostRequest('userRoleController.do?method=readAvailableFeature',undefined,function(result){
          if(result.success){
              var availableRoleStore;
              if(!availableRoleStore){
                  availableRoleStore=Ext.create('FlexCenter.user.store.AllFeatures', {
                      storeId:'readAvailableFeature',
                      data:result,
                      proxy: {
                          type: 'memory',
                          reader: {
                              type: 'json',
                              root: 'data',
                              totalProperty  : 'total',
                              messageProperty: 'message'
                          }
                      }
                  });
              }
              me.addClick(availableRoleStore);
          }
      });
  },
    addClick: function(availableRoleStore) {
        var me = this;
        var edit = Ext.widget('roleForm',{
            isEdit:false,
            availableFeatureStore:availableRoleStore
        }).show();
        edit.setActiveRecord(null);
        this.mon(edit, 'create', function( win, data) {
            Ext.Ajax.request({
                url: 'userRoleController.do?method=saveRole',
                params: data,
                method: 'POST',
                success: function (response, options) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        me.getStore().load();
                        me.editWin = win;
                        me.editWin.close();
                    }
                    if(result.message){
                        Ext.MessageBox.show({
                            title: globalRes.title.prompt,
                            width: 300,
                            msg: result.message,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                    }
                },
                failure: function (response, options) {
                    Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                }
            });
        }, this);
    },

  onEditClick: function(){
    var me = this;
      ajaxPostRequest('userRoleController.do?method=readAvailableFeature',undefined,function(result){
          if(result.success){
              var availableRoleStore;
              if(!availableRoleStore){
                  availableRoleStore=Ext.create('FlexCenter.user.store.AllFeatures', {
                      storeId:'readAvailableFeature',
                      data:result,
                      proxy: {
                          type: 'memory',
                          reader: {
                              type: 'json',
                              root: 'data',
                              totalProperty  : 'total',
                              messageProperty: 'message'
                          }
                      }
                  });
              }
              me.editClick(availableRoleStore);
          }
      });
  },
    editClick: function(availableRoleStore) {
        var me = this;
        var selection = me.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            var edit;
            edit = Ext.widget('roleForm',{
                isEdit:true,
                availableFeatureStore:availableRoleStore
            }).show();
            edit.setActiveRecord(selection);
            this.mon(edit, 'update', function(win,data){
                Ext.Ajax.request({
                    url: 'userRoleController.do?method=updateRole',
                    params: data,
                    method: 'POST',
                    success: function (response, options) {
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            me.getStore().load();
                            me.editWin = win;
                            me.editWin.close();
                        }
                        if(result.message){
                            Ext.MessageBox.show({
                                title: globalRes.title.prompt,
                                width: 300,
                                msg: result.message,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    },
                    failure: function (response, options) {
                        Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                    }
                });
            });
        }
        else {
            Ext.MessageBox.show({
                title: userRoleRes.editRole,
                width: 300,
                msg: userRoleRes.msg.editRole,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },

  onDeleteClick: function(){
    var me = this;
    var record = me.getSelectionModel().getSelection()[0];
    if(record){
      Ext.Msg.confirm(userRoleRes.removeRole,Ext.String.format(userRoleRes.msg.removeRole,record.data.displayName),function(txt){
        if(txt==='yes'){
          Ext.Ajax.request({
            url: 'userRoleController.do?method=removeRole',
            params: {id:record.data.id},
            method: 'POST',
            success: function (response, options) {
              var result = Ext.decode(response.responseText);
              if(result.success){
                me.getStore().load();
              }else{

              }
            },
            failure: function (response, options) {
              Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
            }
          });
        }
      });
    }else{
      Ext.MessageBox.show({
        title: userRoleRes.removeRole,
        width: 300,
        msg: userRoleRes.editRole,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
      });
    }
  },

  onSearchClick: function(){
    var me = this;
    var textField = me.down('textfield#searchRoleName');
    var store = me.getStore();
    store.getProxy().extraParams = {roleName: textField.getValue()};
    store.load();
  }
});