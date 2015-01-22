/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 10/28/11
 * Time: 1:43 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.picker.Month', {
  extend: 'Ext.picker.Date',
  requires: [        'Ext.picker.Date'    ],
//    alias: 'widget.oz_monthpicker',
  alternateClassName: 'Oz.form.MonthPicker',

  show : function() {
    this.callParent(arguments);
    // this.picker.hideMonthPicker(true);
    this.showMonthPicker();
//    this.monthBtn.fireEvent('click');
  },

  onOkClick: function(picker, value) {
    var me = this,
      month = value[0],
      year = value[1],
      date = new Date(year, month, me.getActive().getDate());

    if (date.getMonth() !== month) {
      // 'fix' the JS rolling date conversion if needed
      date = new Date(year, month, 1).getLastDateOfMonth();
    }
    me.update(date);
    this.fireEvent('select', this, date);
    this.hideMonthPicker();
  }
});