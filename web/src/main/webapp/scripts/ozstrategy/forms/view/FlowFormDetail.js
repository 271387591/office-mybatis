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
    title: '表单结构',
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
            }
        ];
        var fields=rec.get('fields');
        var store=Ext.create('Ext.data.Store',{
            fields:['id','name','label'],
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
                title:'主表：【'+rec.get('displayName')+'】字段',
                columns:columns,
                region:'center',
                margin:'0 1 0 0',
                autoScroll: true,
                store:store
            }
        ];
        me.width=600;
        me.height=400;
        var children=rec.get('children');
        if(children.length>0){
            var citems=[];
            for(var i=0;i<children.length;i++){
                var cfield=children[i].fields;
                var cstore=Ext.create('Ext.data.Store',{
                    fields:['id','name','label'],
                    proxy:{
                        type:'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data:cfield
                });
                var cgrid={
                    xtype:'grid',
                    border:false,
                    title:'明细表：【'+children[i].displayName+'】字段',
                    columns:columns,
                    autoScroll: true,
                    store:cstore
                }
                citems.push(cgrid);
            }
            var cpanel={
                xtype:'panel',
                width:300,
                region:'east',
                
                autoScroll: true,
                items:citems
            }
            items.push(cpanel);
            me.width=800;
            me.height=500;
        }
        
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
