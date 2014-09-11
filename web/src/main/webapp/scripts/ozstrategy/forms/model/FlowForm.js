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
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        'parentId',
        'children',
        'fields'
    ],
    hasMany: [
        { model: 'FlexCenter.forms.model.FlowForm', name: 'children' },
        { model: 'FlexCenter.forms.model.FormField', name: 'fields' }
    ]

});
