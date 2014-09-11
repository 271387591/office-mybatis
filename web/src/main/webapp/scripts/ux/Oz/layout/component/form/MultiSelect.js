/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-11
 * Time: 1:57 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.layout.component.form.MultiSelect', {
    extend: 'Ext.layout.component.field.Field',
    alias: ['layout.itemmultiselectfield'],

    type: 'multiselectfield',

    /**
     * @cfg {Number} height The height of the field. Defaults to 200.
     */
    defaultHeight: 200,

    sizeBodyContents: function(width, height) {
      var me = this;

      if (!Ext.isNumber(height)) {
        height = me.defaultHeight;
      }

      if(me.owner.innerCt)
        me.owner.innerCt.setSize(width, height);
    }
  });