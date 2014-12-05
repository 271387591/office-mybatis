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
    title: flowFormRes.flowFormSelector.title,
    shim: false,
    modal: true,
    layout: 'fit',
    width:600,
    height:400,
    border:false,
    initComponent:function(){
        var me=this,rec=me.rec;
        me.items=[
            {
                xtype:'flowFormView',
                selector:true
            }
        ];
        me.buttons= [
            {
                text: globalRes.buttons.ok,
                formBind: true,
                scope: me,
                handler: me.onSubmitClick
            },
            {
                text: globalRes.buttons.cancel,
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
                title: globalRes.title.prompt,
                width: 200,
                msg: flowFormRes.flowFormSelector.prompt,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    }
});

