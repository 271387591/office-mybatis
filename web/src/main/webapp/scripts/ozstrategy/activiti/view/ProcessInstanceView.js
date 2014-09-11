/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 3:14 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessInstanceView',{
    requires:[
        'FlexCenter.activiti.store.ProcessInstance',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.activiti.view.DiagramWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processInstanceView',
    itemId:'processInstanceView',
    title:'运行中流程',
    layout:'border',
    autoScroll:true,
    getStore:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.ProcessInstance',{
            storeId:'ProcessInstanceViewStore'
        });
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;

        var store = me.getStore();
        var sm = Ext.create('Ext.selection.CheckboxModel');
        me.items=[
            {
                title: '流程分类',
                xtype: 'globalTypeTree',
                region: 'west',
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                margins: '1 2 1 1',
                catKey: 'Workflow',
                gridViewItemId:'processInstanceView'
            },
            {
                xtype:'grid',
                region:'center',
                margins: '1 1 1 0',
                selModel:sm,
                store:store,
                forceFit: true,
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
                        xtype: 'toolbar',
                        dock: 'top',
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
                            },'->',
                            {
                                xtype: 'textfield',
                                name: 'name',
                                labelWidth:60,
                                itemId:'processInstanceViewSearch',
                                fieldLabel: '流程名称'
                            },
                            {
                                xtype:'button',
                                text:'搜索',
                                iconCls:'search',
                                handler:function(){
                                    var value = Ext.ComponentQuery.query('#processInstanceViewSearch')[0].getValue();
                                    var grid=me.down('grid');
                                    grid.getStore().load({
                                        params:{
                                            name:value
                                        }
                                    });
                                }
                            },
                            {
                                xtype:'button',
                                text:'清空',
                                iconCls:'clear',
                                handler:function(){
                                    Ext.ComponentQuery.query('#processInstanceViewSearch')[0].setValue('');
                                }
                            }
                        ]
                    }
                ],
                columns:[
                    {
                        header: '流程名称',
                        dataIndex: 'name'
                    },
                    {
                        header: '发起人',
                        dataIndex: 'startUser'
                    },

                    {
                        header: '完成情况',
                        dataIndex: 'end',
                        renderer: function (v) {
                            if(v=='true'){
                                return "已完成"
                            }else {
                                return '进行中'
                            }
                        }
                    },
                    {
                        header: '状态',
                        dataIndex: 'suspended',
                        renderer: function (v) {
                            if(v){
                                return '<font color="red">挂起</font>'
                            }else {
                                return '正常'
                            }
                        }
                    },
                    {
                        header: '当前节点',
                        dataIndex: 'activityName'
                    },{
                        header: '启动时间',
                        dataIndex: 'startTime',
                        renderer:function(v){
                            if(v){
                                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                            }
                        }
                    },
                    {
                        xtype:'actioncolumn',
                        dataIndex: 'suspended',
                        header:'管理',
                        items:[
                            {
                                getClass: function(v, meta, record) {
                                    if(record.get('suspended')){
                                        return 'btn-active';
                                    }
                                    return 'btn-suspended';
                                },
                                scope:this,
//                                    tooltip:'激活',
                                getTip:function(v,metadata,record,rowIndex,colIndex,store){
                                    if(record.get('suspended')){
                                        return '激活';
                                    }
                                    return '挂起';
                                },
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.request('processesController/suspendedProcessInstance',{instanceId:rec.get('id'),suspended:rec.get('suspended')});
                                }

                            },'-','-','-','-','-','-','-','-','-','-','-','-',
                            {
                                iconCls:'btn-preview',
                                tooltip:'查看流程图',
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    Ext.widget('diagramWindow',{
                                        diagramHtml:'processesController/readTraceResource?executionId='+rec.get('executionId')+'&definitionId='+rec.get('definitionId')
                                    }).show();
                                }
                            }

                        ]

                    }
                ]

            }
        ];
        this.callParent();
    },
    request:function(url,data,callback){
        var me=this;
        Ext.Ajax.request({
            url:url,
            params:data,
            method: 'POST',
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    if(!callback){
                        me.down('grid').getStore().load();
                    } else{
                        callback();
                    }
                }else{
                    Ext.MessageBox.alert({
                        title:'警告',
                        icon: Ext.MessageBox.ERROR,
                        msg:result.message,
                        buttons:Ext.MessageBox.OK
                    });
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        })

    }

});
