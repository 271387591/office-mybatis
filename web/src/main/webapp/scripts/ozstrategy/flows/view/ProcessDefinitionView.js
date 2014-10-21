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
    text:'流程列表',
    title:'流程列表',
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
                tooltip:'新建流程',
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    var itemId= 'processRunStartView_'+rec.get('id');
                    var formHtml=rec.get('formHtml');
                    var config={
                        formHtml:formHtml,
                        text:'启动流程-'+rec.get('name'),
                        record:rec,
                        itemId:itemId
                    };
                    var apptabs = Ext.ComponentQuery.query('#apptabs')[0];
                    apptabs.addTab('newProcessDefinition',itemId,'#processDefinitionView',config);
                }
            }
        ];
        me.items=[
            {
                title: '流程分类',
                xtype: 'globalTypeTree',
                region: 'west',
                autoScroll:true,
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                catKey: 'Workflow',
                gridViewItemId:'processDefinitionView'
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
                                text:'刷新',
                                iconCls:'refresh',
                                scope:this,
                                handler:function(){
                                    me.down('grid').getStore().load();
                                }
                            },{
                                xtype:'button',
                                frame:true,
                                text:'查看流程图',
                                iconCls:'btn-readdocument',
                                scope:this,
                                handler:function(){
                                    me.preview();
                                }
                            },
                            '->',
                            {
                                xtype : 'textfield',
                                labelWidth:60,
                                itemId:'processDefinitionView_search',
                                name : 'name'
                            },
                            {
                                xtype : 'button',
                                text : '查询',
                                iconCls : 'search',
                                handler : function() {
                                    var data = me.down('#processDefinitionView_search').getValue();
                                    me.down('grid').getStore().load({
                                        params:{
                                            keyword:data
                                        }
                                    });
                                }
                            },
                            {
                                xtype : 'button',
                                text : '清空',
                                margins:'0 0 0 5',
                                iconCls : 'clear',
                                handler : function() {
                                    me.down('#processDefinitionView_search').setValue('');
                                    me.down('grid').getStore().load();
                                }
                            }

                        ]
                    }
                ],
                columns:[
                    {
                        header: '流程名称',
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: '流程分类',
                        flex:1,
                        dataIndex: 'category',
                        renderer:function(v){
                            if(!v){
                                return '所有';
                            }
                            return v;
                        }
                    },
                    {
                        header: '描述',
                        flex:1,
                        dataIndex: 'documentation'
                    },
                    {
                        header: '版本号',
                        flex:1,
                        dataIndex: 'version'
                    },
                    {
                        header: '状态',
                        flex:1,
                        dataIndex: 'suspended',
                        renderer: function (v) {
                            if(v=='true'){
                                return "挂起"
                            }else {
                                return '正常'
                            }
                        }
                    },
                    {
                        header: '部署时间',
                        flex:1,
                        dataIndex: 'deployDate'
                    },
                    {
                        xtype:'actioncolumn',
                        flex:1,
                        header:'管理',
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
                title: '查看流程图',
                width: 300,
                msg: '请选择要查看的流程。',
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
                    title:'警告',
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    }
});
