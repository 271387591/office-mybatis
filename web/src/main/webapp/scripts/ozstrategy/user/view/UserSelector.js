/**
 * Created by lihao on 9/19/14.
 */
Ext.define('FlexCenter.user.view.UserSelector', {
    extend: 'Ext.window.Window',
    alias: 'widget.userSelector',
    layout: 'fit',

    requires: [
        'FlexCenter.user.store.Users',
        'Ext.selection.CheckboxModel',
        'FlexCenter.user.store.RoleTree'
    ],
    initComponent: function () {
        var me = this;
        var availableUserStore = me.getAvailableUserStore();
        availableUserStore.load();
        var csm = Ext.create('Ext.selection.CheckboxModel', {
            mode: this.type ? this.type : 'MULTI'
        });
        Ext.apply(this, {
            border: false,
            title: '人员选择器',
            width: 560,
            modal: true,
            height: 350,
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    layout: 'border',
                    items: [
                        {
                            xtype: 'grid',
                            title: '人员列表',
                            store: availableUserStore,
                            height: 290,
                            region: 'center',
                            autoHeight: true,
                            selModel: csm,
                            features:[{
                                ftype: 'search',
                                disableIndexes : ['id','defaultRoleDisplayName','accountLocked','enabled','createDate'],
                                paramNames: {
                                    fields: 'fields',
                                    query: 'keyword'
                                },
                                searchMode : 'remote'
                            }],
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
        var store = Ext.create('FlexCenter.user.store.Users', {
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
                    e.params = {
                        processAssignee:me.processAssignee || ''
                    }; //ajax 附加参数
                }
            }
        });
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
    onSearchClick: function () {
        var me = this;
        var textField = me.down('textfield#searchKeyword');
        var store = me.down('grid').getStore();
        store.getProxy().extraParams = {keyword: textField.getValue()};
        store.loadPage(1);
    }
});