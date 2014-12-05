/**
 * Created by lihao on 9/12/14.
 */
Ext.define('FlexCenter.forms.view.FormPreviewWindow',{
    requires:[
        'FlexCenter.forms.view.FormPreview'
    ],
    extend:'Ext.Window',
    alias: 'widget.formPreviewWindow',
    itemId:'formPreviewWindow',
    width:1000,
    autoHeight:true,
    maxHeight:600,
    modal:true,
    shim:false,
    title:flowFormRes.flowFormView.preview,
    autoScroll:true,
    border:false,
    initComponent:function(){
        var me=this;
        me.buttons=[
            {
                xtype: 'button',
                text: globalRes.buttons.close,
                handler: function(){
                    me.close();
                }
            },
            {
                xtype: 'button',
                text: '取值',
                hidden:true,
                handler: function(){
                    var data = me.down('formPreview').getFormValue();
                    console.log('data',data);
                }
            }
        ];
        me.items=[
            {
                xtype:'formPreview',
                formHtml:me.formHtml
            }
        ];
        me.callParent();
    }
});
