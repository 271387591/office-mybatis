/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/27/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.ProcessRunWindow',{
    extend:'Ext.Window',
    alias: 'widget.processRunWindow',
    requires: [
        'FlexCenter.activiti.view.FlowUserSelector'
    ],
    resizable: false,
    width: 500,
    height:300,
    layout:'fit',

    border:false,
    modal: true,
    initComponent: function(){
        var me=this;
        var destRadio=[];
        var taskId;
        var dest=me.dest;
        var isEnd,endIndex;
        if(dest){
            for(var i=0;i<dest.length;i++){
                var radio={
                    boxLabel:dest[i].destName,
                    name:'dest',
                    inputValue:dest[i].destId
                }
                if(i==0){
                    radio.checked=true;
                    taskId= dest[i].destId;
                }
                if(dest[i].isEnd=='0'){
                    isEnd=0;
                    radio.isEnd=0;
                    endIndex=i;
                }
                destRadio.push(radio);
            }
        }
        var userFiledset={
            xtype: 'fieldset',
            title: '选择执行人',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            collapsible: true,
            items:[
                {
                    xtype: 'container',
                    anchor: '100%',
                    layout: 'hbox',
                    items:[
                        {
                            xtype:'hidden',
                            name: 'userId',
                            itemId:'taskUserAssigneeField'
                        },
                        {
                            xtype:'textfield',
                            fieldLabel: '执行人',
                            itemId:'taskUserAssigneeName',
                            width:300,
                            readOnly:true,
                            name:'userFullName',
                            margins:'0 5 5 0',
                            anchor:'100%'
                        },{
                            xtype:'button',
                            text: '选择',
                            handler: function() {
                                Ext.widget('flowUserSelector',{
                                    definitionId: me.definitionId,
                                    taskId:taskId,
                                    processInstanceId:me.processInstanceId,
                                    formDataId:me.formDataId,
                                    callBack:function(usernames,values){
                                        Ext.ComponentQuery.query('#taskUserAssigneeField')[0].setValue(usernames);
                                        Ext.ComponentQuery.query('#taskUserAssigneeName')[0].setValue(values);
                                    }
                                }).show()
                            }
                        }
                    ]
                }
            ]
        };
        var destRadioIndexArray=[];
        for(var i=0;i<destRadio.length;i++){
            if(i == endIndex){
                continue;
            }
            destRadioIndexArray.push(destRadio[i]);
        }
        if(isEnd == 0){ //有结束节点和其他节点共存的情况
            destRadioIndexArray.push(destRadio[endIndex]);//将结束节点加到最后一个
        }
        var flowPathFiledSet={
            xtype: 'fieldset',
            title: '选择执行路径',
            layout: 'form',
            collapsible: true,
            style:'display:""',
            items:[
                {
                    xtype: 'radiogroup',
                    fieldLabel: '执行路径',
                    items: destRadioIndexArray,
                    listeners:{
                        'change':function(rodio,newValue,oldValue,eOpts){
                            taskId=newValue.dest;
                            var userPanel=Ext.ComponentQuery.query('#flowUserFiledset')[0];
                            if(rodio.getChecked()[0].isEnd == 0){
                                userPanel.hide();
                            }else{
                                userPanel.show();
                            }
                        }
                    }
                }
            ]
        };
        var items=[];
        items.push(
            {
            xtype:'panel',
            itemId:'flowPathFieldset',
            border:false,
            items:flowPathFiledSet
        });
        items.push({
            xtype:'panel',
            itemId:'flowUserFiledset',
            border:false,
            items:userFiledset
        });

        if(isEnd==0 && destRadioIndexArray.length==1){//只有一个节点且为结束节点的时候,去掉人员选择
            items.pop();
        }
        me.title = me.taskId?'执行下一步':'启动流程';
        me.items = [
            {
                xtype:'form',
                frame:false,
                bodyPadding: 3,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items:items,
                buttons:[{
                    text: me.title,
                    formBind: true,
                    scope:me,
                    handler:function(){
                        var data=me.down('form').getForm().getValues();
                        var startView = Ext.ComponentQuery.query('#'+me.startViewItemId)[0];
                        if(me.taskId){
                            var requestData={
                                definitionId:me.definitionId,
                                targetTaskKey:taskId,
                                taskId:me.taskId,
                                targetUserId:data.userId,
                                taskName:me.taskName,
                                taskKey:me.taskKey,
                                processInstanceId:me.processInstanceId,
                                formData:me.formData,
                                fileAttach:me.fileAttach,
                                mail:me.mail,
                                executionId:me.executionId

                            }
                            me.request('processesController/completeTask',requestData,function(result){
                                var ret=result.success;
                                Ext.MessageBox.show({
                                    title:'完成任务',
                                    icon:ret=='true'? Ext.MessageBox.INFO:Ext.MessageBox.ERROR,
                                    msg:result.message,
                                    buttons:Ext.MessageBox.OK
                                });
                                me.callBack();
                                if(startView){
                                    startView.close();
                                }
                                me.close();
                            });
                        }else{
                            var requestData={
                                definitionId:me.definitionId,
                                taskId:taskId,
                                formData:me.formData,
                                fileAttach:me.fileAttach,
                                mail:me.mail,
                                userId:data.userId
                            }
                            me.request('processesController/startProcess',requestData,function(result){
                                var ret=result.success;
                                Ext.MessageBox.show({
                                    title:'流程启动',
                                    icon:ret=='true'? Ext.MessageBox.INFO:Ext.MessageBox.ERROR,
                                    msg:result.message,
                                    buttons:Ext.MessageBox.OK
                                });
                                if(startView){
                                    startView.close();
                                }
                                me.close();
                            });
                        }
                        
                        
                    }
                },{
                    text: '取消',
                    handler: function(){
                        me.close();
                    }
                }]
            }
        ];

        me.callParent(arguments);
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
                        me.down('grid').getStore().reload();
                    } else{
                        callback(result);
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
