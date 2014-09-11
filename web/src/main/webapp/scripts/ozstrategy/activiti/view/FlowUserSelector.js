/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 11/12/13
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.FlowUserSelector',{
    requires:[
    ],
    extend: 'Ext.window.Window',
    alias: 'widget.flowUserSelector',
    autoScroll:true,
    closable:true,
    width:400,
    height:330,
    title:'选择执行人',
    layout:'fit',
    initComponent:function(){
        var me=this;
        var userSrore=Ext.create('Ext.data.Store',{
            fields:['name','value'],
            proxy:{
                type: 'ajax',
                url: 'processesController/getTaskUser',
                reader: {
                    type: 'json',
                    root : 'data'
                }
            },
            listeners: {
                beforeload: function (s, e) {
                    e.params = {formDataId:me.formDataId, definitionId: me.definitionId,taskId:me.taskId,processInstanceId:me.processInstanceId }; //ajax 附加参数
                }
            }
        });
        userSrore.load();
        me.buttons=[
            {
                text:'确定',
                handler:function(){
                    var selects = Ext.ComponentQuery.query('#userSelectorGrid')[0].getSelectionModel().getSelection();
                    var usernames=[],values=[];
                    Ext.Array.each(selects,function(mode){
                        usernames.push(mode.get("name"));
                        values.push(mode.get("value"));
                    });
                    var data1 = usernames.join(',');//Ext.encode(usernames);
                    var data2 = values.join(',');//Ext.encode(usernames);
                    me.callBack(data1,data2);
                    me.close();
                }
            },{
                text:'关闭',
                handler:function(){
                    me.close();
                }
            }
        ];
        me.items = Ext.create('Ext.grid.Panel',{
            selModel:Ext.create('Ext.selection.CheckboxModel'),
//            forceFit: true,
            border:false,
            autoScroll: true,
            itemId:'userSelectorGrid',
            columns:[
                {
                    header: '用户名',
                    dataIndex: 'name',
                    flex:1
                },
                {
                    header: '姓名',
                    dataIndex: 'value',
                    flex:1
                }
            ],
            store:userSrore
        });
        this.callParent();
    }
});
