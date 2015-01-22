/**
 * Created by .
 * User: wangy
 * Date: 11/18/11
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.layout.component.form.PickList', {
  extend: 'Ext.layout.component.field.Field',
  alias: ['layout.picklistfield'],

  type: 'picklistfield',

//  sizeBodyContents: function(width, height) {
//    var me = this;
//
//    if (!Ext.isNumber(height)) {
//      height = me.defaultHeight;
//    }
//
//    me.owner.innerCt.setSize(width, height);
//  }

  finishedLayout: function(ownerContext){
     var me = this;
     me.callParent(arguments);

    var owner = ownerContext.target;
    me.owner.innerCt.setSize(owner.getWidth(), owner.getHeight());
  }
});