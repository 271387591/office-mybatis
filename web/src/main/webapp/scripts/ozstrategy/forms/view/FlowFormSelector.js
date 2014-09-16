/**
 * Created by lihao on 9/12/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormSelector', {
    requires: [
        'FlexCenter.forms.view.FlowFormView'
    ],
    extend: 'Ext.Window',
    alias: 'widget.flowFormSelector',
    itemId: 'flowFormSelector',
    title: '表单选择器',
    shim: false,
    modal: true,
    layout: 'fit',
    width:600,
    height:400,
    initComponent:function(){
        var me=this,rec=me.rec;
        me.items=[
            {
                xtype:'flowFormView',
                selectorSingle:me.selectorSingle,
                selector:true
            }
        ];
        me.buttons= [
            {
                text: '确定',
                formBind: true,
                scope: me,
                handler: me.onSubmitClick
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ]
        me.callParent(arguments);
    },
    onSubmitClick: function () {
        var me = this;
        var selMode = me.down('flowFormView').down('grid').getSelectionModel();
        var hasSelect = selMode.hasSelection();
        if (hasSelect) {
            var records = selMode.getSelection();
            var selectedId = [];
            var selectedValue = [];
            var selectUserName = [];
            var callBackRecords = [];
            Ext.Array.each(records, function (record, index, recordsItSelf) {
                selectedId.push(record.data.id);
                selectedValue.push(record.data.name);
                callBackRecords.push({value: record.data.id,label: record.data.name});
            });
            if (me.returnObj && me.returnObj == true) {
                if (me.resultBack) {
                    me.resultBack(selectedId.join(','), selectedValue.join(','),callBackRecords);
                    me.close();
                }
            }else{
                if (me.resultBack) {
                    me.resultBack(selectedId.join(','), selectedValue.join(','));
                    me.close();
                }
            }

        } else {
            Ext.MessageBox.show({
                title: '提示消息',
                width: 200,
                msg: '对不起，请选择表单',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    }
});

