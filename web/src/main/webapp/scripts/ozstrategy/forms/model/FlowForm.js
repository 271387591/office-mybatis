/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.model.FlowForm',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'description',
        'content',
        'displayName',
        'enabled',
        'status',
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        'fields'
    ],
    hasMany: [
        { model: 'FlexCenter.forms.model.FormField', name: 'fields' }
    ]

});
