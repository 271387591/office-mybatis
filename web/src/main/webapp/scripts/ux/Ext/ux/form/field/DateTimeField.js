/**
 * Created by zhubq on 14-7-24.
 */
Ext.define('Ext.ux.form.field.TimePickerField', {
  extend: 'Ext.form.field.Base',
  alias: 'widget.timepickerfield',
  alternateClassName: 'Ext.ux.form.field.TimePickerField',
  requires: [ 'Ext.form.field.Number' ],

  /**
   * hidden basefield's input
   */
  inputType: 'hidden',

  style: 'padding:4px 0 0 0;margin-bottom:0px',

  /**
   * @cfg {String} value initValue, format: 'H:i:s'
   */
  value: null,

  /**
   * number input config
   */
  spinnerCfg: {
    width: 40
  },

  /** Override. */
  initComponent: function () {
    var me = this;

    me.value = me.value || Ext.Date.format(new Date(), 'H:i:s');

    me.callParent();// called setValue  

    me.spinners = [];
    var cfg = Ext.apply({}, me.spinnerCfg, {
      readOnly: me.readOnly,
      disabled: me.disabled,
      style: 'float: left',
      listeners: {
        change: {
          fn: me.onSpinnerChange,
          scope: me
        }
      }
    });

    me.hoursSpinner = Ext.create('Ext.form.field.Number', Ext.apply({editable: false}, cfg, {
      minValue: 0,
      maxValue: 23
    }));
    me.minutesSpinner = Ext.create('Ext.form.field.Number', Ext.apply({editable: false}, cfg, {
      minValue: 0,
      maxValue: 59
    }));
    me.secondsSpinner = Ext.create('Ext.form.field.Number', Ext.apply({editable: false}, cfg, {
      minValue: 0,
      maxValue: 59
    }));

    me.spinners.push(me.hoursSpinner, me.minutesSpinner, me.secondsSpinner);

  },
  /**
   * @private Override.
   */
  onRender: function () {
    var me = this, spinnerWrapDom, spinnerWrap;
    me.callParent(arguments);

    // render to original BaseField input td  
    // spinnerWrap = Ext.get(Ext.DomQuery.selectNode('div', this.el.dom));  
    // // 4.0.2  
    spinnerWrapDom = Ext.dom.Query.select('td', this.getEl().dom)[1]; // 4.0  
    // ->4.1  
    // div->td  
    spinnerWrap = Ext.get(spinnerWrapDom);
    me.callSpinnersFunction('render', spinnerWrap);

    Ext.core.DomHelper.append(spinnerWrap, {
      tag: 'div',
      cls: 'x-form-clear-left'
    });

    this.setRawValue(this.value);
  },

  _valueSplit: function (v) {
    if (Ext.isDate(v)) {
      v = Ext.Date.format(v, 'H:i:s');
    }
    var split = v.split(':');
    return {
      h: split.length > 0 ? split[0] : 0,
      m: split.length > 1 ? split[1] : 0,
      s: split.length > 2 ? split[2] : 0
    };
  },
  onSpinnerChange: function () {
    if (!this.rendered) {
      return;
    }
    this.fireEvent('change', this, this.getValue(), this.getRawValue());
  },
  //call each spinner's function  
  callSpinnersFunction: function (funName, args) {
    for (var i = 0; i < this.spinners.length; i++) {
      this.spinners[i][funName](args);
    }
  },
  // @private get time as object,  
  getRawValue: function () {
    if (!this.rendered) {
      var date = this.value || new Date();
      return this._valueSplit(date);
    } else {
      return {
        h: this.hoursSpinner.getValue(),
        m: this.minutesSpinner.getValue(),
        s: this.secondsSpinner.getValue()
      };
    }
  },

  // private  
  setRawValue: function (value) {
    value = this._valueSplit(value);
    if (this.hoursSpinner) {
      this.hoursSpinner.setValue(value.h);
      this.minutesSpinner.setValue(value.m);
      this.secondsSpinner.setValue(value.s);
    }
  },
  // overwrite  
  getValue: function () {
    var v = this.getRawValue();
    return Ext.String.leftPad(v.h, 2, '0') + ':' + Ext.String.leftPad(v.m, 2, '0') + ':' + Ext.String.leftPad(v.s, 2, '0');
  },
  // overwrite  
  setValue: function (value) {
    this.value = Ext.isDate(value) ? Ext.Date.format(value, 'H:i:s') : value;
    if (!this.rendered) {
      return;
    }
    this.setRawValue(this.value);
    this.validate();
  },
  // overwrite  
  disable: function () {
    this.callParent(arguments);
    this.callSpinnersFunction('disable', arguments);
  },
  // overwrite  
  enable: function () {
    this.callParent(arguments);
    this.callSpinnersFunction('enable', arguments);
  },
  // overwrite  
  setReadOnly: function () {
    this.callParent(arguments);
    this.callSpinnersFunction('setReadOnly', arguments);
  },
  // overwrite  
  clearInvalid: function () {
    this.callParent(arguments);
    this.callSpinnersFunction('clearInvalid', arguments);
  },
  // overwrite  
  isValid: function (preventMark) {
    return this.hoursSpinner.isValid(preventMark) && this.minutesSpinner.isValid(preventMark) && this.secondsSpinner.isValid(preventMark);
  },
  // overwrite  
  validate: function () {
    return this.hoursSpinner.validate() && this.minutesSpinner.validate() && this.secondsSpinner.validate();
  }
});

