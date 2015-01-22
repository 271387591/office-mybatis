/**
 * Created with IntelliJ IDEA.
 * User: yongliu
 * Date: 3/14/13
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.TreePicker', {
  extend:'Ext.ux.TreePicker',
  xtype:'oztreepicker',

  /**
   * @canNotSelectFolder to control when select the folder
   * can not set the folder value
   * default is true
   */
  canNotSelectFolder: true,

  /**
   * @rootVisible show or hide the root folder
   * default is false not show
   */
  rootVisible: false,


  /**
   * Creates and returns the tree panel to be used as this field's picker.
   * @private
   */
  createPicker: function() {
    var me = this,
      picker = Ext.create('Ext.tree.Panel', {
        store: me.store,
        floating: true,
        hidden: true,
        displayField: me.displayField,
        columns: me.columns,
        maxHeight: me.maxTreeHeight,
        shadow: false,
        manageHeight: false,
        rootVisible : me.rootVisible,
        listeners: {
          itemclick: Ext.bind(me.onItemClick, me)
        },
        viewConfig: {
          listeners: {
            render: function(view) {
              view.getEl().on('keypress', me.onPickerKeypress, me);
            }
          }
        }
      }),
      view = picker.getView();

    view.on('render', me.setPickerViewStyles, me);

    if (Ext.isIE9 && Ext.isStrict) {
      // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
      // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
      view.on('highlightitem', me.repaintPickerView, me);
      view.on('unhighlightitem', me.repaintPickerView, me);
      view.on('afteritemexpand', me.repaintPickerView, me);
      view.on('afteritemcollapse', me.repaintPickerView, me);
    }
    return picker;
  },

  /**
   * Changes the selection to a given record and closes the picker
   * @private
   * @param {Ext.data.Model} record
   */
  selectItem: function(record) {
    var me = this;
    if(me.canNotSelectFolder){
      if(record.get('leaf')){
        me.setValue(record.get('id'));
        me.picker.hide();
        me.inputEl.focus();
        me.fireEvent('select', me, record);
        me.fireEvent('dirtychange', me, me.isDirty());
      }
    } else {
      me.setValue(record.get('id'));
      me.picker.hide();
      me.inputEl.focus();
      me.fireEvent('select', me, record);
      me.fireEvent('dirtychange', me, me.isDirty());
    }
  }
});