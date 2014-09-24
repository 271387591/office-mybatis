/**
 * Created by lihao on 9/24/14.
 */
Ext.define('FlexCenter.flows.view.ProcessDefAuthorityWindow',{
    requires:[
    ],
    extend:'Ext.Window',
    alias: 'widget.processDefAuthorityWindow',
    title:workFlowRes.settingFlowRole,
    animCollapse : true,
    layout: 'fit',
    width:400,
    rec:{},
    modal:true,
    border:false,
    initComponent:function(){
        var me=this;
        me.items = [
            {
                xtype:'form',
                margin:1,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items:[
                    {
                        xtype:'container',
                        layout:'hbox',
                        items:[
                            {
                                xtype:'hidden',
                                name:'userIds',
                                value:me.rec.get('userIds'),
                                itemId:'flowAuthority_username_hidden'
                            },
                            {
                                fieldLabel:workFlowRes.flowUserFeature,
                                width : 255,
                                name : 'userFullNames',
                                itemId:'flowAuthority_username',
                                xtype : 'textarea',
                                value:me.rec.get('userFullNames'),
                                editable:false,
                                margins:'5 10 10 0',
                                maxLength : 2000
                            },{
                                margins:'5 0 0 5',
                                xtype:'button',
                                text:userRoleRes.changeUsers,
                                handler:function(){
                                    Ext.widget('userSelector',{
                                        resultBack:function(ids,values,usernames){
                                            me.down('form').down('#flowAuthority_username').setValue(values);
                                            me.down('form').down('#flowAuthority_username_hidden').setValue(ids);
                                        }
                                    }).show();
                                }
                            }
                        ]
                    },
                    {
                        xtype:'container',
                        layout:'hbox',
                        items:[
                            {
                                xtype:'hidden',
                                name:'roleIds',
                                value:me.rec.get('roleIds'),
                                itemId:'flowAuthority_roleId_hidden'
                            },
                            {
                                fieldLabel:userRoleRes.roleFeatures,
                                width : 255,
                                name : 'roleNames',
                                xtype : 'textarea',
                                value:me.rec.get('roleNames'),
                                margins:'5 10 10 0',
                                itemId:'flowAuthority_roleId',
                                maxLength : 2000
                            },{
                                margins:'5 0 0 5',
                                xtype:'button',
                                text:userRoleRes.changeRoles,
                                handler:function(){
                                    Ext.widget('roleSelector',{
                                        resultBack: function(ids,names){
                                            me.down('form').down('#flowAuthority_roleId').setValue(names);
                                            me.down('form').down('#flowAuthority_roleId_hidden').setValue(ids);
                                        }
                                    }).show();
                                }
                            }
                        ]
                    }
                ]

            }
        ];
        me.buttons=[
            {
                text:globalRes.buttons.save,
                handler:function(){
                    var data = me.down('form').getValues();
                    data.id=me.rec.get('id');
                    me.fireEvent('authorization',me,data);
                }
            },{
                text:globalRes.buttons.close,
                handler:function(){
                    me.close();
                }
            }
        ];
        me.callParent();
    }
});