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
    width:1010,
    autoHeight:true,
    minHeight:500,
    modal:true,
    shim:false,
    title:'表单预览',
    autoScroll:true,
    initComponent:function(){
        var me=this;
        me.buttons=[{
            xtype: 'button',
            text: globalRes.buttons.close,
            handler: function(){
                me.close();
            }
        }];
        me.items=[
            {
                xtype:'formPreview',
                formHtml:me.formHtml
            }
        ];
        me.callParent();
    }
});
