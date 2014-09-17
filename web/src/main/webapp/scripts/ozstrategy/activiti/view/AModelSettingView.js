/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/21/13
 * Time: 2:48 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelSettingView',{
    requires:[
        'FlexCenter.activiti.view.FlowFormDataSelector',
        'FlexCenter.activiti.store.TaskNode',
        'Ext.grid.plugin.CellEditing',
        'FlexCenter.activiti.view.FormFieldSelector',
        'Ext.ux.form.FormDataCustomFiled'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.aModelSettingView',
    layout:'form',
    autoScroll:true,
    closable:true,
    getTaskNodes:function(){
        var me=this;
        var store=Ext.create('FlexCenter.activiti.store.TaskNode',{
            storeId:'TaskNodeStore'
        });
        store.load({
            params:{
                modelId:me.record.get('id')
            }
        });
        return store;

    },
    initComponent:function(){
        var me=this;
        var form = Ext.create('Ext.form.Panel',{
            frame:false,
            bodyPadding: 3,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            border:false,
            items:[
                me.showFormData(),
                me.showTaskNode(),
                me.showDiagram()
            ]
        });
        me.items=form;
        me.callParent();
    },
    showDiagram:function(){
        var me=this;
        return {
            xtype: 'fieldset',
            title: '流程图',
            layout: 'form',
            collapsible: true,
            items:[
                {
                    xtype:'panel',
                    height:400,
                    autoScroll:true,
                    html:'<div style="padding: 20px 0 0 10px;">'+me.record.get('diagramHtml')+'</div>'
                }
            ]
        };
    },
    showFormData:function(){
        var me=this;
        return {
            xtype: 'fieldset',
            title: '全局表单设置',
            layout: 'form',
            collapsible: true,
            items:[
                {
                    xtype:'container',
                    layout:'hbox',
                    items:[
                        {
                            xtype:'hidden',
                            name:'formDataId',
                            itemId:'aModelSettingView_formDataId'
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'formDataName',
                            fieldLabel: '表单名称',
                            margins:'0 5 0 0',
                            value:me.record.get('formName'),
                            readOnly:true
                        },
                        {
                            xtype:'button',
                            text:'选择...',
                            margins:'0 5 0 0',
                            handler:function(){
                                Ext.widget('flowFormDataSelector',{
                                    callBack:function(data){
                                        Ext.Ajax.request({
                                            url:'modelController/setFormData',
                                            params:{modelId:me.record.get('id'),formDataId:data.id,formDataName:data.name},
                                            method: 'POST',
                                            success:function(response, options){
                                                var result=Ext.decode(response.responseText);
                                                if(result.success){
                                                    Ext.ComponentQuery.query('#aModelSettingView_priew_btn')[0].setDisabled(false);
                                                    Ext.ComponentQuery.query('#formDataName')[0].setValue(data.name);
                                                    Ext.ComponentQuery.query('#aModelSettingView_formDataId')[0].setValue(data.id);
                                                    me.record.set('formId',data.id);
                                                    Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0].getStore().load({
                                                        params:{
                                                            modelId:me.record.get('id')
                                                        }
                                                    });
                                                }else{
                                                    me.alert('设置失败');
                                                }
                                            }
                                        });
                                    }
                                }).show();
                            }
                        },
                        {
                            xtype:'button',
                            text:'预览',
                            itemId:'aModelSettingView_priew_btn',
                            disabled:!((me.record)&&(me.record.get('formId'))),
                            handler:function(){
                                Ext.Ajax.request({
                                    url:'modelController/getFormData',
                                    params:{formDataId:me.record.get('formId')},
                                    method: 'POST',
                                    success:function(response, options){
                                        var result=Ext.decode(response.responseText);
                                        if(result.success){
                                            var win = Ext.widget('window',{
                                                width:800,
                                                height:500,
                                                modal:true,
                                                layout:'fit',
                                                items:[
                                                    {
                                                        xtype:'preview',
                                                        formHtml:result.data.content
                                                    }
                                                ],
                                                buttons:[
                                                    {
                                                        text:'关闭',
                                                        handler:function(){
                                                            win.close();
                                                        }
                                                    }
                                                ]
                                            });
                                            win.show();
                                        }
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        };
    },
    showTaskNode:function(){
        var me=this;
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners:{
                beforeedit:function( tg, e, value, eOpts ){
                    if(e.colIdx==2 && e.record.get('type') == 0){
                        return false;
                    }
                    if(e.colIdx==3 && e.record.get('assigneeType')==1){
                        return false;
                    }
                    if(e.colIdx==5 && e.record.get('type') != 5){
                        return false;
                    }
                    return true;
                }
            }
        });
        return {
            xtype: 'fieldset',
            title: '流程节点设置',
            layout: 'form',
            collapsible: true,
            items:[
                {
                    xtype:'grid',
                    region:'center',
                    store:me.getTaskNodes(),
                    forceFit: true,
                    border:true,
                    autoScroll: true,
                    itemId:'taskNode_formFieldGrid',
                    selModel: {
                        selType: 'cellmodel'
                    },
                    tbar:[
                        {
                            xtype:'button',
                            text:'保存',
                            iconCls:'save',
                            handler:function(){
                                var grid= Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0];
                                var store = grid.getSelectionModel().getStore();
                                var array=[],ret=false;
                                store.each(function(rec){
                                    var model={};
                                    model.taskAssignee=rec.get('taskAssignee');
                                    model.assignType=rec.get('assigneeType');
                                    if(!model.taskAssignee && model.assignType!=1){
                                        ret=true;
                                        return;
                                    }
                                    model.id=rec.get('id');
                                    model.fieldInfo=rec.get('fieldInfo');
                                    model.objection=rec.get('objection');
                                    model.metaInfo=rec.get('metaInfo');
                                    array.push(model);
                                });
                                if(ret){
                                    me.alert('人员必须设置');
                                    return;
                                }
                                Ext.Ajax.request({
                                    url:'modelController/saveOrUpdateTaskNode',
                                    params:{data:Ext.encode(array)},
                                    method: 'POST',
                                    success:function(response, options){
                                        var result=Ext.decode(response.responseText);
                                        if(result.success){
                                            store.load({
                                                params:{
                                                    modelId:me.record.get('id')
                                                }
                                            });
                                            me.alert('保存成功');
                                        }else{
                                            me.alert('保存失败');
                                        }
                                    }
                                });

                            }
                        }
                    ],
                    plugins: [cellEditing],
                    columns:[
                        {
                            header: '序号',
                            xtype:'rownumberer',
                            width:30
                        },
                        {
                            header: '任务名称',
                            dataIndex: 'taskName',
                            renderer: function (v,metaData,record) {
                                if(record.get('type')==5){
                                    return v+'<font color="red">(会签)</font>'
                                }
                                return v;
                            }
                        },{
                            header: '发起人执行',
                            dataIndex: 'assigneeType',
                            width: 130,
                            renderer: function (v,metaData,record) {
                                if(v==0){
                                    return '否'
                                }
                                return '是';
                            },
                            editor: new Ext.form.field.ComboBox({
                                typeAhead: true,
                                triggerAction: 'all',
                                editable:false,
                                store: [
                                    ['1','是'],
                                    ['0','否']
                                ],
                                lazyRender: true,
                                listClass: 'x-combo-list-small',
                                listeners:{
                                    change:function(combo, newValue, oldValue,eOpts ){
                                        var rec = Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0].getSelectionModel().getSelection()[0];
                                        rec.set('assignType',newValue);
                                        rec.set('taskAssignee','');
                                    }
                                }

                            })
                        },
                        {
                            header: '人员设置',
                            dataIndex: 'assigneeName',
                            width: 130,
                            renderer: function (v,metaData,record) {
                                if(record.get('assigneeType')==1){
                                    return '<font color="red">发起人执行</font>'
                                }
                                return v;
                            },
                            editor: new Ext.form.field.Trigger({
                                triggerClass : 'x-form-browse-trigger',
                                editable:false,
                                itemId:'taskAssigneeTrigger',
                                onTriggerClick:function(){
                                    var rec = Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0].getSelectionModel().getSelection()[0];
                                    Ext.widget('userSelector',{
                                        resultBack:function(ids,values,usernames){
                                            rec.set('taskAssignee',usernames);
                                            rec.set('assigneeName',values);
                                        },
                                        mode:'SINGLE'
                                    }).show();

                                }
                            })
                        },{
                            header: '表单字段设置',
                            dataIndex: 'fieldInfo',
                            renderer: function (v,metaData,record) {
                                if(v){
                                    var data=Ext.decode(v),str='';
                                    for(var i=0;i<data.length;i++){
                                        str+=((data[i].label+':')+(data[i].chmod==0?'可写;':data[i].chmod==1?'只读;':'隐藏;'));
                                    }
                                    return '<font color="red">'+str+'</font>'
                                }
                                return v;
                            },
                            width: 130,
                            editor: new Ext.form.field.Trigger({
                                triggerClass : 'x-form-browse-trigger',
                                editable:false,
                                itemId:'fieldInfoTrigger',
                                onTriggerClick:function(){
//                                    if(!me.record.get('formName')){
//                                        me.alert('请先设置全局表单。');
//                                        return;
//                                    }
                                    var rec = Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0].getSelectionModel().getSelection()[0];
                                    Ext.widget('formFieldSelector',{
                                        fromId:rec.get('formDataId'),
                                        taskKey:rec.get('taskKey'),
                                        modelId:rec.get('modelId'),
                                        oldFormFieldSrc:rec.get('fieldInfo'),
                                        callBack:function(data){
                                            rec.set('fieldInfo',Ext.encode(data.array));
                                            rec.set('objection',data.objection);
                                        },
                                        mode:'SINGLE'
                                    }).show();

                                }
                            })
                        },{
                            header: '会签设置',
                            dataIndex: 'metaInfo',
                            renderer: function (v,metaData,record) {
                                if(record.get('type') != 5){
                                    return '<font color="red">非会签任务</font>'
                                }
                                if(v){
                                    var data=Ext.decode(v);
                                    return ('会签方式：')+(data.signType==1?('百分率,通过比率：'+data.perTotal*100)+'%':'人数,通过人数：'+data.personTotal);
                                }
                                return v;
                            },
                            width: 130,
                            editor: new Ext.form.field.Trigger({
                                triggerClass : 'x-form-browse-trigger',
                                editable:false,
                                itemId:'fieldInfoTrigger',
                                onTriggerClick:function(){
                                    var rec = Ext.ComponentQuery.query('#taskNode_formFieldGrid')[0].getSelectionModel().getSelection()[0];
                                    me.signSetting(rec);
                                }
                            })
                        }

                    ]
                }
            ]
        };
    },
    signSetting:function(rec){
        var me=this;
        var data=Ext.decode(rec.get('metaInfo'));
        var win=Ext.widget('window',{
            width:400,
            height:200,
            title:'会签设置',
            layout:'fit',
            buttons:[
                {
                    text:'确定',
                    handler:function(){
                        var data=Ext.ComponentQuery.query('#num_numberfield')[0].down('numberfield').getValue();
                        var data1=Ext.ComponentQuery.query('#signType_radiofield')[0].down('radiofield').getValue();
                        if(!data){
                            me.alert("请填写数值");
                            return;
                        }
                        var sign={};
                        if(data1){
                            sign.signType=1;
                            sign.perTotal=data/100;
                        }else{
                            sign.signType=2;
                            sign.personTotal=data;
                        }
                        sign.taskKey=rec.get('taskKey');
                        rec.set('metaInfo',Ext.encode(sign));
                        win.close();
                    }
                },
                {
                    text:'取消',
                    handler:function(){
                        win.close();
                    }
                }
            ],
            items:[
                {
                    xtype:'panel',
                    layout : 'form',
                    bodyStyle : 'padding:10px',
                    border : false,
                    defaults : {
                        anchor : '96%,96%'
                    },
                    items:[
                        {
                            xtype      : 'fieldcontainer',
                            fieldLabel : '会签模式',
                            defaultType: 'radiofield',
                            defaults: {
                                flex: 1
                            },
                            layout: 'hbox',
                            itemId:'signType_radiofield',
                            items:[
                                {
                                    boxLabel  : '按百分比',
                                    name      : 'signType',
                                    inputValue: '1',
                                    checked:data.signType==1,
                                    listeners:{
                                        change : function(checkbox, newValue, oldValue){
                                            Ext.ComponentQuery.query('#num_numberfield')[0].down('numberfield').setFieldLabel("会签完成人数");
                                            Ext.ComponentQuery.query('#num_numberfield')[0].down('numberfield').setMaxValue(9999999999);
                                        }
                                    }
                                }, {
                                    boxLabel  : '按人数',
                                    name      : 'signType',
                                    inputValue: '2',
                                    checked:data.signType==2,
                                    listeners:{
                                        change : function(checkbox, newValue, oldValue){
                                            Ext.ComponentQuery.query('#num_numberfield')[0].down('numberfield').setFieldLabel("会签完成率(%)");
                                            Ext.ComponentQuery.query('#num_numberfield')[0].down('numberfield').setMaxValue(100);
                                        }
                                    }
                                }
                            ]
                        },{
                            border:false,
                            itemId:'num_numberfield',
                            items:[
                                {
                                    xtype: 'numberfield',
                                    anchor: '100%',
                                    name: 'num',
                                    fieldLabel: data.signType==1?'会签完成率(%)':'会签完成人数',
                                    minValue: 0,
                                    maxValue:100,
                                    value:data.signType==1?data.perTotal*100:data.personTotal,
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    mouseWheelEnabled: false
                                }
                            ]
                        }
                    ]
                }
            ]

        }).show();

    },
    alert:function(message){
        Ext.MessageBox.show({
            title:'提示',
            icon:Ext.MessageBox.INFO,
            msg:message,
            buttons:Ext.MessageBox.OK
        });
    }

});
