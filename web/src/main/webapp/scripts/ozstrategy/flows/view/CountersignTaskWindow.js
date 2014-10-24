/**
 * Created by lihao on 10/23/14.
 */
Ext.define('FlexCenter.flows.view.CountersignTaskWindow',{
    requires:[
    ],
    extend:'Ext.Window',
    alias: 'widget.countersignTaskWindow',
    title: '会签设置',
    animCollapse : true,
    layout: 'fit',
    width:400,
    modal:true,
    initComponent:function(){
        var me=this;
        var data=(me.data && Ext.decode(me.data)) || {};
        me.items = [
            {
                xtype:'form',
                bodyStyle : 'padding:10px',
                border : false,
                defaults : {
                    anchor : '96%,96%'
                },
                buttons:[
                    {
                        text:'确定',
                        formBind: true,
                        handler:function(){
                            var data=me.down('form').getForm().getValues();
                            if(me.callBack){
                                data=Ext.encode(data);
                                me.callBack(data);
                            }
                            me.close();
                        }
                    },
                    {
                        text:'取消',
                        handler:function(){
                            me.close();
                        }
                    }
                ],
                items:[
                    {
                        xtype      : 'fieldcontainer',
                        fieldLabel : '会签模式',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items:[
                            {
                                boxLabel  : '按人数',
                                name      : 'signType',
                                inputValue: '1',
                                checked:data.signType==1 || !me.data,
                                listeners:{
                                    change : function(checkbox, newValue, oldValue){
                                        var numberfield=me.down('form').down('numberfield');
                                        numberfield.reset();
                                        numberfield.setFieldLabel('会签通过率(%)');
                                        numberfield.setMaxValue(100);
                                    }
                                }
                            },
                            {
                                boxLabel  : '按百分比',
                                name      : 'signType',
                                inputValue: '2',
                                checked:data.signType==2,
                                listeners:{
                                    change : function(checkbox, newValue, oldValue){
                                        var numberfield=me.down('form').down('numberfield');
                                        numberfield.reset();
                                        numberfield.setFieldLabel('会签通过人数');
                                        numberfield.setMaxValue(9999999999);
                                    }
                                }
                            } 
                        ]
                    },{
                        border:false,
                        items:[
                            {
                                xtype: 'numberfield',
                                anchor: '100%',
                                name: 'num',
                                allowBlank:false,
                                value:data.num,
                                fieldLabel: '会签通过人数',
                                minValue: 0,
                                maxValue:9999999999,
                                hideTrigger: true,
                                keyNavEnabled: false,
                                mouseWheelEnabled: false
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
});