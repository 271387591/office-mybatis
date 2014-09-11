/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 8/28/13
 * Time: 10:58 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelView',{
    requires:[
        'Ext.ux.form.SearchField',
//        'FlexCenter.activiti.view.AModelForm',
        'FlexCenter.system.view.GlobalTypeTree',
        'FlexCenter.user.view.RoleSelector',
        'FlexCenter.user.view.UserSelector',
        'FlexCenter.activiti.view.AModelPreviewView',
        'FlexCenter.activiti.view.AModelSettingView',
        'FlexCenter.activiti.view.ProHistoryVersionView',
        
//        'FlexCenter.activiti.view.MxGraphWindow'

    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.aModelView',
    itemId:'aModelView',
    layout:'border',
    smit:true,
    autoScroll:true,
    getStore:function(){
        var store=Ext.StoreManager.lookup("amodelStore");
        if(!store){
            store=Ext.create("FlexCenter.activiti.store.AModel",{
                storeId:'amodelStore'
            });
        }
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
//        autoScroll:true,
                frame: false,
                collapsible: true,
                layout: 'fit',
                width: 200,
                margins: '1 2 1 1',
                catKey: 'Workflow',
                gridViewItemId:'aModelView'
            },
            {
                xtype:'grid',
                region:'center',
                margins: '1 1 1 0',
//                selModel:sm,
                store:store,
                forceFit: true,
                border:true,
                autoScroll: true,
                itemId:'aModelViewGrid',
                tbar:[

                    {
                        xtype:'button',
                        frame:true,
                        text:workFlowRes.addNewFlow,
                        iconCls:'add',
                        scope:this,
                        handler:me.onAddClick
                    },
//                    '-',
//                    {
//                        xtype:'button',
//                        frame:true,
//                        text:'发布mxGraph脚本',
//                        iconCls:'add',
//                        scope:this,
//                        handler:me.mxGraph
//                    },
//                    '-',
                    {
                        xtype:'button',
                        frame:true,
                        text:globalRes.buttons.refresh,
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
                        itemId:'aModelViewSearch',
                        fieldLabel: workFlowRes.header.flowName
                    },
                    {
                        xtype:'button',
                        text:globalRes.buttons.search,
                        iconCls:'search',
                        handler:function(){
                            var value = Ext.ComponentQuery.query('#aModelViewSearch')[0].getValue();
                            var grid=me.down('grid');
                            grid.getStore().load({
                                params:{
                                    keyword:value
                                }
                            });
                        }
                    },
                    {
                        xtype:'button',
                        text:globalRes.buttons.clear,
                        iconCls:'clear',
                        handler:function(){
                            Ext.ComponentQuery.query('#aModelViewSearch')[0].setValue('');
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
                columns:[

                    {
                        header: workFlowRes.header.flowName,
                        dataIndex: 'name'
                    },
                    {
                        header:globalRes.header.createDate,
                        dataIndex:'createDate',
                        renderer: function (v) {
                            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        header: workFlowRes.header.deployment,
                        dataIndex: 'deploymentId',
                        renderer: function (v) {
                            if(v){
                                return '<font color="red">'+workFlowRes.hasDeployment+'</font>';
                            }else{
                                return workFlowRes.hasNotDeployment;
                            }
                        }
                    },
                    {
                        xtype:'actioncolumn',
                        header:globalRes.buttons.managerBtn,
                        items:[
                            {
                                iconCls:'delete',
                                tooltip:workFlowRes.deleteFlow,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    selects.push(rec);
                                    me.deleteClick(selects)
                                }
                            },'&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'btn-flow-design',
                                tooltip:workFlowRes.onlineUpdate,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.onUpdateClick(rec);
                                }
                            },'&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'setting',
                                tooltip:workFlowRes.settingFlow,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var title=rec.get('name');
                                    var itemId='aModelSettingView_'+rec.get('id');
                                    me.addTab('aModelSettingView',itemId,workFlowRes.settingFlow+'-'+title,rec);
                                }
                            },'&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'btn-shared',
                                tooltip:workFlowRes.settingFlowRole,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if(!rec.get('deploymentId')){
                                        Ext.MessageBox.alert({
                                            title:workFlowRes.lookHistory,
                                            icon: Ext.MessageBox.INFO,
                                            msg:workFlowRes.flowNotDeployment,
                                            buttons:Ext.MessageBox.OK
                                        });
                                        return;
                                    }
                                    me.flowAuthority(rec);
//                                    var title=rec.get('name');
//                                    var itemId='aModelSettingView_'+rec.get('id');
//                                    me.addTab('aModelSettingView',itemId,'流程设置-'+title,rec);
                                }
                            }, '&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'btn-preview',
                                tooltip:globalRes.buttons.lookFor,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    var modelId=rec.get('id'),depId=rec.get('deploymentId');
                                    var title=rec.get('name');
                                    Ext.Ajax.request({
                                        url:'modelController/aModelPreviewView',
                                        params:{modelId:modelId,depId:depId},
                                        method: 'POST',
                                        scope:me,
                                        success: function (response, options){
                                            var result=Ext.decode(response.responseText);
                                            if(result.success){
                                                var panel = Ext.widget('aModelPreviewView',{
                                                    record:result.data
                                                });
                                                me.showInWin(workFlowRes.flowDetails+'-'+title,panel);
                                            }
                                        },
                                        failure: function (response, options) {
                                            Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                                        }
                                    });

                                }
                            },'&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'btn-deploy',
                                tooltip:workFlowRes.flowDeploymentBtn,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    me.deploy(rec);
                                }
                            },'&emsp;','&emsp;','&emsp;','&emsp;','&emsp;','&emsp;',
                            {
                                iconCls:'history-version',
                                tooltip:workFlowRes.lookHistory,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if(!rec.get('deploymentId')){
                                        Ext.MessageBox.alert({
                                            title:workFlowRes.lookHistory,
                                            icon: Ext.MessageBox.INFO,
                                            msg:workFlowRes.flowNotDeployment,
                                            buttons:Ext.MessageBox.OK
                                        });
                                        return;
                                    }
                                    var title=rec.get('name');
                                    var itemId='proHistoryVersionView'+rec.get('id');
                                    me.addTab('proHistoryVersionView',itemId,'['+title+']'+workFlowRes.flowHistory,rec);
                                }
                            }
                        ]
                    }
                ],
                listeners:{
                    itemdblclick:function(grid, record, item, index, e, eOpts){
                        me.onUpdateClick(record)
                    }

                }
            }
        ];
        this.callParent();
    },
    onAddClick:function(){
        var me=this;
        var cmp = Ext.create('Ext.Component', {
          itemId: 'addedDiv',
          html:'<div id="mainView">' +
                '<div id="sideBar"></div>' +
                '<div id="graph" style="height: 100%;"></div>' +
                '<div id="task1"></div>' +
                '<div id="task2"></div>' +
                '</div>'
//        renderTo: me
            });
      me.add(cmp);
          var win = Ext.create('FlexCenter.activiti.view.MxGraphWindow',{
            title: workFlowRes.addNewFlow
          });
        win.show();
    },
    mxGraph:function(){
        var me=this;
        var win = Ext.widget('aModelForm');
        this.mon(win, 'addModel', function (twin, data) {
            Ext.Ajax.request({
                url:'html/edit/save',
                params:{mid:'',name:data.name,category:data.category,source:data.source},
                method:'POST',
                success:function(response, options){
                    var result=Ext.decode(response.responseText);
                    if(result.success){
                        me.down('grid').getStore().load();
                    }else{
                        Ext.MessageBox.alert({
                            title:'发布mxGraph脚本',
                            icon: Ext.MessageBox.ERROR,
                            msg:result.message,
                            buttons:Ext.MessageBox.OK
                        });

                    }
                },
                failure:function(response, options){
                    alert('请求超时或网络故障,错误编号：' + response.status)
                }
            });
        });
        win.show();

    },
    showInWin:function(title,widget){
        var me=this;
        var win=Ext.widget('window',{
            layout:'fit',
            width:1000,
            height:600,
            autoScroll:true,
            title:title,
            items:widget,
            modal: true,
            buttons:[
                {
                    text: globalRes.buttons.close,
                    handler: function(){
                        win.close();
                    }
                }
            ]
        });
        win.show();
    },
    flowAuthority:function(rec){
        var me=this;
        var win=Ext.widget('window',{
            width:400,
            autoHeight:true,
//            height:330,
            title:workFlowRes.settingFlowRole,
            layout:'fit',
            modal:true,
            buttons:[
                {
                    text:globalRes.buttons.save,
                    handler:function(){
                        var data = win.down('form').getValues();
                        data.deploymentId=rec.get('deploymentId');
                        Ext.Ajax.request({
                            url:'modelController/setFlowAuthority',
                            params:data,
                            method: 'POST',
                            success: function (response, options){
                                var result=Ext.decode(response.responseText);
                                if(result.success){
                                    win.close();
                                    me.down('grid').getStore().load();
                                }
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                            }
                        })
                    }
                },{
                    text:globalRes.buttons.close,
                    handler:function(){
                        win.close();
                    }
                }
            ],
            items:[
                {
                    border:false,
                    layout:'fit',
                    items:[
                        {
                            border:false,
                            xtype:'form',
                            margins:'5 0 5 5',
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },
                            items:[
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'hidden',
                                            name:'usernames',
                                            value:rec.get('authorityUserName'),
                                            itemId:'flowAuthority_username_hidden'
                                        },
                                        {
                                            fieldLabel:workFlowRes.flowUserFeature,
                                            width : 255,
                                            name : 'userFullnames',
                                            itemId:'flowAuthority_username',
                                            xtype : 'textarea',
                                            value:rec.get('authorityUserFullName'),
                                            editable:false,
                                            margins:'5 10 10 0',
                                            maxLength : 2000
                                        },{
                                            margins:'5 0 0 5',
                                            xtype:'button',
                                            text:userRoleRes.changeUsers,
                                            handler:function(){
                                                Ext.widget('userSelector',{
                                                    resultBack:function(ids,values,usernames){
                                                        win.down('form').down('#flowAuthority_username').setValue(values);
                                                        win.down('form').down('#flowAuthority_username_hidden').setValue(usernames);
                                                    }
                                                }).show();
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'hidden',
                                            name:'roleId',
                                            value:rec.get('authorityRoleId'),
                                            itemId:'flowAuthority_roleId_hidden'
                                        },
                                        {
                                            fieldLabel:userRoleRes.roleFeatures,
                                            width : 255,
                                            name : 'roleName',
                                            xtype : 'textarea',
                                            value:rec.get('authorityRoleName'),
                                            margins:'5 10 10 0',
                                            itemId:'flowAuthority_roleId',
                                            maxLength : 2000
                                        },{
                                            margins:'5 0 0 5',
                                            xtype:'button',
                                            text:userRoleRes.changeRoles,
                                            handler:function(){
                                                Ext.widget('roleSelector',{
                                                    resultBack: function(ids,names){
                                                        win.down('form').down('#flowAuthority_roleId').setValue(names);
                                                        win.down('form').down('#flowAuthority_roleId_hidden').setValue(ids);
                                                    }
                                                }).show();
                                            }
                                        }
                                    ]
                                }
//                                ,{
//                                    xtype:'container',
//                                    layout:'hbox',
//                                    items:[
//                                        {
//                                            xtype:'hidden',
//                                            name:'deptId',
//                                            value:rec.get('authorityDeptId'),
//                                            itemId:'flowAuthority_deptId_hidden'
//                                        },
//                                        {
//                                            fieldLabel:userRoleRes.departRoles,
//                                            width : 255,
//                                            name : 'deptName',
//                                            xtype : 'textarea',
//                                            itemId:'flowAuthority_deptId',
//                                            value:rec.get('authorityDeptName'),
//                                            margins:'5 10 10 0',
//                                            maxLength : 2000
//                                        },{
//                                            margins:'5 0 0 5',
//                                            xtype:'button',
//                                            text:userRoleRes.changeDepart,
//                                            handler:function(){
//                                                Ext.widget('orgSelector',{
//                                                    resultBack: function(orgId,orgName){
//                                                        win.down('form').down('#flowAuthority_deptId').setValue(orgName);
//                                                        win.down('form').down('#flowAuthority_deptId_hidden').setValue(orgId);
//                                                    }
//                                                }).show();
//                                            }
//                                        }
//                                    ]
//                                }
                            ]

                        }
                    ]
                }

            ]
        });
        win.show();
    },
    addTab:function(widget,itemId,title,rec){
        var me=this;
        var panel = Ext.ComponentQuery.query('#'+itemId)[0];
        var tab=Ext.ComponentQuery.query('#myActivitiFlowManagerViewTab')[0];
        if (!panel) {
            panel = Ext.widget(widget,{
                title:title,
                itemId:itemId,
                record:rec
            });
            tab.add(panel);
        }
        tab.setActiveTab(panel);
    },
    onUpdateClick:function(record){
        var me=this;
        var id=record.get('id');
        var cmp = Ext.create('Ext.Component', {
          itemId: 'editDiv',
          html:'<div id="mainView">' +
              '<div id="sideBar"></div>' +
              '<div id="graph" style="height: 100%;"></div>' +
              '<div id="task1"></div>' +
              '<div id="task2"></div>' +
              '</div>'
  //        renderTo: me
        });
      me.add(cmp);
          var win = Ext.create('FlexCenter.activiti.view.MxGraphWindow',{
            modelId: id,
            title: globalRes.buttons.edit
          });
        win.show();
    },
    onDeleteClick:function(){
        var me=this;
        var selects=me.down('grid').getSelectionModel().getSelection();
        me.deleteClick(selects);
    },

    deleteClick:function(selects){
        var me=this,diaryIds=[];
        if(!selects || selects.length<1){
            Ext.MessageBox.alert({
                title:'workFlowRes.deleteFlow',
                icon: Ext.MessageBox.ERROR,
                msg:workFlowRes.changeDeleteFlow,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        Ext.Array.each(selects,function(mode){
            diaryIds.push(mode.get("id"));
        });
        var diaryIdStr=diaryIds.join(",");
        Ext.MessageBox.show({
            title:workFlowRes.deleteFlow,
            buttons:Ext.MessageBox.YESNO,
            msg:workFlowRes.changeDeleteFlowConfirm,
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'yes'){
                    Ext.Ajax.request({
                        url:'modelController/delete',
                        params:{
                            modelId:diaryIdStr
                        },
                        method: 'POST',
                        success: function (response, options){
                            var result=Ext.decode(response.responseText);
                            if(result.success){
                                me.down('grid').getStore().reload();
                            }else{
                                Ext.MessageBox.alert({
                                    title:globalRes.title.warning,
                                    icon: Ext.MessageBox.ERROR,
                                    msg:result.message,
                                    buttons:Ext.MessageBox.OK
                                });
                            }
                        },
                        failure: function (response, options) {
                            Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
                        }
                    })
                }
            }
        });

    },
    deploy:function(rec){
        var me=this,modeId=rec.get('id');
        Ext.Ajax.request({
            url:'modelController/deploy',
            params:{modelId:modeId},
            method: 'POST',
            scope:me,
            success: function (response, options){
                var result=Ext.decode(response.responseText);
                if(result.success){
                    me.down('grid').getStore().load();
                }
                Ext.MessageBox.alert({
                    title:result.success?globalRes.title.success:globalRes.title.fail,
                    icon: result.success?Ext.MessageBox.INFO:Ext.MessageBox.ERROR,
                    msg:result.message,
                    buttons:Ext.MessageBox.OK
                });
            },
            failure: function (response, options) {
                Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
            }
        })
    }
});

