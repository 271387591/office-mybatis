/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.flows.view.ProcessDefinitionView',{
    requires:[
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.flows.store.ProcessDefinition',
        'FlexCenter.flows.view.ModelerPreviewWindow',
        'FlexCenter.flows.view.NewProcessDefinition'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processDefinitionView',
    itemId:'processDefinitionView',
    text:workFlowRes.processDefinitionView.title,
    title:workFlowRes.processDefinitionView.title,
    layout:'border',
    role:null,
//    border:false,
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.flows.store.ProcessDefinition',{
            storeId:'processDefinitionViewStore'
        });
        store.load();
        return store;
    },
//    margin: 1,
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel',{
            mode:'SINGLE'
        });
        var actioncolumn=[
            {
                iconCls:'btn-newFlow',
                tooltip:workFlowRes.processDefinitionView.newProcess,
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    var itemId= 'processRunStartView_'+rec.get('id');
                    var formHtml=rec.get('formHtml');
                    var config={
                        formHtml:formHtml,
                        title:(workFlowRes.newProcessDefinition.start+'-'+rec.get('name')),
                        record:rec,
                        closable:true,
                        itemId:itemId
                    };
                    var centerTabPanel = Ext.ComponentQuery.query('#centerPanel')[0];
                    centerTabPanel.addPanel('newProcessDefinition', itemId, config);
                }
            }
        ];
        me.items=[
            {
                title: workFlowRes.modeler.processCategory,
                xtype: 'globalTypeTree',
                region: 'west',
                autoScroll:true,
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 280,
                catKey: 'Workflow',
                gridViewItemId:me.itemId
            },
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                store:store,
                border:true,
                autoScroll: true,
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    },
                    {
                        xtype:'toolbar',
                        dock:'top',
                        items:[
                            {
                                xtype:'button',
                                frame:true,
                                text:globalRes.buttons.refresh,
                                iconCls:'refresh',
                                scope:this,
                                handler:function(){
                                    me.down('grid').getStore().load();
                                }
                            },{
                                xtype:'button',
                                frame:true,
                                text:workFlowRes.readdocument,
                                iconCls:'btn-readdocument',
                                scope:this,
                                handler:function(){
                                    me.preview();
                                }
                            }
                        ]
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','documentation','category','deployDate','suspended','version'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
                columns:[
                    {
                        header: workFlowRes.applyProcessHistoryView.searchProcessName,
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: workFlowRes.modeler.processCategory,
                        flex:1,
                        dataIndex: 'category',
                        renderer:function(v){
                            if(!v){
                                return workFlowRes.processDefinitionView.allThe;
                            }
                            return v;
                        }
                    },
                    {
                        header: userRoleRes.header.description,
                        flex:1,
                        dataIndex: 'documentation'
                    },
                    {
                        header: workFlowRes.processDefinitionView.version,
                        flex:1,
                        dataIndex: 'version'
                    },
                    {
                        header: workFlowRes.applyProcessHistoryView.headerStatus,
                        flex:1,
                        dataIndex: 'suspended',
                        renderer: function (v) {
                            if(v=='true'){
                                return workFlowRes.processDefinitionView.suspended
                            }else {
                                return workFlowRes.processDefinitionView.notSuspended
                            }
                        }
                    },
                    {
                        header: workFlowRes.processDefinitionView.deployDate,
                        flex:1,
                        dataIndex: 'deployDate'
                    },
                    {
                        xtype:'actioncolumn',
                        flex:1,
                        header:globalRes.buttons.managerBtn,
                        items:actioncolumn
                    }
                ]

            }
        ];
        this.callParent();
    },
    preview:function(){
        var me=this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.show({
                title: workFlowRes.readdocument,
                width: 300,
                msg: workFlowRes.processDefinitionView.readdocumentAlert,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        ajaxPostRequest('processDefController.do?method=getRes',{id:record.get('id')},function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerPreviewWindow',{
                    graRes:graRes,
                    animateTarget:me.getEl()
                });
                moder.show();
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
