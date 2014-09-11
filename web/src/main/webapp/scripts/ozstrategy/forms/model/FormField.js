/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.model.FormField',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
//        'label',
//        'xtype',
//        'html',
        'flowFormId',
//        {name:'createDate',convert:function(v){
//            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
//        }},
//        {name:'lastUpdateDate',convert:function(v){
//            return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
//        }}
    ]
});
