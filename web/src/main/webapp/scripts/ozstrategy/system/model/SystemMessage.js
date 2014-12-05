/**
 * Created by lihao on 12/1/14.
 */
Ext.define('FlexCenter.system.model.SystemMessage',{
    extend: 'Ext.data.Model',
    fields:[
        {name:'id', type:'long'},
        {name:'receiverId', type:'long'},
        {name:'receiverUsername'},
        {name:'receiverFullName'},
        'readFlag',
        'content',
        'contentMap',
        'type',
        {name:'createDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }},
        {name:'lastUpdateDate',convert:function(v){
            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
        }}
    ]
});