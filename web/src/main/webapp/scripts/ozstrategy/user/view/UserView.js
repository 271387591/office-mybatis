/**
 * Created by IntelliJ IDEA.
 * User: kangpan
 * Date: 1/25/13
 * Time: 10:00 AM
 * To change this template use File | Settings | File Templates.
 */


Ext.define('FlexCenter.user.view.UserView', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.userView',

  requires: [
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.toolbar.Paging',
    'Ext.toolbar.TextItem',
    'FlexCenter.user.store.Users',
      'Ext.ux.grid.feature.Detail',
    'FlexCenter.user.view.UserForm'
  ],

  getStore: function () {
    var store = Ext.StoreManager.lookup('userStore');
    if (!store) {
      store = Ext.create('FlexCenter.user.store.Users', {
        storeId: 'userStore',
        pageSize:15
      });
    }
    return store;
  },

  initComponent: function () {

    var me = this;
    var userStore = me.getStore();
    userStore.load();
    Ext.apply(this, {
      layout: 'fit',
      border: false,
      tbar: [
        {
          frame:true,
          iconCls:'user-add',
          xtype:'button',
          text:globalRes.buttons.add,
          scope: this,
            plugins: Ext.create('Oz.access.RoleAccess', {featureName:'addUser',mode:'hide'}),
          handler: this.onAddClick
        },
        {
          frame:true,
          iconCls:'user-edit',
          xtype:'button',
          text:globalRes.buttons.edit,
            itemId:'userEditBtn',
          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'updateUser',mode:'hide'}),
          scope: this,
          handler: this.onEditClick
        },
        {
          iconCls:'user-edit',
          text:userRoleRes.passwordTilte,
          scope:this,
            itemId:'userPasswordTilteBtn',
            plugins: Ext.create('Oz.access.RoleAccess', {featureName:'updateUserPassword',mode:'hide'}),
          handler:this.onChangePasswordClick
        },
        {
          iconCls:'user-delete',
          itemId:'lockUserBtn',
          text:userRoleRes.lockUser,
          scope:this,
            itemId:'userLockUserBtn',
            plugins: Ext.create('Oz.access.RoleAccess', {featureName:'lockUser',mode:'hide'}),
          handler: this.onLockUserClick
        },
        {
          iconCls:'user-delete',
          itemId:'enableUserBtn',
          text:userRoleRes.disableUser,
          scope:this,
            plugins: Ext.create('Oz.access.RoleAccess', {featureName:'disableUser',mode:'hide'}),
          handler: this.onDisableUserClick
        },{
          iconCls:'user-edit',
          itemId:'unLockUserBtn',
          text:userRoleRes.unLockUser,
              plugins: Ext.create('Oz.access.RoleAccess', {featureName:'unLockUser',mode:'hide'}),
          scope:this,
          handler: this.onUnLockUserClick
        },{
          iconCls:'user-edit',
          itemId:'unDisableUserBtn',
          text:userRoleRes.unDisableUser,
              plugins: Ext.create('Oz.access.RoleAccess', {featureName:'enableUser',mode:'hide'}),
          scope:this,
          handler: this.onUnDisableUserClick
        },'->','-',
        {
          xtype:'textfield',
          itemId:'searchKeyword',
          listeners:{
            change: function(self,newValue){
              if(!newValue){
                me.onSearchClick();
              }
            }
          }
        },
        {
          text:globalRes.buttons.search,
          iconCls:'search',
          scope:this,
          handler: this.onSearchClick
        },{
          text:globalRes.buttons.clear,
          iconCls:'clear',
          handler: function(){
            me.down('textfield#searchKeyword').setValue("");
            me.onSearchClick();
          }
        }
      ],
      items: {
        xtype: 'grid',
        border: false,
        forceFit: true,
        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'updateUser',mode:'hide'}),
        autoScroll: true,
        dockedItems:[{
          xtype: 'pagingtoolbar',
          store: userStore,
          dock: 'bottom',
          displayInfo: true
        }],
          features:{
              id: 'detail',
              ftype: 'detail',
              tplDetail:[
                  '<tpl for=".">',
                      userRoleRes.header.fullName + ' : <b>{fullName}</b><br/>',
                      userRoleRes.header.defaultRoleName + ' : <b>{defaultRoleDisplayName}</b><br/>',
                      userRoleRes.userRoles + ' : <b><tpl for="simpleRoles"><tpl if="xindex != 1">, </tpl>{#}. {displayName}</tpl></b><br/>',
                      globalRes.header.createDate + ' : <b>{createDate}</b><br/>',
                  '</tpl>'
              ]
          },
        columns: [
          {
            header: userRoleRes.header.fullName,
            dataIndex: 'fullName'
          },
          {
            header: userRoleRes.header.username,
            dataIndex: 'username'
          },
          {
            header: userRoleRes.header.defaultRoleName,
            dataIndex: 'defaultRoleDisplayName'
          },
          {
            header:userRoleRes.header.accountLocked,
            dataIndex:'accountLocked',
            renderer: function(v){
              return v?globalRes.yes:globalRes.no;
            }
          },
          {
            header:userRoleRes.header.enabled,
            dataIndex:'enabled',
            renderer: function(v){
              return v?globalRes.yes:globalRes.no;
            }
          },
          {
            header: globalRes.header.createDate,
            dataIndex: 'createDate'
          }
        ],
          viewConfig: {
              getRowClass : function(record) {
                  // return a custom css class based on the record or index
                  if (!record.get('enabled')) {
                      return 'error-row';
                  }
                  if (record.get('accountLocked')) {
                      return 'locked-row';
                  }
                  if(record.get('username')=='admin'){
                      return 'disabled-row';
                  }
              }
          },
        store: userStore,
        listeners:{
            itemclick: function(self,record){
                if(record.get('username')=='admin'){
                    me.down('button#enableUserBtn').disable();
                    me.down('button#userEditBtn').disable();
                    me.down('button#userPasswordTilteBtn').disable();
                    me.down('button#userLockUserBtn').disable();
                    me.down('button#enableUserBtn').disable();
                    me.down('button#unLockUserBtn').disable();
                    me.down('button#unDisableUserBtn').disable();
                }else{
                    me.down('button#enableUserBtn').enable();
                    me.down('button#userEditBtn').enable();
                    me.down('button#userPasswordTilteBtn').enable();
                    me.down('button#userLockUserBtn').enable();
                    me.down('button#enableUserBtn').enable();
                    me.down('button#unLockUserBtn').enable();
                    me.down('button#unDisableUserBtn').enable();
                }
            },
            itemdblclick:function( view, record, item, index, e, eOpts ){
                if(record.get('username')=='admin'){
                    return;
                }
                me.onEditClick();
            }
        }
      }
    });
    this.callParent();
  },
    onAddClick:function(){
        var me=this;
        ajaxPostRequest('userRoleController.do?method=readAvailableRoles',undefined,function(result){
            if(result.success){
                var availableRoleStore;
                if(!availableRoleStore){
                    availableRoleStore=Ext.create('FlexCenter.user.store.Roles', {
                        storeId:'availableRoleStore',
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
    var grid = me.down('grid');
    var edit = Ext.widget('userForm',{
        isAdmin: true,
        availableRoleStore:availableRoleStore
    }).show();
    edit.setActiveRecord(null);
    this.mon(edit, 'create', function( win, data) {
      Ext.Ajax.request({
        url: 'userController.do?method=saveUser',
        params: data,
        method: 'POST',
        success: function (response, options) {
          var result = Ext.decode(response.responseText);
          if (result.success) {
            grid.getStore().load();
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

  onDblClick: function(view, record, item, index, e) {
    var edit,me = this;
      edit = Ext.widget('userForm',{
        isAdmin: record.get("roleName")=='ROLE_ADMIN'?true:false,
          isEdit:false
      }).show();
      edit.setActiveRecord(record);
    this.mon(edit, 'update', function(win, form,active){
      var fields = active.fields,
          values = form.getValues(),
          name,
          obj = {};

      fields.each(function(f) {
        name = f.name;
        if (name in values) {
          obj[name] = values[name];
        }
      });
      active.beginEdit();
      active.set(obj);
      active.endEdit();
      me.editWin = win;
      me.editWin.close(); 
    });
  },
    onEditClick:function(){
        var me=this;
        ajaxPostRequest('userRoleController.do?method=readAvailableRoles',undefined,function(result){
            if(result.success){
                var availableRoleStore;
                if(!availableRoleStore){
                    availableRoleStore=Ext.create('FlexCenter.user.store.Roles', {
                        storeId:'availableRoleStore',
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
    var grid = me.down('grid');
    var selection = grid.getView().getSelectionModel().getSelection()[0];
    if (selection) {
      var edit;
      edit = Ext.widget('userForm',{
        isAdmin: selection.get("roleName")=='ROLE_ADMIN'?true:false,
          isEdit:true,
          availableRoleStore:availableRoleStore  
      }).show();
      edit.setActiveRecord(selection);

      this.mon(edit, 'update', function(win, form,active,roleids){
        var fields = active.fields,
            values = form.getValues(),
            name,
            obj = {};
        fields.each(function(f) {
          name = f.name;
            if(name=='simpleRoles'){
                return false;
            }
          if (name in values) {
            obj[name] = values[name];
          }
        });
          obj.roleIds= roleids.join(',');
        Ext.Ajax.request({
          url: 'userController.do?method=updateUser',
          params: obj,
          method: 'POST',
          success: function (response, options) {
            var result = Ext.decode(response.responseText);
            if (result.success) {
              grid.getStore().load();
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
        title: userRoleRes.editUser,
        width: 300,
        msg: userRoleRes.msg.editUser,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
      });
    }
  },
  onChangePasswordClick: function(){
    var me = this;
    var grid = me.down('grid');
    var record = grid.getView().getSelectionModel().getSelection()[0];
    if (record) {
      var win = Ext.create('Ext.Window',{
        width:500,
        modal:true,
        border: false,
        title:userRoleRes.passwordTilte+'['+record.data.fullName+"]",
        items:Ext.create('Ext.form.Panel',{
          bodyPadding: 5,
          layout: 'anchor',
          defaults: {
            anchor: '100%'
          },
          defaultType: 'textfield',
          items:[{
            fieldLabel: userRoleRes.newPassword,
            minLength: 6,
            minLengthText: userRoleRes.passwordError,
            maxLength: 16,
            maxLengthText: userRoleRes.passwordError,
            name: 'newPassword',
            inputType:'password',
            allowBlank: false,
            showCapsWarning: true
          },{
            fieldLabel: userRoleRes.passwordAffirm,
            minLength: 6,
            minLengthText: userRoleRes.passwordError,
            maxLength: 16,
            maxLengthText: userRoleRes.passwordError,
            name: 'confirmPassword',
            inputType:'password',
            allowBlank: false,
            validator: function(v) {
              var form = this.ownerCt.getForm();
              var newPass = form.findField('newPassword');
              if (v == newPass.getValue()) {
                return true;
              }
              else {
                return userRoleRes.passwordHitNotAllow;
              }
            }
          }]
        }),
        buttons:[{
          text:globalRes.buttons.submit,
          handler:function(){
            var userId = record.data.id;
            var newPassword = this.up('window').down('form').getForm().findField('newPassword').getValue();
            me.changePassword(userId,newPassword,this);
          }
        },{
          text:globalRes.buttons.back,
          handler: function(){
            this.up('window').close();
          }
        }]
      });
      win.show();
    }else {
      Ext.MessageBox.show({
        title: userRoleRes.passwordTilte,
        width: 300,
        msg: userRoleRes.msg.passwordEdit,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
      });
    }
  },

  changePassword: function(userId,newPassword,openWin){
    Ext.Ajax.request({
      url: 'userController.do?method=updatePasswordByAdmin',
      params: { id: userId,newPassword:newPassword },
      method: 'POST',
      success: function (response, options) {
        var result = Ext.decode(response.responseText);
        if (result.success) {
          openWin.up('window').close();
//          Ext.MessageBox.show({
//            title: userRoleRes.passwordTilte,
//            width: 300,
//            msg: userRoleRes.msg.changePassword,
//            buttons: Ext.MessageBox.OK,
//            icon: Ext.MessageBox.INFO
//          });
        }
        else {
          Ext.MessageBox.show({
            title: userRoleRes.passwordTilte,
            width: 300,
            msg: result.message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
          });
        }
      },
      failure: function (response, options) {
        Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
      }
    });
  },
    disableUnUser:function(disable){
        var me = this;
        var grid = me.down('grid');
        var record = grid.getView().getSelectionModel().getSelection()[0];
        if(record){
            var title = disable?userRoleRes.disableUser:userRoleRes.unDisableUser;
            var url = disable?'disableUser':'unDisableUser';
            var userId = record.data.id;
            var username = record.data.fullName;
            Ext.MessageBox.show({
                title: title,
                width: 400,
                msg: title+'['+username+']',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn==='yes'){
                        Ext.Ajax.request({
                            url: 'userController.do?method='+url,
                            params: { id: userId},
                            method: 'POST',
                            success: function (response, options) {
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
//                                    Ext.MessageBox.show({
//                                        title: title,
//                                        width: 300,
//                                        msg: disable?userRoleRes.msg.disableUserSuccess:userRoleRes.msg.unDisableUserSuccess,
//                                        buttons: Ext.MessageBox.OK,
//                                        icon: Ext.MessageBox.INFO
//                                    });
                                    me.getStore().load();
                                }
                                else {
                                    Ext.MessageBox.show({
                                        title: title,
                                        width: 300,
                                        msg: result.message,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                            }
                        });
                    }
                }
            });
        }else {
            Ext.MessageBox.show({
                title: disable?userRoleRes.disableUser:userRoleRes.unDisableUser,
                width: 300,
                msg: userRoleRes.msg.editUser,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },
    

  onDisableUserClick: function(){
      this.disableUnUser(true);
  },
    onUnDisableUserClick: function(){
      this.disableUnUser(false);
    },
    
    lockOrUnlockUser:function(lock){
        var me=this;
        var grid = me.down('grid');
        var record = grid.getView().getSelectionModel().getSelection()[0];
        if(record){
            var title = lock?userRoleRes.lockUser:userRoleRes.unLockUser;
            var url = lock?'lockUser':'unLockUser';
            var userId = record.data.id;
            var username = record.data.fullName;

            Ext.MessageBox.show({
                title: title,
                width: 400,
                msg: title+'['+username+']？',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: 'userController.do?method='+url,
                            params: { id: userId},
                            method: 'POST',
                            success: function (response, options) {
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
//                                    Ext.MessageBox.show({
//                                        title: title,
//                                        width: 350,
//                                        msg: lock?userRoleRes.msg.lockUserSuccess:userRoleRes.msg.unLockUserSuccess,
//                                        buttons: Ext.MessageBox.OK,
//                                        icon: Ext.MessageBox.INFO
//                                    });
                                    grid.getStore().load();
                                } else {
                                    Ext.MessageBox.show({
                                        title: title,
                                        width: 350,
                                        msg: result.message,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                            }
                        });
                    }
                }
            });
        }else {
            Ext.MessageBox.show({
                title: lock?userRoleRes.lockUser:userRoleRes.unLockUser,
                width: 350,
                msg: userRoleRes.msg.editUser,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },
  onLockUserClick: function(){
      this.lockOrUnlockUser(true);
  },
    onUnLockUserClick: function(){
      this.lockOrUnlockUser(false);
    },
    

  onSearchClick: function(){
    var me = this;
    var textField = me.down('textfield#searchKeyword');
    var store = me.getStore();
    store.getProxy().extraParams = {keyword: textField.getValue()};
    store.loadPage(1);
//    store.load();
  }
});