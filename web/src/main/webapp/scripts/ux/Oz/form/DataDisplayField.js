Ext.define('Oz.form.DataDisplayField', {
  extend: 'Ext.form.field.Display',
  alias: 'widget.datadisplayfield',
  config: {
    formatValue:''
  },
  setValue: function (v) {
    this.value = v;
    this.setRawValue(this.formatDataValue(v));
    return this;
  },
  formatDataValue: function (val) {
    var me = this;
    if (val) {
      if (Ext.isDate(val)) {
        return Ext.Date.format(val, me.formatValue);
      } else {
        return val;
      }
    } else {
      return '';
    }
  }
});
