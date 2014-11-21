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
        'flowFormId',
        'flowFormName',
        'category',
        'globalTypeId',
        'userIds',
        'userFullNames',
        'roleIds',
        'roleNames',
        'suspended',
        'formHtml',
        {name:'deployDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'createDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }},
        {name:'lastUpdateDate',convert:function(v){
            if(v){
                return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
            }
            return null;
        }}
    ]

});
