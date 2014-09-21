/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 12/7/13
 * Time: 2:24 PM
 * type:'SINGLE, SIMPLE, and MULTI'
 * resultBack: function(ids,names){console.log(ids,names)} ids is selected role‘s primary key join with comma, names is selected role's displayName join with comma
 * examples:
 Ext.widget('roleSelector',{
              type:'SINGLE',
              resultBack: function(ids,names){
                 console.log(ids,names);
              }
            }).show();
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.RoleSelector2', {
  extend: 'Ext.window.Window',
  alias: 'widget.roleSelector2',
  layout: 'fit',

  requires: [
    'FlexCenter.user.store.Roles',
    'Ext.selection.CheckboxModel'
  ],
  initComponent: function () {
    var me = this;
    var roleStore = me.getAvailableRoleStore();
    roleStore.load({
      params: {
        roleName: ''
      }
    });
    var csm = Ext.create('Ext.selection.CheckboxModel', {
      mode: this.type ? this.type : 'MULTI'
    });
    Ext.apply(this, {
      border: false,
      title: '角色选择器',
      iconCls: 'user-icon',
      width: 560,
      modal: true,
      height: 350,
      items: [
        {
          xtype: 'grid',
//          title: '角色列表',
          store: roleStore,
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
              header: '角色名',
              dataIndex: 'displayName',
              flex: 1
            },
            {
              header: '描述',
              dataIndex: 'description',
              flex: 1
            }
          ],
          dockedItems: [
            {
              xtype: 'pagingtoolbar',
              store: roleStore,
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
    });
    this.callParent(arguments);
  },
  getAvailableRoleStore: function () {
    var store = Ext.StoreManager.lookup('availableRoleStore');
    if (!store) {
      store = Ext.create('FlexCenter.user.store.Roles', {
        storeId: 'availableRoleStore'
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
      Ext.Array.each(records, function (record, index, recordsItSelf) {
        selectedId.push(record.data.id);
        selectedValue.push(record.data.displayName);
      });
      if (me.resultBack) {
        me.resultBack(selectedId.join(','), selectedValue.join(','));
        me.close();
      }
    } else {
      Ext.MessageBox.show({
        title: '提示消息',
        width: 200,
        msg: '对不起，请选择角色',
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
      });
    }
  },
  onSearchClick: function () {
    var me = this;
    var textField = me.down('textfield#searchKeyword');
    var store = me.getAvailableRoleStore();
    store.getProxy().extraParams = {roleName: textField.getValue()};
    store.loadPage(1);
  }
});