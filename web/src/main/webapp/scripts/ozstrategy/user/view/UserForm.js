/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 25/1/13
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.UserForm', {
  extend: 'Ext.window.Window',
  alias: 'widget.userForm',

  requires: [
    'Ext.form.Panel',
    'Ext.data.Store',
      'Ext.ux.grid.feature.Search',
      'Ext.ux.Utils',
      'Ext.ux.form.MultiSelect'
  ],

  config: {
    title: undefined,
    activeRecord: null
  },
  mySelf: false,
  resizable: false,
  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      layout: 'fit',
      autoShow: true,
      modal: true,
      width: 800,
      autoHeight: true,
      border:false,
      minWidth: 600,
      items: [
        {
          xtype: 'form',
            frame:true,
            bodyPadding: 5,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
          buttons: [
            {
              xtype: 'button',
              itemId: 'save',
              text: globalRes.buttons.save,
              formBind: true,
              handler: function () {
                var win = this.up('window');
                win.onSave();
              }
            },
            {
              xtype: 'button',
              text: globalRes.buttons.cancel,
              handler: function () {
                var win = this.up('window');
                win.onCancel();
              }
            }
          ],
          items: [
            {
              xtype: 'fieldset',
              checkboxToggle: false,
              title: userRoleRes.userInfo,
              autoHeight: true,
              defaultType: 'textfield',
              defaults: {               // defaults are applied to items, not the container
                anchor: '100%'
              },
              collapsed: false,
              items: [
                {
                  xtype: 'hidden',
                  name: 'id'
                },
                {
                  xtype: 'hidden',
                  name: 'defaultRoleId',
                  itemId:'defaultRoleId'
                },
                  {
                      fieldLabel: '<font color="red">*</font>'+userRoleRes.header.username,
                      name: 'username',
                      maxLength: 50,
                      minLength: 1,
                      blankText:globalRes.tooltip.notEmpty,
                      tabIndex: 2,
                      readOnly:me.isEdit,
                      readOnlyCls:'x-item-disabled',
                      regex:/^[a-zA-Z][a-zA-Z0-9_]*$/,
                      regexText:userRoleRes.usernameRegexText,
                      listeners:{
                          blur:function(input){
                              if(!me.isEdit){
                                  ajaxPostRequest('userController.do?method=getUserByUsername',{username:input.getValue()},function(result){
                                      if(result.success){
                                          input.markInvalid(userRoleRes.usernameExist);
                                      }
                                  },true);
                              }
                          }

                      },
                      allowBlank: false
                  },
                {
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.header.firstName,
                  name: 'firstName',
                  maxLength: 20,
                  minLength: 1,
                  tabIndex: 1,
                  blankText:globalRes.tooltip.notEmpty,
                  allowBlank: false
                },
                  {
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.header.lastName,
                  name: 'lastName',
                  maxLength: 20,
                  minLength: 1,
                  tabIndex: 1,
                  blankText:globalRes.tooltip.notEmpty,
                  allowBlank: false
                },
                {
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.header.password,
                  itemId:'password',
                  name: 'password',
                  blankText:globalRes.tooltip.notEmpty,
                  tabIndex: 5,
                  minLength: 6,
                  minLengthText: userRoleRes.passwordError,
                  maxLength: 16,
                  maxLengthText: userRoleRes.passwordError,
                  inputType:'password',
                  allowBlank: false
                },{
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.passwordAffirm,
                  itemId:'passwordAffirm',
                  name: 'passwordAffirm',
                  blankText:globalRes.tooltip.notEmpty,
                  tabIndex: 5,
                  minLength: 6,
                  minLengthText: userRoleRes.passwordError,
                  maxLength: 16,
                  maxLengthText: userRoleRes.passwordError,
                  inputType:'password',
                  validator: function(v) {
                      var newPass = me.down('#password');
                      if (v == newPass.getValue()) {
                          return true;
                      }
                      else {
                          return userRoleRes.passwordHitNotAllow;
                      }
                  },
                  allowBlank: false
                },{
                      fieldLabel:'<font color="red">*</font>'+userRoleRes.header.gender,
                      xtype:'combo',
                      name:'gender',
                      mode:'local',
                      editable:false,
                      triggerAction:'all',
                      store:[
                          ['M', globalRes.header.man],
                          ['F', globalRes.header.woman]
                      ],
                      value:'M'
                  },{
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.header.mobile,
                  itemId:'mobile',
                  name: 'mobile',
                  blankText:globalRes.tooltip.notEmpty,
                  regex:/^1[3|4|5|8][0-9]\d{8}$/,
                  regexText:userRoleRes.mobileRegexText,
                  listeners:{
                      blur:function(input){
                          if(!me.isEdit){
                              ajaxPostRequest('userController.do?method=getUserByMobile',{mobile:input.getValue()},function(result){
                                  if(result.success){
                                      input.markInvalid(userRoleRes.mobileExist);
                                  }
                              },true);
                          }
                      }

                  },
                  //validator:function(v){
                  //    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(v))){
                  //        return false;
                  //    }
                  //    return true;
                  //},
                  allowBlank: false
                },{
                  fieldLabel: '<font color="red">*</font>'+userRoleRes.header.email,
                  itemId:'email',
                  name: 'email',
                  vtype: 'email',
                  listeners:{
                      blur:function(input){
                          if(!me.isEdit){
                              ajaxPostRequest('userController.do?method=getUserByEmail',{email:input.getValue()},function(result){
                                  if(result.success){
                                      input.markInvalid(userRoleRes.emailExist);
                                  }
                              },true);
                          }
                      }

                  },
                  blankText:globalRes.tooltip.notEmpty,
                  allowBlank: false
                },
              ]
            },
              {
                  xtype: 'fieldset',
                  title: userRoleRes.selectRole,
                  checkboxToggle: false,
                  height:250,
                  autoHeight: true,
                  defaults: {               // defaults are applied to items, not the container
                      anchor: '100%'
                  },
                  items:[
                      {
                          xtype: 'multiselect',
                          border: false,
                          name: 'simpleRoles',
                          itemId: 'roles',
                          hideLabel: true,
                          filterMode: 'local',
                          allowBlank: false,
                          store: me.availableRoleStore,
                          availableTitle:userRoleRes.availableRoles,
                          selectedTitle :userRoleRes.assignedRoles,
                          availableIdProperty:'id',
                          selectedIdProperty:'id',
                          availableCfg:{
                              features: [
                                  {
                                      id: 'searchRole',
                                      ftype: 'search',
                                      disableIndexes : ['id'],
                                      searchMode : 'local'
                                  }]
                          },
                          availableViewCfg: {
                              getRowClass: function (record){
                                  if (record.get('organizationRole')){
                                      return 'blue-grid-row';
                                  }
                                  return '';
                              }
                          },
                          selectedCfg :{
                              selModel:{
                                  selType:'checkboxmodel',
                                  mode: 'SINGLE',
                                  allowDeselect:false,
                                  injectCheckbox:'first',
                                  listeners:{
                                      'selectionchange':function(rowModel,records,eOpts){
                                          me.onCheckedChange(records);
                                      }
                                  }
                              },
                              features: [
                                  {
                                      id: 'searchSelectedRole',
                                      ftype: 'search',
                                      disableIndexes : ['id'],
                                      searchMode : 'local'
                                  }]
                          },
                          selectedViewCfg: {
                              listeners:   {
                                  'refresh': function (view, eOpts){
                                      var selModel = view.ownerCt.getSelectionModel();
                                      var store = view.ownerCt.store;
                                      me.onGridViewRefresh(store, selModel);
                                  }
                              },
                              getRowClass: function (record){
                                  // return a custom css class based on the record or index
                                  if (record.get('name')){
                                      return 'blue-grid-row';
                                  }
                                  return '';
                              }
                          },
                          columns: [
                              {
                                  header: 'ID',
                                  hidden: true,
                                  sortable: false,
                                  dataIndex: 'id'
                              },{
                                  header: userRoleRes.header.roleName,
                                  width: 170,
                                  sortable: true,
                                  dataIndex: 'displayName'
                              },{
                                  header: userRoleRes.header.defaultContext,
                                  width: 170,
                                  sortable: true,
                                  dataIndex: 'context',
                                  renderer: function(v){
                                      if(v=='manager'){
                                          return userRoleRes.header.managerContext;
                                      }else if(v=='user'){
                                          return userRoleRes.header.userContext
                                      }
                                  }
                              }
                          ]
                      }
                  ]
              }
          ]
        }
      ]
    });

    this.addEvents('create');
    this.addEvents('update');

    this.callParent(arguments);
  },
    onGridViewRefresh : function(store,selModel) {
        var defaultRoleId = this.down('#defaultRoleId').getValue();

        if(defaultRoleId){
            var select =store.findBy(function(rec, id){
                return id == defaultRoleId;
            })
            if(select != -1){
                selModel.select(select);
            }
        }
    },
    onCheckedChange : function(records) {
        if(records&&records.length>0){
            this.down('#defaultRoleId').setValue(records[0].get('id'));
        }else{
            this.down('#defaultRoleId').setValue(null);
        }
    },

  getFormPanel: function () {
    return this.down('form');
  },

  setActiveRecord: function (record) {
    this.activeRecord = record;
    if (record) {
      this.setTitle(userRoleRes.editUser);
      this.down('#password').disable();
      this.down('#passwordAffirm').disable();
      this.down('#password').hide();
      this.down('#passwordAffirm').hide();
      this.getFormPanel().loadRecord(record);
    } else {
      this.setTitle(userRoleRes.addUser);
      this.down('#password').show();
      this.down('#passwordAffirm').show();
      if(this.down('#password').isDisabled())
        this.down('#password').enable();
        if(this.down('#passwordAffirm').isDisabled())
        this.down('#passwordAffirm').enable();
        
      this.getFormPanel().getForm().reset();
    }
  },

  onSave: function () {
      var me=this;
    var active = this.activeRecord,form = this.getFormPanel().getForm(),
      datas=form.getValues(),simpleRoles=datas.simpleRoles,roleids=[];
      Ext.each(simpleRoles,function(data){
          roleids.push(data.id);
      })
      if(roleids.length==0){
          Ext.MessageBox.alert(globalRes.title.prompt, userRoleRes.msg.addUserHasRole);
          return;
      }
      datas.roleIds= roleids.join(',');
    if (form.isValid()) {
      if (!active) {
        this.fireEvent('create', this, datas);
      }
      else {
        this.fireEvent('update', this, form, active,roleids);
      }
    }
  },

  onCancel: function () {
    this.close();
  }
})