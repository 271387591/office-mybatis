/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormView',{
    requires:[
        'Ext.grid.*',
        'Ext.data.*',
        'FlexCenter.forms.store.FlowForm',
        'FlexCenter.forms.view.FlowFormForm',
        'FlexCenter.forms.view.FlowFormDetail',
        'FlexCenter.forms.view.FormPreviewWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.flowFormView',
    itemId:'flowFormView',
    layout:'border',
    selector:false,
    autoScroll:true,
    getStore: function(){
        var store=Ext.create("FlexCenter.forms.store.FlowForm",{
            storeId:'flowFormViewStore'
        });
        if(this.selector){
            store.on('beforeload',function(s,e){
                e.params = {
                    status:'Active'
                };
            });
        }
        store.load();
        return store;
    },
    initComponent:function(){
        var me=this;
        var store = me.getStore();
        var actioncolumn=[{
            iconCls:'btn-preview',
            tooltip:workFlowRes.modeler.preview,
            handler:function(grid, rowIndex, colIndex){
                var rec = grid.getStore().getAt(rowIndex),selects=[];
                var formHtml=rec.get('content');
                Ext.widget('formPreviewWindow',{
                    formHtml:formHtml
                }).show();
            }
        }];
        if(globalRes.isAdmin || accessRes.publishForm){
            actioncolumn.push('-');
            actioncolumn.push({
                tooltip:flowFormRes.flowFormView.publish,
                handler:function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    me.publishTable(rec);
                },
                getClass:function(v,metadata,record){
                    if(record.get('status')=='Draft'){
                        return 'icon-publish';
                    }
                    return 'x-hide-display';
                },
                isDisabled:function(view,rowIndex,colIndex,item,record){
                    if(record.get('status')=='Draft'){
                        return false;
                    }
                    return true;
                }
            });
        }
        
        me.items=[
            {
                xtype:'grid',
                region:'center',
                store:store,
                border:false,
                autoScroll: true,
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:globalRes.buttons.add,
                        iconCls:'table-add',
                        scope:me,
                        hidden: me.selector,
                        plugins:Ext.create('Oz.access.RoleAccess', {featureName:'addForm',mode:'hide',byPass:globalRes.isAdmin}),
                        handler:me.onAddClick
                    },
                    {
                        xtype: 'button',
                        frame: true,
                        text: globalRes.buttons.edit,
                        iconCls: 'table-edit',
                        plugins:Ext.create('Oz.access.RoleAccess', {featureName:'updateForm',mode:'hide',byPass:globalRes.isAdmin}),
                        hidden: me.selector,
                        scope: me,
                        handler: me.updateClick
                    },
                    {
                        xtype: 'button',
                        frame: true,
                        text: globalRes.buttons.remove,
                        iconCls: 'table-delete',
                        hidden: me.selector,
                        plugins:Ext.create('Oz.access.RoleAccess', {featureName:'deleteForm',mode:'hide',byPass:globalRes.isAdmin}),
                        scope: me,
                        handler: me.onDeleteClick
                    }
                ],
                plugins:Ext.create('Oz.access.RoleAccess', {featureName:'updateForm',mode:'hide',byPass:globalRes.isAdmin}),
                features:[{
                    ftype: 'search',
                    disableIndexes : ['id','description','status','createDate'],
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
                    {
                        header: flowFormRes.flowFormForm.name,
                        flex:1,
                        dataIndex: 'name'
                    },
                    {
                        header: flowFormRes.flowFormForm.displayName,
                        flex:1,
                        dataIndex: 'displayName'
                    },
                    
                    {
                        header: userRoleRes.header.description,
                        flex:1,
                        dataIndex: 'description'
                    },
                    {
                        header: flowFormRes.flowFormView.status,
                        flex:1,
                        dataIndex: 'status',
                        renderer:function(v){
                            if(v=='Draft'){
                                return flowFormRes.flowFormView.draft;
                            }else if(v=='Active'){
                                return flowFormRes.flowFormView.published;
                            }
                            return v;
                        }
                    },
                    {
                        header: globalRes.header.createDate,
                        flex:1,
                        dataIndex: 'createDate'
                    },
                    
                    me.selector?{
                        xtype:'actioncolumn',
                        header:globalRes.buttons.managerBtn,
                        flex:1,
                        items:[
                            {
                                iconCls:'btn-preview',
                                tooltip:workFlowRes.modeler.preview,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex),selects=[];
                                    var formHtml=rec.get('content');
                                    Ext.widget('formPreviewWindow',{
                                        formHtml:formHtml
                                    }).show();
                                } 
                            }
                        ]
                    }:
                    {
                        xtype:'actioncolumn',
                        header:globalRes.buttons.managerBtn,
                        flex:1,
                        hidden: me.selector,
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
        this.callParent();
    },
    publishTable:function(rec){
        var me=this,ids=[];
        ids.push(rec.get('id'))
        ajaxPostRequest('flowFormController.do?method=publish',{ids:ids.join(',')},function(result){
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
    onAddClick:function(){
        var me = this;
        var win = Ext.create('FlexCenter.forms.view.FlowFormForm',{
            title:flowFormRes.flowFormForm.title,
            animateTarget:me.getEl()
        });
        win.show();
        win.setActiveRecord(null);
        this.mon(win, 'addForm', function (win, data) {
            me.saveOrUpdate(data,true,win);

        });
    },
    updateClick:function(){
        var me=this;
        me.onUpdateClick();
    },
    onUpdateClick:function(record){
        var me = this;
        var store=me.down('grid').getStore();
        var selects=me.down('grid').getSelectionModel().getSelection();
        var record=record?record:(selects.length>0?store.getById(selects[0].get('id')):null);
        if(record==null){
            Ext.MessageBox.alert({
                title:globalRes.buttons.edit,
                icon: Ext.MessageBox.ERROR,
                msg:flowFormRes.flowFormView.editMsg,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        var win = Ext.create('FlexCenter.forms.view.FlowFormForm',{
            title:globalRes.buttons.edit
        });
        win.show();
        win.setActiveRecord(record);
        this.mon(win,'updateForm',function(win,data){
            me.saveOrUpdate(data,false,win);
        });

    },
    onDeleteClick:function(){
        var me=this;
        var selects=me.down('grid').getSelectionModel().getSelection();
        
        me.deleteClick(selects);
    },

    deleteClick:function(selects){
        var me=this,ids=[];
        if(!selects || selects.length<1){
            Ext.MessageBox.alert({
                title:globalRes.buttons.remove,
                icon: Ext.MessageBox.ERROR,
                msg:flowFormRes.flowFormView.delMsg,
                buttons:Ext.MessageBox.OK
            });
            return;
        }
        ajaxPostRequest('flowFormController.do?method=checkFormInUse',{id:selects[0].get('id')},function(result){
            if(result.success){
                Ext.Msg.alert(globalRes.title.prompt,flowFormRes.flowFormView.delFormMsg);
            }else{
                Ext.Array.each(selects,function(mode){
                    ids.push(mode.get("id"));
                });
                Ext.MessageBox.show({
                    title:globalRes.buttons.remove,
                    buttons:Ext.MessageBox.YESNO,
                    msg:flowFormRes.flowFormView.delPromptMsg,
                    icon:Ext.MessageBox.QUESTION,
                    fn:function(btn){
                        if(btn == 'yes'){
                            ajaxPostRequest('flowFormController.do?method=multiRemove',{ids:ids},function(result){
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
                        }
                    }
                });
            }
        });
    },
    
    saveOrUpdate:function(data,save,win){
        var me=this;
        var url='flowFormController.do?method='+(save?'save':'update');
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
