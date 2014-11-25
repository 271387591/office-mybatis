/**
 * Created with IntelliJ IDEA.
 * User: wangym
 * Date: 2/1/13
 * Time: 9:56 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.RoleForm',{
  extend:'Ext.Window',
  alias: 'widget.roleForm',

  requires: [
    'Ext.ux.utils.Utils',
    'Ext.ux.form.MultiSelect',
      'FlexCenter.user.store.SystemView',
    'FlexCenter.user.store.AllFeatures'

  ],
  crudType:'save',
    layout: 'fit',
    autoShow: true,
    modal: true,
    width: 600,
    autoHeight: true,
    border:false,
    minWidth: 600,
    getSystemViewStore:function (){
        var systemViewStore = Ext.StoreManager.lookup('systemViewStore');
        if (!systemViewStore) {
            systemViewStore = Ext.create('FlexCenter.user.store.SystemView', {
                storeId: 'systemViewStore'
            });
        }
        return systemViewStore;
    } ,
  initComponent: function(){
    var me = this;
      Ext.apply(this,{
          layout: 'fit',
          autoShow: true,
          modal: true,
          width: 800,
          autoHeight: true,
          border:false,
          minWidth: 600,
          items:[
              {
                  xtype: 'form',
                  frame:true,
                  bodyPadding: 5,
                  layout: 'anchor',
                  defaults: {
                      anchor: '100%'
                  },
                  buttons:[{
                      text: globalRes.buttons.save,
                      formBind: true,
                      scope:me,
                      handler:me.onSubmitClick
                  },{
                      text: globalRes.buttons.cancel,
                      handler: function(){
                          me.close();
                      }
                  }],
                  items:[
                      {
                          xtype: 'fieldset',
                          title: userRoleRes.header.roleInfo,
                          defaultType: 'textfield',
                          layout: 'anchor',
                          defaults: {
                              anchor: '100%'
                          },
                          items:[{
                              name:'id',
                              hidden:true
                          },{
                              name: 'name',
                              fieldLabel: '<font color="red">*</font>'+userRoleRes.header.roleName,
                              allowBlank: false,
                              readOnly:me.isEdit,
                              readOnlyCls:'x-item-disabled',
                              validator:function(v){
                                  if(v && v.length>32){
                                      return globalRes.textLengthTooLong;
                                  }
                                  return true;
                              }
                          },{
                              name: 'displayName',
                              fieldLabel: '<font color="red">*</font>'+userRoleRes.header.displayName,
                              allowBlank: false,
                              validator:function(v){
                                  if(v && v.length>64){
                                      return globalRes.textLengthTooLong;
                                  }
                                  return true;
                              }
                          },{
                              fieldLabel: '<font color="red">*</font>'+userRoleRes.header.defaultContext,
                              name: 'systemViewId',
                              xtype: 'combo',
                              allowBlank: false,
                              itemId: 'typeId',
                              mode: 'local',
                              editable: false,
                              triggerAction: 'all',
                              valueField : 'id',
                              displayField : 'name',
                              store: me.getSystemViewStore()
                          },{
                              name: 'description',
                              fieldLabel: '&nbsp;&nbsp;'+userRoleRes.header.description
                          }]
                      },
                      {
                          xtype: 'fieldset',
                          title: userRoleRes.selectFeature,
                          checkboxToggle: false,
                          height: 250,
                          autoHeight: true,
                          defaults: {               // defaults are applied to items, not the container
                              anchor: '100%'
                          },
                          items: [
                              {
                                  xtype: 'multiselect',
                                  border: false,
                                  name: 'simpleFeatures',
                                  itemId: 'features',
                                  hideLabel: true,
                                  filterMode: 'local',
                                  allowBlank: false,
                                  store: me.availableFeatureStore,
                                  availableTitle:userRoleRes.availableFeatures,
                                  selectedTitle :userRoleRes.assignedFeatures,
                                  availableIdProperty:'id',
                                  selectedIdProperty:'id',
                                  availableCfg:{
                                      features: [
                                          {
                                              id: 'searchFeature',
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
                                      features: [
                                          {
                                              id: 'searchSelectedFeature',
                                              ftype: 'search',
                                              disableIndexes : ['id'],
                                              searchMode : 'local'
                                          }]
                                  },
                                  selectedViewCfg: {
                                      listeners:   {
                                          'refresh': function (view, eOpts){
                                          }
                                      },
                                      getRowClass: function (record){
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
                                          header: userRoleRes.header.featureName,
                                          width: 170,
                                          sortable: true,
                                          dataIndex: 'displayName'
                                      },{
                                          header: userRoleRes.header.featureCriteria,
                                          width: 170,
                                          sortable: true,
                                          dataIndex: 'criteria'
                                          //renderer: function(v){
                                          //    if(v=='user'){
                                          //        return userRoleRes.userCriteria;
                                          //    }else if(v=='system'){
                                          //        return userRoleRes.systemCriteria;
                                          //    }else if(v=='forms'){
                                          //        return userRoleRes.formsCriteria;
                                          //    }else if(v=='flows'){
                                          //        return userRoleRes.flowsCriteria;
                                          //    }
                                          //}
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
      me.callParent(arguments);
  },

  onSubmitClick: function(){
    var me = this;
    var form = me.down('form').getForm();
    var values = form.getValues();
      var featureIds=[];
      var simpleFeatures=values.simpleFeatures;
      Ext.each(simpleFeatures,function(data){
          featureIds.push(data.id);
      });
      values.featureIds=featureIds.join(",");
      if (form.isValid()) {
          if (!this.activeRecord) {
              this.fireEvent('create', this, values);
          }
          else {
              this.fireEvent('update', this, values);
          }
      }

  },

  getFormPanel: function(){
    var me = this;
    return me.down('form').getForm();
  },

  setActiveRecord: function(record){
    this.activeRecord = record;
    if (record) {
        this.setTitle(userRoleRes.editRole);
      this.getFormPanel().loadRecord(record);
    } else {
        this.setTitle(userRoleRes.addRole);
      this.getFormPanel().reset();
    }
  }
});