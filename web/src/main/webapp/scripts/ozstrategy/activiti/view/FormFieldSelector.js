/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/22/13
 * Time: 2:07 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.FormFieldSelector', {
    extend: 'Ext.window.Window',
    alias: 'widget.formFieldSelector',
    layout: 'fit',
    width:500,
    height:400,
    title:'字段设置',
    requires: [

    ],
    initComponent: function () {
        var me=this;
        me.buttons=[{
            text: '确定',
            handler:function(){
                var store = Ext.ComponentQuery.query('#formFieldSelectorGrid')[0].getSelectionModel().getStore();
                var array=[],objection,data={};
                store.each(function(rec){
                    var model={};
                    model.name=rec.get('name');
                    model.type=rec.get('type');
                    model.label=rec.get('label');
                    model.objection=rec.get('objection');
                    if(model.objection == '0'){
                        objection=model.name;
                    }
                    model.chmod = rec.get('chmod');
                    array.push(model);
                });
                data.objection=objection;
                data.array= array;
                me.callBack(data);
                me.close();
            }
        },{
            text: '取消',
            handler: function(){
                me.close();
            }
        }];
        var userSrore;
        if(me.oldFormFieldSrc){
            userSrore=Ext.create('Ext.data.Store',{
                fields:['name','label','chmod','objection'],
                data: Ext.decode(me.oldFormFieldSrc),
                proxy:{
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }
                } ,
                autoLoad:true
            });
        }else{
            userSrore=Ext.create('Ext.data.Store',{
                fields:['name','label','chmod','objection'],
                proxy:{
                    type: 'ajax',
                    url: 'flowFormDataController/getFlowFields',
                    reader: {
                        type: 'json',
                        root : 'data',
                        totalProperty  : 'total',
                        messageProperty: 'message'
                    }
                }
            });
            userSrore.load({
                params:{
                    fromId:me.fromId,
                    taskKey:me.taskKey,
                    modelId:me.modelId
                }
            });
        }
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        me.items = Ext.create('Ext.grid.Panel',{
            selModel:Ext.create('Ext.selection.CheckboxModel'),
            forceFit: true,
            border:false,
            autoScroll: true,
            itemId:'formFieldSelectorGrid',
            plugins: [cellEditing],
            tbar:[
                {
                    xtype:'button',
                    frame:true,
                    text:'标为只读',
                    scope:this,
                    handler:function(){
                        var selects = Ext.ComponentQuery.query('#formFieldSelectorGrid')[0].getSelectionModel().getSelection();
                        Ext.Array.each(selects,function(rec){
                            rec.set('chmod','1')
                        });

                    }
                },
                '-',
                {
                    xtype:'button',
                    frame:true,
                    text:'标为可写',
                    scope:this,
                    handler:function(){
                        var selects = Ext.ComponentQuery.query('#formFieldSelectorGrid')[0].getSelectionModel().getSelection();
                        Ext.Array.each(selects,function(rec){
                            rec.set('chmod','0')
                        });

                    }
                },'-',
                {
                    xtype:'button',
                    frame:true,
                    text:'标为隐藏',
                    scope:this,
                    handler:function(){
                        var selects = Ext.ComponentQuery.query('#formFieldSelectorGrid')[0].getSelectionModel().getSelection();
                        Ext.Array.each(selects,function(rec){
                            rec.set('chmod','2')
                        });

                    }
                }
            ],
            columns:[
                {
                    header: '字段名称',
                    dataIndex: 'name'
                },
                {
                    header: '字段标题',
                    dataIndex: 'label'
                },
                {
                    header: '权限',
                    dataIndex: 'chmod',
                    renderer:function(v){
                        if(v==0){
                            return '<font color="#00bfff">可写</font>';
                        }else if(v==1){
                            return '<font color="red">只读</font>';
                        }else if(v==2){
                            return '<font color="#808080">隐藏</font>';
                        }
                    },
                    editor: new Ext.form.field.ComboBox({
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        store: [
                            ['0','可写'],
                            ['1','只读'],
                            ['2','隐藏']
                        ],
                        lazyRender: true,
                        listClass: 'x-combo-list-small'
                    })
                },
                {
                    header: '是否标为审核字段',
                    dataIndex: 'objection',
                    renderer:function(v){
                        if(v=='0'){
                            return '<font color="#00bfff">是</font>';
                        }else{
                            return '否';
                        }
                    },
                    editor: new Ext.form.field.ComboBox({
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        store: [
                            ['0','是'],
                            ['1','否']
                        ],
                        lazyRender: true,
                        listClass: 'x-combo-list-small'
                    })
                }
            ],
            store:userSrore
        });
        me.callParent();
    }
});
