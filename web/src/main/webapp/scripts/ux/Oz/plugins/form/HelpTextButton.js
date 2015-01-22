Ext.define('Oz.plugins.form.HelpTextButton', {
  extend: 'Oz.plugins.form.ImageButton',

  alias: 'plugin.helptext',
  alternateClassName: 'Oz.ux.HelpTextButton',

//  statics: {
//    win: undefined,
//
//    getHelpWindow: function() {
//      if (!this.win) {
//        this.win = Ext.create('Ext.window.Window', {
//          closable: true,
//          closeAction: 'hide'
//        });
//      }
//      return this.win;
//    },
//
//    hideHelpWindow: function() {
//      if (this.win) {
//        this.win.hide();
//      }
//    }
//  },
  getHelpWindow: function() {
    if (!this.textField.win) {
      this.win = Ext.create('Ext.window.Window', {
        closable: true,
        closeAction: 'hide'
      });
      return this.win;
    }
    return this.textField.win;
  },

  hideHelpWindow: function() {
    if (this.win) {
      this.win.hide();
    }
  },

  requires: [
    'Oz.plugins.form.ImageButton',
    'Ext.window.Window'
  ],

  /**
   * Tada - the real action: If user left clicked on the image button, then empty the field
   */
  handleMouseClickOnImgButton: function(event, htmlElement, object) {
    if (!this.isLeftButton(event)) {
      return;
    }

    var field = this.textField;
    if (field.helpText || this.textField.win) {
      var win = this.getHelpWindow();
      if (win.helpTarget == field && win.isVisible()) {
        win.toFront();
      }
      else {
        // detach event
        if (win.helpTargetWin) {
          win.mun(win.helpTargetWin, 'close', this.bindWindow, this);
          win.mun(win.helpTargetWin, 'hide', this.bindWindow, this);
          win.mun(win.helpTargetWin, 'activate', this.onActivateWindow, this);
        }
        if(!field.win){
//          update displaying info for window
        win.setTitle(field.helpTitle);
        win.update(field.helpText);
        win.setWidth(field.helpWinWidth || 300);
        }
        win.show();
        win.alignTo(this.imgButtonEl, field.helperWinAlign || 'tr');
        win.helpTarget = field;

        var pWin = field.up('window');
        win.helpTargetWin = pWin;
        if (pWin) {
          win.mon(pWin, 'close', this.bindWindow, this);
          win.mon(pWin, 'hide', this.bindWindow, this);
          win.mon(pWin, 'activate', this.onActivateWindow, this);
        }
      }
    } else {
      this.handler();
    }
  },

  bindWindow: function(win) {
    this.hideHelpWindow();
  },

  onActivateWindow: function(win){
    this.hideHelpWindow();
  }
});