Ext.define('Ext.ux.DateTimePicker', {
  extend: 'Ext.picker.Date',
  alias: 'widget.datetimepicker',
  todayText: 'Today',
  timeLabel: 'Time',
  requires: [ 'Ext.ux.form.field.TimePickerField' ],
  currentValue: null,
  initComponent: function () {
    // keep time part for value  
    var value = this.value || new Date();
    this.callParent();
    this.value = value;
  },
  onRender: function (container, position) {
    if (!this.timefield) {
      this.timefield = Ext.create('Ext.ux.form.field.TimePickerField', {
        fieldLabel: this.timeLabel,
        labelWidth: 40,
        value: Ext.Date.format(this.value, 'H:i:s')
      });
    }
    this.timefield.ownerCt = this;
    this.timefield.on('change', this.timeChange, this);
    this.callParent(arguments);

    var table = Ext.get(Ext.DomQuery.selectNode('table', this.el.dom));
    var tfEl = Ext.core.DomHelper.insertAfter(table, {
      tag: 'div',
      style: 'border:0px;',
      children: [
        {
          tag: 'div',
          cls: 'x-datepicker-footer ux-timefield'
        }
      ]
    }, true);
    this.timefield.render(this.el.child('div div.ux-timefield'));

    var p = this.getEl().parent('div.x-layer');
    if (p) {
      p.setStyle("height", p.getHeight() + 31);
    }
  },
  // listener timefield change  
  timeChange: function (tf, time, rawtime) {
    this.value = this.fillDateTime(this.value);
  },
  // @private  
  fillDateTime: function (value) {
    if (this.timefield) {
      var rawtime = this.timefield.getRawValue();
      value.setHours(rawtime.h);
      value.setMinutes(rawtime.m);
      value.setSeconds(rawtime.s);
    }
    return value;
  },
  // @private  
  changeTimeFiledValue: function (value) {
    this.timefield.un('change', this.timeChange, this);
    this.timefield.setValue(this.value);
    this.timefield.on('change', this.timeChange, this);
  },

  // overwrite  
  setValue: function (value) {
    if (this.currentValue) {
      this.value = this.currentValue;
      this.currentValue = null;
      this.changeTimeFiledValue(this.value);
    } else {
      this.value = value;
    }
    return this.update(this.value, true);

  },
  // overwrite  
  getValue: function () {
    return this.fillDateTime(this.value);
  },

  // overwrite : fill time before setValue  
  handleDateClick: function (e, t) {
    var me = this, handler = me.handler;

    e.stopEvent();
    if (!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
      me.doCancelFocus = me.focusOnSelect === false;
      me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite:  
      // fill time  
      // before  
      // setValue  
      delete me.doCancelFocus;
      me.fireEvent('select', me, me.value);
      if (handler) {
        handler.call(me.scope || me, me, me.value);
      }
      me.onSelect();
    }
  },
  // overwrite : fill time before setValue  
  selectToday: function () {
    var me = this, btn = me.todayBtn, handler = me.handler;
    if (btn && !btn.disabled) {
      me.setValue(this.fillDateTime(new Date()));
      me.fireEvent('select', me, me.value);
      if (handler) {
        handler.call(me.scope || me, me, me.value);
      }
      me.onSelect();
    }
    return me;
  }
});
Ext.define('Ext.ux.form.field.DateTimeField', {
  extend: 'Ext.form.field.Date',
  alias: 'widget.datetimefield',
  requires: [ 'Ext.ux.DateTimePicker' ],
  todayText: 'Today',
  timeLabel: 'Time',
  initComponent: function () {
    this.callParent();
  },
  onExpand: function () {
    var value = this.getValue();
    this.picker.setValue(Ext.isDate(value) ? value : new Date());
  },
  // overwrite  
  createPicker: function () {
    var me = this, format = Ext.String.format;
    return Ext.create('Ext.ux.DateTimePicker', {
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
      startDay: me.startDay,
      minText: format(me.minText, me.formatDate(me.minValue)),
      maxText: format(me.maxText, me.formatDate(me.maxValue)),
      currentValue: me.value ? Ext.Date.parse(me.value, me.format) : new Date(),
      todayText: me.todayText,
      timeLabel: me.timeLabel,
      listeners: {
        scope: me,
        select: me.onSelect
      },
      keyNavConfig: {
        esc: function () {
          me.collapse();
        }
      }
    });
  },
  getValue: function () {
    return this.value;
  }
});  