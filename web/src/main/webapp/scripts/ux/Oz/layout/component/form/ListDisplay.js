/**
 * Created by .
 * User: wangy
 * Date: 11/18/11
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.layout.component.form.ListDisplay', {
  extend: 'Ext.layout.component.field.Field',
  alias: ['layout.listdisplayfield'],

  type: 'listdisplayfield',

  finishedLayout: function(ownerContext){
    var me = this;
    var owner = this.owner;

    this.callParent(arguments);
    ownerContext.labelStrategy.finishedLayout(ownerContext, owner);
    ownerContext.errorStrategy.finishedLayout(ownerContext, owner);

//    if (!owner.minOwnerWidth)
//      owner['minOwnerWidth'] = owner.getWidth();
//
//    if (owner.minOwnerWidth && owner.getWidth() >= owner.minOwnerWidth){
//      owner.el.setStyle('width',owner.getWidth() - me.owner.btn.getWidth() - 10);
//      me.owner.btn.el.alignTo(owner.el,'tr');
//    }
  }
});