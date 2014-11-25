/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.flows.view.ProcessListView', {
    requires: [
        'FlexCenter.flows.view.ProcessListForm',
        'FlexCenter.flows.store.ProcessDef',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.flows.view.ModelerWindow',
        'FlexCenter.flows.view.ModelerPreviewWindow',
        'FlexCenter.flows.view.ProcessDefAuthorityWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.processListView',
    itemId: 'processListView',
    title: workFlowRes.processDefinitionView.title,
    autoScroll: true,
    layout:'border',
    margin:1,
    getStore:function(){
        var store=Ext.StoreManager.lookup("processListViewStore");
        if(!store){
            store=Ext.create("FlexCenter.flows.store.ProcessDef",{
                storeId:'processListViewStore'
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
        var actioncolumn=[{
            iconCls:'btn-preview',
            tooltip:workFlowRes.readdocument,
            handler:function(grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex);
                me.preViewFlow(rec);
            }
        }];
        
        if(globalRes.isAdmin || accessRes.updateProcess){
            actioncolumn.push('-');
            actioncolumn.push({
                tooltip:workFlowRes.processListView.design,
                iconCls:'btn-flow-design',
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    me.onUpdateClick(rec);
                }
            });
        }
        if(globalRes.isAdmin || accessRes.deployProcess){
            actioncolumn.push('-');
            actioncolumn.push({
                iconCls:'deploy',
                tooltip:workFlowRes.flowDeploymentBtn,
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    var actDefId=rec.get('actDefId');
                    ajaxPostRequest('processDefController.do?method=checkProcessRunning',{actDefId:actDefId},function(result){
                        if(result.success){
                            Ext.Msg.alert(globalRes.title.prompt,workFlowRes.processListView.checkProcessRunning);
                        }else{
                            Ext.Msg.confirm(workFlowRes.flowDeploymentBtn,Ext.String.format(workFlowRes.processListView.depProcess,rec.get('name')),function(txt){
                                if(txt==='yes'){
                                    me.deployed(rec);
                                }
                            });
                        }
                    });
                }
            });
        }
        me.items=[
            {
                title: workFlowRes.modeler.processCategory,
                xtype: 'globalTypeTree',
                region: 'west',
                autoScroll:true,
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                catKey: 'Workflow',
                gridViewItemId:'processListView'
            },
            {
                xtype:'grid',
                region:'center',
                selModel:sm,
                itemId:'processListViewGrid',
                store:store,
                autoScroll: true,
                plugins:Ext.create('Oz.access.RoleAccess', {featureName:'updateProcess',mode:'hide',byPass:globalRes.isAdmin}),
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.processDefinitionView.newProcess,
                        iconCls:'table-add',
                        scope:this,
                        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'addProcess',mode:'hide',byPass:globalRes.isAdmin}),
                        handler:me.onAddClick
                    },
                    {
                        xtype: 'button',
                        frame: true,
                        text: globalRes.buttons.remove,
                        iconCls: 'table-add',
                        scope: this,
                        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'deleteProcess',mode:'hide',byPass:globalRes.isAdmin}),
                        handler: function(){
                            me.onUpdateClick();
                        }
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.processListView.authorization,
                        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'authorizationProcess',mode:'hide',byPass:globalRes.isAdmin}),
                        iconCls:'btn-authorization',
                        scope:me,
                        handler:me.authorization
                    },
                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.processListView.disAuthorization,
                        plugins: Ext.create('Oz.access.RoleAccess', {featureName:'disAuthorizationProcess',mode:'hide',byPass:globalRes.isAdmin}),
                        iconCls:'btn-dis-authorization',
                        scope:me,
                        handler:me.disAuthorizationProcess
                    }
                ],
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','documentation','flowFormName','createDate','actDefId','version'],
                    paramNames: {
                        fields: 'fields',
                        query: 'keyword'
                    },
                    searchMode : 'remote'
                }],
                dockedItems:[
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                columns:[
//                    {
//                        xtype:'rownumber'
//                    },
                    {
                        header: workFlowRes.header.flowName,
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
                        header: workFlowRes.processListView.flowFormName,
                        flex:1,
                        dataIndex: 'flowFormName'
                    },
                    {
                        header: userRoleRes.header.description,
                        flex:1,
                        dataIndex: 'documentation'
                    },
                    {
                        header: globalRes.header.createDate,
                        flex:1,
                        dataIndex: 'createDate'
                    },
                    {
                        header: workFlowRes.header.deployment,
                        flex:1,
                        dataIndex: 'actDefId',
                        renderer: function (v,m,rec) {
                            if(v){
                                return '<font color="red">'+workFlowRes.hasDeployment+'</font>'
                            }
                            return workFlowRes.hasNotDeployment;
                        }
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
                        items:actioncolumn
                    }
                ],
                listeners:{
                    itemdblclick:function(grid, record, item, index, e, eOpts){
                        me.onUpdateClick(record)
                    }

                }
            }
        ];
        me.callParent(arguments);
    },
    authorization:function(){
        var me=this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.show({
                title: workFlowRes.processListView.authorizationTitle,
                width: 300,
                msg: workFlowRes.processListView.authorizationMsg,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var win=Ext.widget('processDefAuthorityWindow',{
            animateTarget:me.getEl(),
            rec:record
        });
        win.show();
        me.mon(win, 'authorization', function (win, data) {
            ajaxPostRequest('processDefController.do?method=authorization',data,function(result){
                if(result.success){
                    me.down('grid').getStore().load();
                    me.down('grid').getSelectionModel().deselectAll();
                    win.close();
                }else{
                    Ext.MessageBox.alert({
                        title:globalRes.title.warning,
                        icon: Ext.MessageBox.ERROR,
                        msg:result.message,
                        buttons:Ext.MessageBox.OK
                    });
                }
            });
        });
    },
    disAuthorizationProcess:function(){
        var me=this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.show({
                title: workFlowRes.processListView.disAuthorization,
                width: 300,
                msg: workFlowRes.processListView.disAuthorizationProcessMsg,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        Ext.Msg.confirm(workFlowRes.processListView.disAuthorization,Ext.String.format(workFlowRes.processListView.disAuthorizationProcessAlert,rec.get('name')),function(txt){
            if(txt==='yes'){
                ajaxPostRequest('processDefController.do?method=disAuthorization',{id:rec.get('id')},function(result){
                    if(result.success){
                        store.load();
                    }else{
                        Ext.MessageBox.alert({
                            title:globalRes.title.prompt,
                            icon: Ext.MessageBox.ERROR,
                            msg:result.message,
                            buttons:Ext.MessageBox.OK
                        });
                    }
                });
            }
        });
        
    },
    
    deployed:function(rec){
        var me=this;
        ajaxPostRequest('processDefController.do?method=deploy',{id:rec.get('id')},function(result){
            var msg;
            if(result.success){
                msg=workFlowRes.processListView.depSuc;
            }
            me.down('grid').getStore().load();
            me.down('grid').getSelectionModel().deselectAll();
            Ext.MessageBox.alert({
                title:globalRes.title.prompt,
                icon: Ext.MessageBox.INFO,
                msg:msg?msg:result.message,
                buttons:Ext.MessageBox.OK
            });
        });
    },
    
    preViewFlow:function(rec){
        var me=this;
        ajaxPostRequest('processDefController.do?method=getRes',{id:rec.get('id')},function(result){
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
    },
    onAddClick:function(){
        var me = this;
        var win = Ext.widget('processListForm',{
//            animateTarget:me.getEl()
        });
        win.show();
        me.mon(win, 'addFlow', function (win, data) {
            me.saveOrUpdate(data,true,win);
        });
    } ,
    onDeleteClick:function(){
        var me = this;
        var grid = me.down('grid');
        var selection = grid.getSelectionModel().getSelection();
        if(selection.length<1){
            Ext.MessageBox.show({
                title: globalRes.buttons.remove,
                width: 300,
                msg: workFlowRes.changeDeleteFlow,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        var rec=selection[0];
        ajaxPostRequest('processDefController.do?method=delete',{id:rec.get('id')},function(result){
            if(result.success){
                me.down('grid').getStore().load();
            }else{
                Ext.MessageBox.alert({
                    title:globalRes.title.warning,
                    icon: Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            }
        });
    },
    onUpdateClick:function(rec){
        var me=this;
        if(!rec){
            Ext.MessageBox.show({
                title: userRoleRes.editUser,
                width: 300,
                msg: userRoleRes.msg.editUser,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }
        ajaxPostRequest('processDefController.do?method=getRes',{id:rec.get('id')},function(result){
            if(result.success){
                var data=result.data,actRes,graRes;
                if(data){
                    graRes=data.graRes;
                }
                var moder = Ext.widget('modelerWindow',{
                    processRecord:rec.data,
                    developer:false,
                    graRes:graRes,
                    animateTarget:me.getEl()
                });
                var modeler = moder.down('modeler');
                me.mon(modeler, 'updateFlow', function (data) {
                    me.saveOrUpdate(data,false,moder);
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
    },
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='processDefController.do?method='+(save?'save':'update');
        ajaxPostRequest(url,data,function(result){
            if(result.success){
                me.down('grid').getStore().load();
                win.close();
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
