/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 10/28/11
 * Time: 1:44 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.Month', {
  extend:'Ext.form.field.Date',
  alias: 'widget.monthfield',
  requires: ['Oz.picker.Month'],
  alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],

  format: 'm/Y',

  createPicker: function() {
    var me = this,
        format = Ext.String.format,
        picker = Ext.create('Oz.picker.Month', {
          ownerCt: this.ownerCt,
          renderTo: document.body,
          floating: true,
          hidden: true,
          focusOnShow: true,
          minDate: me.minValue,
          maxDate: me.maxValue,
          disabledDatesRE: me.disabledDatesRE,
          disabledDatesText: me.disabledDatesText,
          disabledDays: me.disabledDays,
          disabledDaysText: me.disabledDaysText,
          format: me.format,
          showToday: me.showToday,
          startDay: me.startDay,
          minText: format(me.minText, me.formatDate(me.minValue)),
          maxText: format(me.maxText, me.formatDate(me.maxValue)),
          listeners: {
            scope: me,
            select: me.onSelect
          }
        });
    // Add handler for Escape key to close the picker
    picker.keyNav.esc = function() {
      me.collapse();
    };
    return picker;
  }
});