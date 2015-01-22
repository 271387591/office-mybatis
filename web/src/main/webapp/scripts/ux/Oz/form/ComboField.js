/**
 * Created by .
 * User: liaodongming
 * Date: 11-10-26
 * Time: PM11:15
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.ComboField',{
  extend: 'Ext.form.ComboBox',
  alias: 'widget.comboTriggerField',

  trigger1Cls: Ext.baseCSSPrefix + 'form-arrow-trigger',

  trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',

  showButton : false,

  onButtonClick : Ext.emptyFn,

  afterRender:function(){
    var me = this;
    me.callParent();
    if(me.showButton == false){

       me.triggerEl.item(1).setDisplayed('none');
    }
  },
  onTrigger1Click : function(){
        var me = this;
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                me.onFocus({});
                if (me.triggerAction === 'all') {
                    me.doQuery(me.allQuery, true);
                } else {
                    me.doQuery(me.getRawValue());
                }
            }
            me.inputEl.focus();
        }
    },

  onTrigger2Click : function() {
    var me = this;
    if (me.disabled)
      return;
    me.onButtonClick();

  }
});
