/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-03
 * Time: 7:09 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.util.Utils', {
  alternateClassName: 'Oz.Utils',
  statics: {
    trim: function(str) {
      var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
      while (ws.test(str.charAt(--i)));
      return str.slice(0, i + 1);
    },

    addToArray: function(array, item) {
      var index = array.indexOf(item);

      if (index == -1) {
        array.splice(0, 0, item);
      }

      return array;
    },

    removeFromArray: function(array, item) {
      var index = array.indexOf(item);

      if (index != -1) {
        array.splice(index, 1);
      }

      return array;
    },

    markReadOnlyTitle : function (title){
      var activeTemplate = new Ext.Template(scheduleRes.activeReadyOnly);
      var htmlSeg,activeTitle;
      activeTitle = activeTemplate.apply(htmlSeg);
      return title + activeTitle;
    },

    markUnsaveTitle: function(title){
      if(!title) return;
      return '* '+title;
    },

    markSavedTitle: function(title){
      if(!title) return;
      return title.replace(/\*/gi,'');
    },

    formatBoolean: function(value) {
      return value ? globalRes.yes : globalRes.no;
    },

    formatOrgLevel: function(value) {
      return value ? value : configurationRes.noValue;
    },

    toDate: function(value) {
      if(value){
        if(Ext.isString(value)){
          return Ext.Date.parse(value, globalRes.dateFormat);
        }
        else{
          return value;
        }
      }
      else{
        return '';
      }
    },

    formatDate: function(value) {
      if(value){
        if(Ext.isDate(value)){
          return Ext.Date.format(value, globalRes.dateFormat);
        }
        else{
          return value;
        }
      }
      else{
        return '';
      }
    },

    formatDateTime: function(value) {
      if(value){
        if(Ext.isDate(value)){
          return Ext.Date.format(value, globalRes.datetimeFormat);
        }
        else{
          return value;
        }
      }
      else{
        return '';
      }
    },

    formatMonthDateFormat:function (value) {
      if (value) {
        if (Ext.isDate(value)) {
          return Ext.Date.format(value, globalRes.monthDateFormat);
        }
        else {
          return value;
        }
      }
      else {
        return '';
      }
    },

    formatPercentage: function(value) {
      if (value) {
        value = Math.round(value * 10000)/100;
        value = value.toFixed(2);
        return value + '%';
      }
      else {
        return '0.00%';
      }
    },

    formatWS: function(value) {
      var re = new RegExp('(\s|\\t|\\n|\\r|\\f|\\v)+', 'g');
      value = value.replace(re, ' ');
      return value;
    },

    getTplMsg: function(template, params) {
      var tpl = new Ext.Template(template);
      var msg = tpl.applyTemplate(params);
      return msg;
    },

    setVerifyStatus : function(valid, status) {
      var msg;
      if (status) {
        if (status == true) {
          msg = globalRes.msg.verified;
          msg = this.getTplMsg(globalRes.msg.correctTpl, {
            msg: msg
          });
        }
        else {
          msg = globalRes.msg.invalid;
          msg = this.getTplMsg(globalRes.msg.errorTpl, {
            msg: msg
          });
        }
      }
      else {
        msg = globalRes.msg.unverified;
        msg = this.getTplMsg(globalRes.msg.warningTpl, {
          msg: msg
        });
      }
      Ext.fly(valid.getEl()).update(msg);
    },

    showCorrectMsg: function(status, msg) {
      var sb = status;
      if (Ext.type(sb) == 'string') {
        sb = Ext.getCmp(status);
      }
      if (sb) {
        msg = this.getTplMsg(globalRes.msg.correctTpl, {
          msg: msg
        });

        sb.setStatus({
          text: msg,
          iconCls: 'x-status-saved'
        });
      }
    },

    showErrorMsg:function(status, msg) {
      var sb = status;
      if (Ext.type(sb) == 'string') {
        sb = Ext.getCmp(status);
      }

      if (sb) {
        msg = this.getTplMsg(globalRes.msg.errorTpl, {
          msg: msg
        });

        sb.setStatus({
          text: msg,
          iconCls: 'x-status-error'
        });
      }
    },
    showErrorDlg  : function(action, title) {
      var errMsg = this.getErrorMsg(action) ;

      if (errMsg) {
        // display option to clear the changes
        Ext.MessageBox.show({
          width: messageBoxRes.width,
          title: title,
          msg: errMsg,
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.ERROR
        });
      }
      return false;
    },
    getErrorMsg :function(action) {
      var result = action.result;
      if (!result) {
        result = action.jsonData;
      }

      if (!result) {
        result = action;
      }

      var data = result.data;
      if (data && data[0]) {
        return data[0].message;
      }
      else {
        var error = result.errors;
        if (error && error[0]) {
          return error[0].msg;
        }
        else {
          var error = result.error;
          if (error) {
            return error.msg;
          }
          else {
            return result;
          }
        }
      }
    },
    growlNotify:function (title, message, autoHide){
      var sticky = true;
      if(autoHide){
        sticky = false;
      }
      var gritter = Ext.gritter.add({
        // (string | mandatory) the heading of the notification
        title: title,
        sticky: sticky,
        // (string | mandatory) the text inside the notification
        text: message
      });
      return gritter;
    } ,

    showLoadMask: function(p, msg){
      if(p && Ext.isObject(p)){
        if(!p.loadMask){
          p.loadMask = new Ext.LoadMask(p.id,{
            msg: msg || globalRes.maskMsg.save
          });
        }
        Ext.Function.defer(function(){
          p.loadMask.show();
        }, 50);
      }
    },
    hideLoadMask: function(p){
      if(p && Ext.isObject(p) && p.loadMask){
        Ext.Function.defer(function(){
          p.loadMask.hide();
        }, 50);
//        p.loadMask.hide();
      }
    },

    /**
     * Memory store automatic load page with the value
     * @require add to the combo listener @dirtychange
     */
    memoryStoreAutoLoadPageWithValueOnDirtyChange: function(cb,isDirty){
      var idx = 0, data = this.store.getProxy().data || [];
      for (var i = 0, len = data.length; i < len; i++) {
        var rec = data[i];
        if (rec[this.valueField] == this.getValue()) {
          idx = i;
          break;
        }
      }

      var pageNum = Math.ceil(idx / this.pageSize);
      this.dataInPage = pageNum = pageNum <= 0 ? 1 : pageNum;
      if (pageNum !== this.store.currentPage)
        this.store.loadPage(pageNum);
    },

    /**
     * validator trim (#allowBlank : false)
     * @param v
     */
    trimValidator : function(v){
      //v = v ? v : Ext.String.trim('' + v);
      if(this.minLength> 0 && v && v.length >= this.minLength&& Ext.String.trim(v).length<this.minLength) return Ext.String.format(globalRes.error.minLengthTrim,this.minLength);
      else if(v && Ext.String.trim(v) == '') return globalRes.error.allSpacer;
      else return true;

    },

    /**
     * validator trim ( #allowBlank : true)
     * @param v
     */
    notAllowAllSpacer : function(v){
      v = v ? v : '';
      if(v && v.length === 0) return true;
      else if(v && Ext.String.trim(v) == '') return globalRes.error.notAllEnterSpacer;
      else return true;
    },

    /**
     * Gets the x,y coordinates to align this element with another element. See {@link #alignTo} for more info on the
     * supported position values.
     * @param {String/HTMLElement/Ext.Element} element The element to align to.
     * @param {String} [position="tl-bl?"] The position to align to (defaults to )
     * @param {Number[]} [offsets] Offset the positioning by [x, y]
     * @return {Number[]} [x, y]
     */
    getAlignToXY: function(el, p, o, me){
      el = Ext.get(el);

      if (!el || !el.dom) {
      }

      o = o || [0, 0];
      p = (!p || p == "?" ? "tl-bl?" : (!(/-/).test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();

      var me = me,
        d = me.dom,
        a1,
        a2,
        x,
        y,
        //constrain the aligned el to viewport if necessary
        w,
        h,
        r,
        dw = Ext.Element.getViewWidth() - 10, // 10px of margin for ie
        dh = Ext.Element.getViewHeight() - 10, // 10px of margin for ie
        p1y,
        p1x,
        p2y,
        p2x,
        swapY,
        swapX,
        doc = document,
        docElement = doc.documentElement,
        docBody = doc.body,
        scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0) + 5,
        scrollY = (docElement.scrollTop || docBody.scrollTop || 0) + 5,
        c = false, //constrain to viewport
        p1 = "",
        p2 = "",
        m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);

      if (!m) {
      }

      p1 = m[1];
      p2 = m[2];
      c = !!m[3];

      //Subtract the aligned el's internal xy from the target's offset xy
      //plus custom offset to get the aligned el's new offset xy
      a1 = me.getAnchorXY(p1, true);
      a2 = el.getAnchorXY(p2, false);

      x = a2[0] - a1[0] + o[0];
      y = a2[1] - a1[1] + o[1];

      if (c) {
        w = me.getWidth();
        h = me.getHeight();
        r = el.getRegion();
        //If we are at a viewport boundary and the aligned el is anchored on a target border that is
        //perpendicular to the vp border, allow the aligned el to slide on that border,
        //otherwise swap the aligned el to the opposite border of the target.
        p1y = p1.charAt(0);
        p1x = p1.charAt(p1.length - 1);
        p2y = p2.charAt(0);
        p2x = p2.charAt(p2.length - 1);
        swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
        swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));


        if (x + w > dw + scrollX) {
          x = swapX ? r.left - w : dw + scrollX - w;
        }
//           if (x < scrollX) {
        x = swapX ? r.right : scrollX;
//           }
        if (y + h > dh + scrollY) {
          y = swapY ? r.top - h : dh + scrollY - h;
        }
        if (y < scrollY) {
          y = swapY ? r.bottom : scrollY;
        }
      }
      return [x, y];
    },

    renderChannelType: function(value){
      var label = '';
      if (value && value != '') {
        if (value == 'email') {
          label = 'Email';
        } else if (value == 'letter') {
          label = 'Letter';
        } else if (value == 'sms') {
          label = 'SMS';
        } else if (value == 'ivr') {
          label = 'IVR';
        } else if (value == 'dialer') {
          label = 'Dialer';
        } else if (value == 'securepdf') {
          label = 'SmartPdf';
        }
      }
      return label;
    },

    onDragDropViewRender: function(view){
      var me = this;

      if (me.enableDrag) {
        me.dragZone = new Oz.dd.DragZone({
          view: view,
          ddGroup: me.dragGroup || me.ddGroup,
          dragText: me.dragText
        });
      }

      if (me.enableDrop) {
        me.dropZone = new Ext.grid.ViewDropZone({
          view: view,
          ddGroup: me.dropGroup || me.ddGroup
        });
      }
    },
    
   onSelfDragDropViewRender : function(view)   {
       var me = this;
       if (me.enableDrag) {
           me.dragZone = new Oz.dd.ExtendDragZone({
               view: view,
               ddGroup: me.dragGroup || me.ddGroup
               //dragText: me.dragText
           });
       }

       if (me.enableDrop) {
           me.dropZone = new Ext.grid.ViewDropZone({
               view: view,
               ddGroup: me.dropGroup || me.ddGroup
           });
       }
   },

    validateFiledWithVarExpression: function(v){
      var templateReg = /\$\{\s*.*?\s*}/g;
      //v.match(templateReg); // return template such as ${address1} ....
      var replaceTemplateAsOnChar = v.replace(templateReg, '#');
      if(replaceTemplateAsOnChar.length > 160){
        return Ext.String.format(globalRes.error.maxLengthText, 160);
      }
      return true;
    },

    validateFiledWithVarLength: function (v) {
      var templateReg = /\$\{\s*.*?\s*}/g;
      //v.match(templateReg); // return template such as ${address1} ....
      var replaceTemplateAsOnChar = v.replace(templateReg, '#');
      return replaceTemplateAsOnChar.length
    },
    
    isTrue: function(val){
      return /^true|y|t/i.test(val);
    }
  }
});