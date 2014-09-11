/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-01
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.model.Feature', {
    extend: 'Ext.data.Model',

    fields: [
      {name: 'id', type: 'int'},
      {name: 'criteria', type: 'string'},
      {name: 'name', type: 'string'},
      {name: 'displayName', type: 'string'},
      {name: 'description', type: 'string'},
      {name: 'createDate', convert:function(v){
          return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
      }},
      {name: 'lastUpdateDate',convert:function(v){
          return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
      }}
    ]
  }
);