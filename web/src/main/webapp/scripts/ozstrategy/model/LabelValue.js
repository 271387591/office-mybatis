/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-01
 * Time: 1:56 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.model.LabelValue', {
  extend: 'Ext.data.Model',

  requires:[
  ],

  fields: [
    {name: 'label', type: 'string'},
    {name: 'value', type: 'string'}
  ]
});