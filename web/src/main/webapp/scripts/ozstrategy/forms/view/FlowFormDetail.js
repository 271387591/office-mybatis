/**
 * Created by lihao on 8/12/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormDetail', {
    requires: [
//        'FlexCenter.forms.model.FlowForm'
//        'FlexCenter.forms.model.FormField'
    ],
    extend: 'Ext.Window',
    alias: 'widget.flowFormDetail',
    itemId: 'flowFormDetail',
    shim: false,
    modal: true,
    layout: 'fit',
    initComponent:function(){
        var me=this,rec=me.rec;
        var columns=[
            {xtype: 'rownumberer'},
            {
                header: '字段名称',
                flex:1,
                dataIndex: 'name'
            },{
                header: '字段标题',
                flex:1,
                dataIndex: 'label'
            },{
                header: '数据类型',
                flex:1,
                dataIndex: 'dataType',
                renderer:function(v){
                    if(v=='string'){
                        return '字符';
                    }else if(v=='number'){
                        return "数字";
                    }else if(v=='array'){
                        return "数组";
                    }else if(v=='date'){
                        return "日期";
                    }
                    return v;
                }
            }
        ];
        var fields=rec.get('fields');
        var store=Ext.create('Ext.data.Store',{
            fields:['id','name','label','dataType'],
            proxy:{
                type:'memory',
                reader: {
                    type: 'json'
                }
            },
            data:fields
        });
        
        var items=[
            {
                xtype:'grid',
                columns:columns,
                region:'center',
                margin:'0 1 0 0',
                autoScroll: true,
                margin:1,
                store:store
            }
        ];
        me.title='表单：<font color="blue">'+rec.get('displayName')+'</font>';
        me.width=600;
        me.height=400;
        me.items=[
            {
                xtype:'panel',
                layout:'border',
                border:false,
                items:items
            }
        ];
        me.buttons=[
            {
                xtype:'button',
                text: globalRes.buttons.close,
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
    }
});
