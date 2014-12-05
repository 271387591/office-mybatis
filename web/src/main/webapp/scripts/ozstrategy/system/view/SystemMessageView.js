/**
 * Created by lihao on 12/1/14.
 */
Ext.define('FlexCenter.system.view.SystemMessageView',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.systemMessageView',
    requires: [
        'FlexCenter.system.store.SystemMessage',
        'Ext.ux.grid.feature.Detail'
    ],
    layout: 'fit',
    border: false,
    itemId:'systemMessageView',
    title:'系统消息',
    text:'系统消息',
    getStore: function () {
        var store = Ext.StoreManager.lookup('systemMessageStore');
        if (!store) {
            store = Ext.create('FlexCenter.system.store.SystemMessage', {
                storeId: 'systemMessageStore'
            });
        }
        store.load();
        return store;
    },
    initComponent: function () {
        var me = this;
        me.store = me.getStore();
        me.tbar = [{
            text:globalRes.buttons.remove,
            iconCls:'table-delete',
            scope:me,
            handler:me.onDeleteClick
        }
        ];
        me.selModel=Ext.create('Ext.selection.CheckboxModel');
        me.columns = [
            {xtype: 'rownumberer'},
            {
            header:systemRes.systemMessage.type,
            dataIndex:'type',
            flex:1,
            renderer:function(v){
                if(v=='WorkFlow'){
                    return systemRes.systemMessage.workflow;
                }else if(v=='Active'){
                    return flowFormRes.flowFormView.published;
                }
                return v;
            }
        },{
            header: globalRes.header.createDate,
            dataIndex: 'createDate',
            flex:1
        }];
        me.features=[{
            ftype: 'detail',
            detailHeight:150,
            tplDetail:systemMessageTpl
        }];

        me.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: me.getStore(),
            dock: 'bottom',
            displayInfo: true
        }];

        me.callParent();
    },
    onDeleteClick: function(){
        var me = this;
        var records = me.getSelectionModel().getSelection();
        if(records && records.length>0){
            var ids=[];
            for(var i=0;i<records.length;i++){
                ids.push(records[i].data.id);
            }
            Ext.Msg.confirm(globalRes.title.prompt,systemRes.systemMessage.delMsg,function(txt){
                if(txt==='yes'){
                    Ext.Ajax.request({
                        url: 'systemMessageController.do?method=multiRemove',
                        params: {ids:ids.join(',')},
                        method: 'POST',
                        success: function (response, options) {
                            var result = Ext.decode(response.responseText);
                            if(result.success){
                                Ext.Msg.alert(globalRes.title.prompt,globalRes.removeSuccess);
                                me.getStore().load();
                            }else{
                                Ext.MessageBox.show({
                                    title: globalRes.title.prompt,
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
    }
});