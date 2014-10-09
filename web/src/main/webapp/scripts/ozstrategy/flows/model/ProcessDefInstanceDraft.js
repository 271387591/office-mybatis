/**
 * Created by lihao on 9/28/14.
 */
Ext.define('FlexCenter.flows.model.ProcessDefInstanceDraft',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'description',
        'version',
        'processDefId',
        'processDefName',
        'sendEmail',
        'fileAttachOne',
        'fileAttachTwo',
        'fileAttachThree',
        'formData',
        'fileAttachOneName',
        'fileAttachTwoName',
        'fileAttachThreeName',
        'creatorId',
        'creatorFullName',
        'lastUpdaterId',
        'lastUpdaterFullName',
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }}
    ]
});