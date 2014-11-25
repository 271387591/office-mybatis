/**
 * Created by lihao on 9/19/14.
 */
Ext.define('FlexCenter.user.view.RoleSelector', {
    extend: 'Ext.window.Window',
    alias: 'widget.roleSelector',
    layout: 'fit',

    requires: [
        'FlexCenter.user.store.Roles',
        'Ext.selection.CheckboxModel'
    ],
    initComponent: function () {
        var me = this;
        var roleStore = me.getAvailableRoleStore();
        roleStore.load();
        var csm = Ext.create('Ext.selection.CheckboxModel', {
            mode: this.type ? this.type : 'MULTI'
        });
        Ext.apply(this, {
            border: false,
            title: '角色选择器',
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
                    features:[{
                        ftype: 'search',
                        disableIndexes : ['id','description','createDate'],
                        paramNames: {
                            fields: 'fields',
                            query: 'keyword'
                        },
                        searchMode : 'remote'
                    }],
                    
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
            var userIds=[];
            var userNames=[];
            var userFullNames=[];
            Ext.Array.each(records, function (record, index, recordsItSelf) {
                selectedId.push(record.data.id);
                selectedValue.push(record.data.displayName);
                var users=record.data.users;
                for(var i=0;i<users.length;i++){
                    userIds.push(users[i].id);
                    userNames.push(users[i].username);
                    userFullNames.push(users[i].fullName);
                }
            });
            if (me.resultBack) {
                me.resultBack(selectedId.join(','), selectedValue.join(','),userIds.join(','),userNames.join(','),userFullNames.join(','));
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
        store.getProxy().extraParams = {keyword: textField.getValue()};
        store.loadPage(1);
    }
});