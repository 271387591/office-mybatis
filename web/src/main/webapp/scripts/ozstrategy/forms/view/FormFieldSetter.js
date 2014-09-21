/**
 * Created by lihao on 9/15/14.
 */
Ext.define('FlexCenter.forms.view.FormFieldSetter', {
    requires: [
    ],
    extend: 'Ext.Window',
    alias: 'widget.formFieldSetter',
    title: '字段设置',
    shim: false,
    modal: true,
    layout: 'fit',
    width:700,
    height:400,
    border:false,
    getStore:function(){
        var me=this;
        var store=Ext.StoreManager.lookup("FormFieldSetterStore");
        if(me.formproperties){
            var formproperties=Ext.decode(me.formproperties,true);
            if(formproperties!=null){
                var items=formproperties.items,len=items.length,data=[];
                for(var i=0;i<len;i++){
                    var obj={},item=items[i];
                    obj.name=item.formproperty_name;
                    obj.variable=item.formproperty_variable;
                    obj.type=item.formproperty_type;
                    obj.readable=item.formproperty_readable;
                    obj.writeable=item.formproperty_writeable;
                    obj.required=item.formproperty_required;
                    obj.expression=item.formproperty_expression;
                    if(item.formproperty_readable=='Yes'){
                        obj.chmod=0;
                    }else if(item.formproperty_writeable=='Yes'){
                        obj.chmod=1;
                    }else{
                        obj.chmod=2;
                    }
                    data.push(obj);
                }
                store=Ext.create("Ext.data.Store",{
                    storeId:'FormFieldSetterStore',
                    fields:['name','variable','type','readable','writeable','required','expression','chmod'],
                    data:data
                });
                return store;
            }
        }
        if(!store){
            store=Ext.create("Ext.data.Store",{
                storeId:'FormFieldSetterStore',
                fields:['name','variable','type','readable','writeable','required','expression','chmod'],
                proxy: {
                    type: 'ajax',
                    url: 'processDefController.do?method=listDefFormField',
                    reader: {
                        root : 'data',
                        totalProperty  : 'total',
                        messageProperty: 'message'
                    },
                    writer: {
                        writeAllFields: true,
                        root: 'data'
                    },
                    listeners: {
                        exception: function(proxy, response, operation) {
                            Ext.MessageBox.show({
                                    title: globalRes.remoteException,
                                    msg: operation.getError(),
                                    icon: Ext.MessageBox.ERROR,
                                    buttons: Ext.Msg.OK
                                }
                            );
                        }
                    }
                }
            });
        }
        store.load({
            params:{
                formId:me.formId
            }
        });
        return store;
        
    },
    initComponent:function(){
        var me=this;
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        var store=me.getStore();
        var items=[
            {
                xtype:'grid',
                selModel:Ext.create('Ext.selection.CheckboxModel'),
                plugins: [cellEditing],
                margin:'0 1 0 0',
                autoScroll: true,
                store:store,
                tbar:[
                    {
                        xtype:'button',
                        frame:true,
                        text:'标为只读',
                        scope:this,
                        handler:function(){
                            var selects = me.down('grid').getSelectionModel().getSelection();
                            Ext.Array.each(selects,function(rec){
                                rec.set('chmod','0')
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
                            var selects = me.down('grid').getSelectionModel().getSelection();
                            Ext.Array.each(selects,function(rec){
                                rec.set('chmod','1')
                            });

                        }
                    },'-',
                    {
                        xtype:'button',
                        frame:true,
                        text:'标为隐藏',
                        scope:this,
                        handler:function(){
                            var selects = me.down('grid').getSelectionModel().getSelection();
                            Ext.Array.each(selects,function(rec){
                                rec.set('chmod','2')
                            });

                        }
                    }
                ],
                columns:[
//                    {xtype: 'rownumberer'},
                    {
                        header: '字段名称',
                        width:120,
                        dataIndex: 'variable'
                    },{
                        header: '字段标题',
                        width:120,
                        dataIndex: 'name'
                    },{
                        header: '数据类型',
                        width:80,
                        dataIndex: 'type'
                    },{
                        header: '权限',
                        width:80,
                        dataIndex: 'chmod',
                        renderer:function(v,rec){
                            if(v==0){
                                return '<font color="#00bfff">只读</font>';
                            }else if(v==1){
                                return '<font color="red">可写</font>';
                            }else if(v==2){
                                return '<font color="#808080">隐藏</font>';
                            }
                            return '<font color="red">可写</font>';
                        },
                        editor: new Ext.form.field.ComboBox({
                            typeAhead: true,
                            triggerAction: 'all',
                            selectOnTab: true,
                            store: [
                                ['0','只读'],
                                ['1','可写'],
                                ['2','隐藏']
                            ],
                            lazyRender: true,
                            listClass: 'x-combo-list-small',
                            listeners:{
                                change:function(combo, newValue, oldValue,eOpts ){
                                    var rec = me.down('grid').getSelectionModel().getSelection()[0]; 
                                    rec.set('chmod',newValue);
                                }
                            }
                        })
                    },{
                        header: '表达式',
                        dataIndex: 'expression',
                        flex: 1,
                        editor: {
                            allowBlank: true,
                            listeners:{
                                change:function(combo, newValue, oldValue,eOpts ){
                                    var rec = me.down('grid').getSelectionModel().getSelection()[0];
                                    rec.set('expression',newValue);
                                }
                            }
                        }
                    }
                ]
            }
        ];
        me.items=items;
        
        me.buttons=[
            {
                xtype:'button',
                text: globalRes.buttons.ok,
                handler: function(){
                    var store = me.down('grid').getView().getStore();
                    var count=store.getCount(),items=[];
                    store.each(function(rec){
                        var model={};
                        model.formproperty_id=rec.get('id')||'';
                        model.formproperty_name=rec.get('name')||'';
                        model.formproperty_type=rec.get('type')||'';
                        model.formproperty_expression=rec.get('expression')||'';
                        model.formproperty_variable=rec.get('variable')||'';
                        model.formproperty_required='No';
                        model.formproperty_readable=rec.get('chmod')==0?'Yes':'No';
                        model.formproperty_writeable=rec.get('chmod')==1?'Yes':'No';
                        model.formproperty_formvalues=[];
                        items.push(model);
                    });
                    var obj={
                        totalCount:count,
                        items:items
                    }
                    if(me.callBack){
                        me.callBack(Ext.encode(obj));
                    }
                    me.close();
                }
            },{
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
