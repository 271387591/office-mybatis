/**
 * @docauthor Rinco <rinco@21cn.com>
 *
 * Provides a date input field with a {@link Ext.ex.picker.DateTime datetime picker} dropdown and automatic date
 * validation.
 *
 * This field recognizes and uses the JavaScript Date object as its main {@link #value} type. In addition,
 * it recognizes string values which are parsed according to the {@link #format} and/or {@link #altFormats}
 * configs. These may be reconfigured to use date formats appropriate for the user's locale.
 *
 * The field may be limited to a certain range of dates by using the {@link #minValue}, {@link #maxValue},
 * {@link #disabledDays}, and {@link #disabledDates} config parameters. These configurations will be used both
 * in the field's validation, and in the datetime picker dropdown by preventing invalid dates from being selected.
 *
 * # Example usage
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 300,
 *         bodyPadding: 10,
 *         title: 'Dates',
 *         items: [{
 *             xtype: 'datefield',
 *             anchor: '100%',
 *             fieldLabel: 'From',
 *             name: 'from_datetime',
 *             maxValue: new Date()  // limited to the current date or prior
 *         }, {
 *             xtype: 'datetimefield',
 *             anchor: '100%',
 *             fieldLabel: 'To',
 *             name: 'to_date',
 *             value: new Date()  // defaults to today
 *         }]
 *     });
 *
 * # Date Formats Examples
 *
 * This example shows a couple of different date format parsing scenarios. Both use custom date format
 * configurations; the first one matches the configured `format` while the second matches the `altFormats`.
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 300,
 *         bodyPadding: 10,
 *         title: 'Dates',
 *         items: [{
 *             xtype: 'datetimefield',
 *             anchor: '100%',
 *             fieldLabel: 'Datetime',
 *             name: 'datetime',
 *             // The value matches the format; will be parsed and displayed using that format.
 *             format: 'm d Y H:i:s',
 *             value: '2 4 1978 00:00:00'
 *         }, {
 *             xtype: 'datetimefield',
 *             anchor: '100%',
 *             fieldLabel: 'Date',
 *             name: 'date',
 *             // The value does not match the format, but does match an altFormat; will be parsed
 *             // using the altFormat and displayed using the format.
 *             format: 'm d Y H:i:s',
 *             altFormats: 'm,d,Y H:is|m.d.Y H:is',
 *             value: '2.4.1978 00:00:00'
 *         }]
 *     });
 */
Ext.define('Ext.ux.form.DateTimeField', {
    extend:'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['Ext.ux.form.DateTimePicker'],
    alternateClassName: ['Ext.form.DateTimeField', 'Ext.form.DateTime'],

    //<locale>
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse}.
     */
    format : "m/d/Y H:i:s",
    //</locale>
    /**
     * @cfg {Boolean} showTime
     * false to hide the footer area of the Time spinner for selects the current time.
     */
    showTime : true,

    initComponent : function(){
        var me = this;
        me.callParent();
    },

    initValue: function() {
        var me = this;
        me.callParent();
    },

    createPicker: function() {
        var me = this,
            format = Ext.String.format;

        return new Ext.ux.form.DateTimePicker({
            pickerField: me,
            ownerCt: me.ownerCt,
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
            showTime: me.showTime,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },

    /**
     * @private
     * Sets the DateTime picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var value = this.getValue();
        //this.picker.setValue(Ext.isDate(value) ? value : new Date());
        
        value = Ext.isDate(value) ? value : Ext.Date.clearTime(new Date());

        this.picker.setValue(value);
    }
});
