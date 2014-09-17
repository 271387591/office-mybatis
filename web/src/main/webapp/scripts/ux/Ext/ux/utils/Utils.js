Ext.define('Ext.ux.utils.Utils', {
  alternateClassName: 'Ext.ux.Utils',
  statics: {
    formatBoolean: function (value) {
      return !!(value && (value == true || value.toUpperCase() == 'true'.toUpperCase() || value.toUpperCase() == 'yes'.toUpperCase() || value.toUpperCase() == 'y'.toUpperCase()));
    },

    toDate: function (value) {
      if (value) {
        if (Ext.isString(value)) {
          return Ext.Date.parse(value, messages.global.time.format.dateFormat());
        } else {
          return value;
        }
      } else {
        return '';
      }
    },

    formatDate: function (value) {
      if (value) {
        if (Ext.isDate(value)) {
          return Ext.Date.format(value, messages.global.time.format.dateFormat());
        } else {
          return value;
        }
      } else {
        return '';
      }
    },

    formatDateTime: function (value) {
      if (value) {
        if (Ext.isDate(value)) {
          return Ext.Date.format(value, messages.global.time.format.datetimeFormat());
        } else {
          return value;
        }
      } else {
        return '';
      }
    },

    onDragDropViewRender: function (view) {
      var me = this;

      if (me.enableDrag) {
        me.dragZone = Ext.create('Ext.ux.dd.DragZone',{
          view: view,
          ddGroup: me.dragGroup || me.ddGroup,
          dragText: me.dragText
        });
      }

      if (me.enableDrop) {
        me.dropZone = Ext.create('Ext.grid.ViewDropZone',{
          view: view,
          ddGroup: me.dropGroup || me.ddGroup
        });
      }
    },

    cronExpressionValidator: function (cronExpression) {
//      var cronParams = cronExpression.split(" ");
//
//      if (cronParams.length < 6 || cronParams.length > 7) {
//        return messages.schedule.formMsg.cronExpression.validate.lengthError();
//      }
//
//      if (cronParams[3] == "?" || cronParams[5] == "?") {
//        //Check seconds param
//        if (!Global.Utils.checkSecondsField(cronParams[0])) {
//          return messages.schedule.formMsg.cronExpression.validate.secondsError();
//        }
//
//        //Check minutes param
//        if (!Global.Utils.checkMinutesField(cronParams[1])) {
//          return messages.schedule.formMsg.cronExpression.validate.minutesError();
//        }
//
//        //Check hours param
//        if (!Global.Utils.checkHoursField(cronParams[2])) {
//          return messages.schedule.formMsg.cronExpression.validate.hoursError();
//        }
//
//        //Check day-of-month param
//        if (!Global.Utils.checkDayOfMonthField(cronParams[3])) {
//          return messages.schedule.formMsg.cronExpression.validate.dayOfMonthError();
//        }
//
//        //Check months param
//        if (!Global.Utils.checkMonthsField(cronParams[4])) {
//          return messages.schedule.formMsg.cronExpression.validate.monthsError();
//        }
//
//        //Check day-of-week param
//        if (!Global.Utils.checkDayOfWeekField(cronParams[5])) {
//          return messages.schedule.formMsg.cronExpression.validate.dayOfWeekError();
//        }
//
//        //Check year param
//        if (cronParams.length == 7) {
//          if (!Global.Utils.checkYearField(cronParams[6])) {
//            return messages.schedule.formMsg.cronExpression.validate.yearError();
//          }
//        }

//        return true;
//      } else {
//        return messages.schedule.formMsg.cronExpression.validate.invalidError();
//      }
    },

    checkSecondsField: function (secondsField) {
      return Ext.ux.Utils.checkField(secondsField, 0, 59);
    },

    checkField: function (secondsField, minimal, maximal) {
      if (secondsField.indexOf("-") > -1) {
        var startValue = secondsField.substring(0, secondsField.indexOf("-"));
        var endValue = secondsField.substring(secondsField.indexOf("-") + 1);

        if (!(Ext.ux.Utils.checkIntValue(startValue, minimal, maximal, true) && Ext.ux.Utils.checkIntValue(endValue, minimal, maximal, true))) {
          return false;
        }
        try {
          var startVal = parseInt(startValue, 10);
          var endVal = parseInt(endValue, 10);

          return endVal > startVal;
        } catch (e) {
          return false;
        }
      } else if (secondsField.indexOf(",") > -1) {
        return Ext.ux.Utils.checkListField(secondsField, minimal, maximal);
      } else if (secondsField.indexOf("/") > -1) {
        return Ext.ux.Utils.checkIncrementField(secondsField, minimal, maximal);
      } else if (secondsField.indexOf("*") != -1) {
        return true;
      } else {
        return Ext.ux.Utils.checkIntValue(secondsField, minimal, maximal);
      }
    },

    checkIntValue: function (value, minimal, maximal, checkExtremity) {
      try {
        var val = parseInt(value, 10);
        if (value == val) {
//          if (checkExtremity) {
          if (val < minimal || val > maximal) {
            return false;
          }
//          }

          return true;
        }

        return false;
      } catch (e) {
        return false;
      }
    },

    checkMinutesField: function (minutesField) {
      return Ext.ux.Utils.checkField(minutesField, 0, 59);
    },

    checkHoursField: function (hoursField) {
      return Ext.ux.Utils.checkField(hoursField, 0, 23);
    },

    checkDayOfMonthField: function (dayOfMonthField) {
      if (dayOfMonthField == "?") {
        return true;
      }

      if (dayOfMonthField.indexOf("L") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfMonthField, "L", 1, 7, -1, -1);
      } else if (dayOfMonthField.indexOf("W") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfMonthField, "W", 1, 31, -1, -1);
      } else if (dayOfMonthField.indexOf("C") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfMonthField, "C", 1, 31, -1, -1);
      } else {
        return Ext.ux.Utils.checkField(dayOfMonthField, 1, 31);
      }
    },

    checkMonthsField: function (monthsField) {

      monthsField.replace("JAN", "1");
      monthsField.replace("FEB", "2");
      monthsField.replace("MAR", "3");
      monthsField.replace("APR", "4");
      monthsField.replace("MAY", "5");
      monthsField.replace("JUN", "6");
      monthsField.replace("JUL", "7");
      monthsField.replace("AUG", "8");
      monthsField.replace("SEP", "9");
      monthsField.replace("OCT", "10");
      monthsField.replace("NOV", "11");
      monthsField.replace("DEC", "12");

      return Ext.ux.Utils.checkField(monthsField, 1, 31);
    },

    checkDayOfWeekField: function (dayOfWeekField) {

      dayOfWeekField.replace("SUN", "1");
      dayOfWeekField.replace("MON", "2");
      dayOfWeekField.replace("TUE", "3");
      dayOfWeekField.replace("WED", "4");
      dayOfWeekField.replace("THU", "5");
      dayOfWeekField.replace("FRI", "6");
      dayOfWeekField.replace("SAT", "7");

      if (dayOfWeekField == "?") {
        return true;
      }

      if (dayOfWeekField.indexOf("L") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfWeekField, "L", 1, 7, -1, -1);
      } else if (dayOfWeekField.indexOf("C") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfWeekField, "C", 1, 7, -1, -1);
      } else if (dayOfWeekField.indexOf("#") >= 0) {
        return Ext.ux.Utils.checkFieldWithLetter(dayOfWeekField, "#", 1, 7, 1, 5);
      } else {
        return Ext.ux.Utils.checkField(dayOfWeekField, 1, 7);
      }
    },

    checkYearField: function (yearField) {
      return Ext.ux.Utils.checkField(yearField, 1970, 2099);
    },

    checkFieldWithLetter: function (value, letter, minimalBefore, maximalBefore, minimalAfter, maximalAfter) {
      var canBeAlone = false;
      var canHaveIntBefore = false;
      var canHaveIntAfter = false;
      var mustHaveIntBefore = false;
      var mustHaveIntAfter = false;

      if (letter == "L") {
        canBeAlone = true;
        canHaveIntBefore = true;
        canHaveIntAfter = false;
        mustHaveIntBefore = false;
        mustHaveIntAfter = false;
      }
      if (letter == "W" || letter == "C") {
        canBeAlone = false;
        canHaveIntBefore = true;
        canHaveIntAfter = false;
        mustHaveIntBefore = true;
        mustHaveIntAfter = false;
      }
      if (letter == "#") {
        canBeAlone = false;
        canHaveIntBefore = true;
        canHaveIntAfter = true;
        mustHaveIntBefore = true;
        mustHaveIntAfter = true;
      }

      var beforeLetter = "";
      var afterLetter = "";

      if (value.indexOf(letter) >= 0) {
        beforeLetter = value.substring(0, value.indexOf(letter));
      }

      if (!value.endsWith(letter)) {
        afterLetter = value.substring(value.indexOf(letter) + 1);
      }

      if (value.indexOf(letter) >= 0) {
        if (letter == value) {
          return canBeAlone;
        }

        if (canHaveIntBefore) {
          if (mustHaveIntBefore && beforeLetter.length == 0) {
            return false;
          }

          if (!Ext.ux.Utils.checkIntValue(beforeLetter, minimalBefore, maximalBefore, true)) {
            return false;
          }
        } else {
          if (beforeLetter.length > 0) {
            return false;
          }
        }

        if (canHaveIntAfter) {
          if (mustHaveIntAfter && afterLetter.length == 0) {
            return false;
          }

          if (!Ext.ux.Utils.checkIntValue(afterLetter, minimalAfter, maximalAfter, true)) {
            return false;
          }
        } else {
          if (afterLetter.length > 0) {
            return false;
          }
        }
      }

      return true;
    },

    checkIncrementField: function (value, minimal, maximal) {
      var start = value.substring(0, value.indexOf("/"));

      var increment = value.substring(value.indexOf("/") + 1);

      if (!("*" == start)) {
        return Ext.ux.Utils.checkIntValue(start, minimal, maximal, true) && Ext.ux.Utils.checkIntValue(increment, minimal, maximal, false);
      } else {
        return Ext.ux.Utils.checkIntValue(increment, minimal, maximal, true);
      }
    },

    checkListField: function (value, minimal, maximal) {
      var st = value.split(",");

      var values = new Array(st.length);

      for (var j = 0; j < st.length; j++) {
        values[j] = st[j];
      }

      var previousValue = -1;

      for (var i = 0; i < values.length; i++) {
        var currentValue = values[i];

        if (!Ext.ux.Utils.checkIntValue(currentValue, minimal, maximal, true)) {
          return false;
        }

        try {
          var val = parseInt(currentValue, 10);

          if (val <= previousValue) {
            return false;
          } else {
            previousValue = val;
          }
        } catch (e) {
          // we have always an int
        }
      }

      return true;
    }
  }
});