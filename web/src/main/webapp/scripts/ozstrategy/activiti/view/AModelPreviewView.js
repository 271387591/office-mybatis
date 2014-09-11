/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/14/13
 * Time: 7:28 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelPreviewView',{
    requires:[
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.aModelPreviewView',
    itemId:'aModelPreviewView',
    layout:'border',
    autoScroll:true,
    border:false,
    initComponent:function(){
        var me=this;
        me.items=[
            {
                title:'流程示意图',
                region:'center',
                margin:'0 0 2 0',
                autoScroll:true,
                html:'<div style="padding: 20px 0 0 10px;">'+this.record.diagramHtml+'</div>'//this.record.diagramHtml//'<img src="'+__ctxPath+ '/jbpmImage?defId='+this.defId+ '&rand='+Math.random()+'"/>'
            },
            {
                title:'流程描述',
                margin:'0 0 2 2',
                region:'east',
                xtype:'form',
                width:'25%',
                collapsible: true,
                autoScroll:true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items:[
                    {
                        xtype:'fieldset',
                        defaultType: 'displayfield',
                        layout: 'anchor',
                        data: this.record,
                        defaults: {
                            anchor: '100%'
                        },
                        border:false,
                        items:[
                            {
                                name: 'name',
                                fieldLabel: '流程名称',
                                readOnly:true,
                                labelWidth:60,
                                value:this.record.name
                            },
                            {
                                name: 'category',
                                fieldLabel: '流程分类',
                                readOnly:true,
                                labelWidth:60,
                                value:!this.record.category?'所有':this.record.category
                            },{
                                name: 'formName',
                                fieldLabel: '业务表单',
                                readOnly:true,
                                labelWidth:60,
                                value:this.record.formName
                            },{
                                xtype:'displayfield',
                                grow:true,
                                name: 'createTime',
                                fieldLabel: '创建时间',
                                readOnly:true,
                                labelWidth:60,
                                value:Ext.util.Format.date(new Date(this.record.createTime), 'Y-m-d H:i:s')
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
});
