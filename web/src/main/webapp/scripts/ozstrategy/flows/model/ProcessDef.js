/**
 * Created by lihao on 9/10/14.
 */
Ext.define('FlexCenter.flows.model.ProcessDef',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'documentation',
        'version',
        'actDefId',
        'actResId',
        'graphResId',
        'modelId',
        'depId',
        'flowFormId',
        'flowFormName',
        'category',
        'globalTypeId',
        'userIds',
        'userFullNames',
        'roleIds',
        'roleNames',
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        'parentId',
        'children'
    ],
    hasMany: [
        { model: 'FlexCenter.flows.model.ProcessDef', name: 'children' }
    ]

});
