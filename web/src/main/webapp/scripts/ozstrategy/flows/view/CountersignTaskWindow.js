/**
 * Created by lihao on 10/23/14.
 */
Ext.define('FlexCenter.flows.view.CountersignTaskWindow',{
    requires:[
    ],
    extend:'Ext.Window',
    alias: 'widget.countersignTaskWindow',
    title: workFlowRes.countersignTaskWindow.title,
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
                        text:globalRes.buttons.ok,
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
                        text:globalRes.buttons.cancel,
                        handler:function(){
                            me.close();
                        }
                    }
                ],
                items:[
                    {
                        xtype      : 'fieldcontainer',
                        fieldLabel : workFlowRes.countersignTaskWindow.signType,
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items:[
                            {
                                boxLabel  : workFlowRes.countersignTaskWindow.signTypePerson,
                                name      : 'signType',
                                inputValue: '1',
                                checked:data.signType==1 || !me.data,
                                listeners:{
                                    change : function(checkbox, newValue, oldValue){
                                        var numberfield=me.down('form').down('numberfield');
                                        numberfield.reset();
                                        numberfield.setFieldLabel(workFlowRes.countersignTaskWindow.signTypeCenTitle);
                                        numberfield.setMaxValue(100);
                                    }
                                }
                            },
                            {
                                boxLabel  : workFlowRes.countersignTaskWindow.signTypePercent,
                                name      : 'signType',
                                inputValue: '2',
                                checked:data.signType==2,
                                listeners:{
                                    change : function(checkbox, newValue, oldValue){
                                        var numberfield=me.down('form').down('numberfield');
                                        numberfield.reset();
                                        numberfield.setFieldLabel(workFlowRes.countersignTaskWindow.signTypeSonTitle);
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
                                fieldLabel: workFlowRes.countersignTaskWindow.signTypeSonTitle,
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