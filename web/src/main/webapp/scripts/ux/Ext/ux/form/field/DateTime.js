/*
 * Copyright 2013 Netherlands eScience Center
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides a datetime input field with a date picker and time dropdown.
 * The field is automiticly validated.
 *
 * Derived from [Sencha Forum](http://www.sencha.com/forum/showthread.php?134345-Ext.ux.form.field.DateTime)
 *
 * Example usage:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'Time Range',
 *         width: 340,
 *         bodyPadding: 10,
 *         height: 400,
 *         renderTo: Ext.getBody(),
 *         fieldDefaults: {
 *             labelAlign: 'left',
 *             labelWidth: 40,
 *             anchor: '100%'
 *         },
 *         items: [{
 *             xtype: 'xdatetime',
 *             name: 'from',
 *             fieldLabel: 'From',
 *             value: '2013-01-01T12:00:00Z',
 *             maxValue: '2014-01-01T12:00:00Z'
 *         }, {
 *             xtype: 'xdatetime',
 *             name: 'to',
 *             fieldLabel: 'To',
 *             minValue: '2013-01-01T12:00:00Z',
 *             value: '2014-01-01T12:00:00Z'
 *        }]
 *     });
 */
Ext.define('Ext.ux.form.field.DateTime', {
  extend : 'Ext.form.FieldContainer',
  mixins : {
    field : 'Ext.form.field.Field'
  },
  requires: [
    'Ext.form.field.VTypes',
    'Ext.form.field.Date',
    'Ext.form.field.Time'
  ],
  alias : 'widget.xdatetime',
  //configurables
  combineErrors : false,
  msgTarget : 'under',
  layout : 'hbox',
  readOnly : false,
  /**
   * @cfg {String} dateFormat
   * The default is 'Y-m-d'
   */
  dateFormat : 'Y-m-d',
  /**
   * @cfg {String} timeFormat
   * The default is 'H:i:s'
   */
  timeFormat : 'H:i:s',
  /**
   * @cfg {String} dateTimeFormat
   * The format used when submitting the combined value.
   * Defaults to 'c' (ISO8601 format)
   */
  dateTimeFormat : 'c',
  labelAttrTpl : 'data-qtip="Format YYYY-MM-DD HH:MM:SS"',
  /**
   * @cfg {Object} dateConfig
   * Additional config options for the date field.
   */
  dateConfig : {},
  /**
   * @cfg {Object} timeConfig
   * Additional config options for the time field.
   */
  timeConfig : {},

  // properties

  dateValue : null, // Holds the actual date
  /**
   * @property dateField
   * @type Ext.form.field.Date
   */
  dateField : null,
  /**
   * @property timeField
   * @type Ext.form.field.Time
   */
  timeField : null,
  initComponent : function() {
    var me = this;
    me.items = me.items || [];

    me.dateField = Ext.create('Ext.form.field.Date', Ext
        .apply({
          format : me.dateFormat,
          flex : 1,
          allowBlank : me.allowBlank,
          reset : Ext.emptyFn,
          getSubmitData: function(){
            return null;
          },
          getModelData: function(){
            return null;
          },
          submitValue : false
        }, me.dateConfig));
    me.items.push(me.dateField);

    me.timeField = Ext.create('Ext.form.field.Time', Ext
        .apply({
          format : me.timeFormat,
          flex : 1,
          allowBlank : me.allowBlank,
          reset : Ext.emptyFn,
          getSubmitData: function(){
            return null;
          },
          getModelData: function(){
            return null;
          },
          submitValue : false
        }, me.timeConfig));
    me.items.push(me.timeField);

    for ( var i = 0; i < me.items.length; i++) {
      me.items[i].on('focus', Ext
          .bind(me.onItemFocus, me));
      me.items[i].on('blur', Ext.bind(me.onItemBlur, me));
      me.items[i]
          .on(
          'specialkey',
          function(field, event) {
            var key = event.getKey(), tab = key == event.TAB;

            if (tab
                && me.focussedItem == me.dateField) {
              event.stopEvent();
              me.timeField.focus();
              return;
            }

            me.fireEvent('specialkey',
                field, event);
          });
    }

    Ext.apply(Ext.form.field.VTypes, {
      daterange : function(val, field) {
        var date = val;

        if (!date) {
          return false;
        }
        if (field.startDateField
            && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
            .getTime()))) {
          var start = field.up('form').down('#' + field.startDateField);
          start.setMaxValue(date);
          this.dateRangeMax = date;
        } else if (field.endDateField
            && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
            .getTime()))) {
          var end = field.up('form').down('#' + field.endDateField);
          end.setMinValue(date);
          this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
      },
      daterangeText : 'Start date must be less than end date'
    });

    me.callParent();
    me.initField();
  },
  focus : function() {
    this.callParent();
    this.dateField.focus();
  },
  onItemFocus : function(item) {
    if (this.blurTask)
      this.blurTask.cancel();
    this.focussedItem = item;
  },
  onItemBlur : function(item) {
    var me = this;
    if (item != me.focussedItem)
      return;
    // 100ms to focus a new item that belongs to us, otherwise we will assume the user left the field
    me.blurTask = new Ext.util.DelayedTask(function() {
      me.fireEvent('blur', me);
    });
    me.syncValue();
    me.blurTask.delay(100);
  },
  getValue : function() {
    var value = null, date = this.dateField
        .getSubmitValue(), time = this.timeField
        .getSubmitValue();

    if (date) {
      if (time) {
        var format = this.getFormat();
        value = Ext.Date.parse(date + 'T' + time,
            format);
      } else {
        value = this.dateField.getValue();
      }
    }
    return value;
  },
  getSubmitValue : function() {
    var value = this.getValue();
    return value ? Ext.Date.format(value,
        this.dateTimeFormat) : null;
  },
  // Synchronizes the submit value with the current state of the toStore
  syncValue: function() {
    var me = this;
    me.mixins.field.setValue.call(me, me.getValue());
  },
  setValue : function(value) {
    if (Ext.isString(value)) {
      value = Ext.Date.parse(value, this.dateTimeFormat);
    }
    this.dateField.setValue(value);
    this.timeField.setValue(value);
    this.syncValue();
  },
  getFormat : function() {
    return (this.dateField.submitFormat || this.dateField.format)
//        + "T"
        + (this.timeField.submitFormat || this.timeField.format);
  },
  // Bug? A field-mixin submits the data from getValue, not getSubmitValue
  getSubmitData : function() {
    var me = this, data = null;
    if (!me.disabled && me.submitValue
        && !me.isFileUpload()) {
      data = {};
      data[me.getName()] = '' + me.getSubmitValue();
    }
    return data;
  },
  setMaxValue : function(dt) {
    this.dateField.setMaxValue(dt);
  },
  setMinValue : function(dt) {
    this.dateField.setMinValue(dt);
  },
  getErrors : function(value) {
    var me = this;
    var errors = [];
    var vtype = me.vtype;
    var vtypes = Ext.form.field.VTypes;
    value = value || me.getValue();

    errors = errors.concat(this.dateField.getErrors());
    errors = errors.concat(this.timeField.getErrors());

    if (vtype) {
      if (!vtypes[vtype](value, me)) {
        errors.push(me.vtypeText
            || vtypes[vtype + 'Text']);
      }
    }
    return errors;
  }
});