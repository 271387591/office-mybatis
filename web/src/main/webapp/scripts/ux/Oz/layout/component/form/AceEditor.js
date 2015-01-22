/**
 * Created by .
 * User: wangy
 * Date: 11/18/11
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.layout.component.form.AceEditor', {
  extend: 'Ext.layout.component.field.Field',
  alias: ['layout.aceeditorfield'],

  type: 'aceeditorfield',

  finishedLayout: function (ownerContext){
    var me = this;

    var owner = ownerContext.target;
    var ow = owner.getWidth(),
        oh= owner.getHeight(),
        w = ow - (owner.fieldLabel && owner.labelAlign !== 'top' ? owner.labelWidth : 5),
        h = oh - (!owner.fieldLabel || owner.labelAlign !== 'top' ? 0 : 21);

    if (!owner.allowBlank) {
      w -= 20;
    }

    if (me.owner.editor){
//      me.owner.editor.resize(me.width, me.height);
      me.owner.editor.renderer.onResize(false, null, w, h);
    }
    me.owner.innerCt.setSize(w, h);
    me.callParent(arguments);
  }
});