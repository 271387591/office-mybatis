/**
 * Created by lihao on 9/28/14.
 */
Ext.define('FlexCenter.flows.view.ProcessDefInstanceDraftView', {
    requires: [
        'FlexCenter.flows.store.ProcessDefInstanceDraft'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processDefInstanceDraftView',
    itemId: 'processDefInstanceDraftView',
    title: workFlowRes.processDefInstanceDraftView.title,
    text: workFlowRes.processDefInstanceDraftView.title,
    autoScroll: true,
    layout:'border',
//    margin:1,
//    closable:true,
    getStore:function(){
        var store=Ext.StoreManager.lookup("processDefInstanceDraftViewStore");
        if(!store){
            store=Ext.create("FlexCenter.flows.store.ProcessDefInstanceDraft",{
                storeId:'processDefInstanceDraftViewStore'
            });
        }
        store.load();
        return store;
    },
    initComponent: function () {
        var me = this;
        var store=me.getStore(),sm=Ext.create('Ext.selection.CheckboxModel',{
            mode:'SINGLE'
        });
        me.items=[
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                itemId:'processDefInstanceDraftViewGrid',
                store:store,
                autoScroll: true,
                border:false,
                tbar:[
                    {
                        xtype: 'button',
                        frame: true,
                        text: globalRes.buttons.remove,
                        iconCls: 'table-delete',
                        scope: this,
                        handler: function(){
                            me.onDeleteClick();
                        }
                    }
                ],
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','description','createDate','version'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
                columns:[
                    {
                        header: workFlowRes.processDefInstanceDraftView.name,
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: workFlowRes.header.flowName,
                        flex:1,
                        dataIndex: 'processDefName'
                    },
                    {
                        header: workFlowRes.modeler.processDocumentation,
                        flex:1,
                        dataIndex: 'description'
                    },
                    {
                        header: globalRes.header.createDate,
                        flex:1,
                        dataIndex: 'createDate'
                    },
                    {
                        header: workFlowRes.processDefinitionView.version,
                        flex:1,
                        dataIndex: 'version'
                    },
                    {
                        xtype:'actioncolumn',
                        header:globalRes.buttons.managerBtn,
                        flex:1,
                        items:[
                            {
                                iconCls:'btn-flow-design',
                                tooltip:workFlowRes.newProcessDefinition.start,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    },
    
    onDeleteClick:function(){
        var me = this;
        var grid = me.down('grid');
        var selection = grid.getSelectionModel().getSelection();
        if(selection.length<1){
            Ext.MessageBox.show({
                title: workFlowRes.processDefInstanceDraftView.deleteDraft,
                width: 300,
                msg: workFlowRes.processDefInstanceDraftView.deleteDraftMsg,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        ajaxPostRequest('processDefController.do?method=getRes',{id:selection[0].get('id')},function(result){
            if(result.success){
                grid.getStore().load();
            }else{
                Ext.MessageBox.alert({
                    title:globalRes.title.warning,
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    }
});