Ext.define('Oz.plugins.form.ImageButton', {
  extend:'Ext.AbstractPlugin',

  mixins:{
    observable:'Ext.util.Observable'
  },

  alias:'plugin.imgbtn',
  alternateClassName:'Oz.ux.ImageButton',

  requires:[
    'Ext.util.Observable'
  ],

  /**
   * @cfg {String} CSS class used for the button div.
   * Also used as a prefix for other classes (suffixes: '-mouse-over-input', '-mouse-over-button', '-mouse-down', '-on', '-off')
   */
  imgBtnCls:'ux-img-btn',

  /**
   * @cfg {String} CSS class used for the button div.
   */
  btnCls:undefined,

  /**
   * @cfg {String} Quick tip text for the button div.
   */
  tipText:undefined,

  /**
   * @cfg {Boolean} If show button when initial.
   * Default true.
   */
  showAlways:true,

  /**
   * @cfg {String} position (optional, defaults to "tr") The position to align to (see {@link Ext.core.Element#alignTo} for more details).
   */
  aligns:'tr',

  /**
   * The text field (or text area, combo box, date field) that we are attached to
   */
  textField:null,

  /**
   * @cfg {Integer} padding (optional, defaults to 5) The padding to left of the field el.
   */
  paddingLeft:5,

  /**
   * Handler executing when clicking on the image button.
   * @private
   */
  handler:Ext.emptyFn,

  offsetX:3,

  offsetY:3,

  triggerComboFieldOffsetX:20,

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Set up and tear down
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor:function (cfg) {
    Ext.apply(this, cfg);

    this.callParent(arguments);
  },

  /**
   * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
   * Most all the setup is delayed until the component is rendered.
   */
  init:function (textField) {
    this.textField = textField;
    if (!textField.rendered) {
      this.mon(textField, 'afterrender', this.handleAfterRender, this);
    } else {
      // probably an existing input element transformed to extjs field
      this.handleAfterRender();
    }
  },

  /**
   * After the field has been rendered sets up the plugin (create the Element for the image button, attach listeners).
   * @private
   */
  handleAfterRender:function (textField) {
    this.isTextArea = (this.textField.inputEl.dom.type && this.textField.inputEl.dom.type.toLowerCase() == 'textarea');

    this.createImgButtonEl();
    this.addListeners();

    this.repositionImgButton();
    this.updateImgButtonVisibility();
  },

  /**
   * Creates the Element and DOM for the image button
   */
  createImgButtonEl:function () {
    this.imgButtonEl = this.textField.imageBtnEl.createChild(Ext.apply(
      {
        tag:'div',
        cls:this.imgBtnCls
      },
      this.tipText ? {"data-qclass":"qtip-wrap", "data-qtip":this.tipText} : {}
    ));
    if (!this.showAlways) {
      this.imgButtonEl.setStyle('visibility', 'hidden');
    } else {
      this.textField.imageBtnEl.setStyle('display', null);
    }

    this.textField.__imgBtnPlugin = this;
  },

  /**
   * Adds listeners to the field, its input element and the image button to handle resizing, mouse over/out events, click events etc.
   */
  addListeners:function () {
    // listeners on input element (DOM/El level)
    var textField = this.textField;
    var bodyEl = textField.bodyEl;

    if (!this.showAlways) {
      this.mon(bodyEl, 'mouseover', this.handleMouseOverInputField, this);
      this.mon(bodyEl, 'mouseout', this.handleMouseOutOfInputField, this);
    } else {
      this.imgButtonEl.addCls(this.imgBtnCls + '-mouse-over-input');
    }
    // add customer class
    if (this.btnCls)
      this.imgButtonEl.addCls(this.btnCls);

    // listeners on text field (component level)
    this.mon(textField, 'destroy', this.handleDestroy, this);
    // listeners on image button (DOM/El level)

    var imgButtonEl = this.imgButtonEl;
    this.mon(imgButtonEl, 'click', this.handleMouseClickOnImgButton, this);
//    this.mon(textField, 'resize', function () {
//      var layout = textField.getComponentLayout();
//      if (layout.type == 'field') {
//        layout.finishedLayout = this.sizeDisplayFieldBodyContents
//      }
//      else if (layout.type == 'textfield') {
//        layout.beginLayoutFixed = this.sizeTextFieldBodyContents
//      }
//      else if (layout.type == 'triggerfield') {
//        layout.finishedLayout = this.sizeTriggerFieldBodyContents
//      } else if (layout.type == 'combobox') {
//        layout.finishedLayout = this.sizeComboboxFieldBodyContents
//      }
//    }, this);
  },

  /**
   * When the field is destroyed, we also need to destroy the image button Element to prevent memory leaks.
   */
  handleDestroy:function () {
    this.imgButtonEl.destroy();
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Mouse event handlers
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Tada - the real action: If user left clicked on the image button, then empty the field
   */
  handleMouseClickOnImgButton:function (event, htmlElement, object) {
    if (!this.isLeftButton(event)) {
      return;
    }
    this.handler();
  },

  handleMouseOverInputField:function (event, htmlElement, object) {
    this.imgButtonEl.addCls(this.imgBtnCls + '-mouse-over-input');
    if (event.getRelatedTarget() == this.imgButtonEl.dom) {
      // Moused moved to img button and will generate another mouse event there.
      // Handle it here to avoid duplicate updates (else animation will break)
      this.imgButtonEl.removeCls(this.imgBtnCls + '-mouse-over-button');
      this.imgButtonEl.removeCls(this.imgBtnCls + '-mouse-down');
    }
    this.updateImgButtonVisibility();
  },

  handleMouseOutOfInputField:function (event, htmlElement, object) {
    this.imgButtonEl.removeCls(this.imgBtnCls + '-mouse-over-input');
    if (event.getRelatedTarget() == this.imgButtonEl.dom) {
      // Moused moved from image button and will generate another mouse event there.
      // Handle it here to avoid duplicate updates (else animation will break)
      this.imgButtonEl.addCls(this.imgBtnCls + '-mouse-over-button');
    }
    this.updateImgButtonVisibility();
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Utility methods
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Repositions the image button element based on the textfield.inputEl element
   * @private
   */
  repositionImgButton:function () {
    var imgButtonEl = this.imgButtonEl;
    if (!imgButtonEl) {
      return;
    }
  },

  /**
   * Small wrapper around imgButtonEl.isVisible() to handle setVisible animation that may still be in progress.
   */
  isButtonCurrentlyVisible:function () {
    if (this.animateImgButton && this.animateWithCss3) {
      return this.imgButtonEl.hasCls(this.imgBtnCls + '-on');
    }

    // This should not be necessary (see Element.setVisible/isVisible), but else there is confusion about visibility
    // when moving the mouse out and _quickly_ over then input again.
//    var cachedVisible = Ext.core.Element.data(this.imgButtonEl.dom, 'isVisible');
//    if (typeof(cachedVisible) == 'boolean') {
//      return cachedVisible;
//    }
    return this.imgButtonEl.isVisible();
  },

  /**
   * Checks config options and current mouse status to determine if the image button should be visible.
   */
  shouldButtonBeVisible:function () {
    var imgButtonEl = this.imgButtonEl;
    //noinspection RedundantIfStatementJS
    if (this.hideImgButtonWhenMouseOut
      && !imgButtonEl.hasCls(this.imgBtnCls + '-mouse-over-button')
      && !imgButtonEl.hasCls(this.imgBtnCls + '-mouse-over-input')) {
      return false;
    }

    return true;
  },

  /**
   * Called after any event that may influence the image button visibility.
   */
  updateImgButtonVisibility:function () {
    var oldVisible = this.isButtonCurrentlyVisible();
    var newVisible = this.shouldButtonBeVisible();

    var imgButtonEl = this.imgButtonEl;
    if (oldVisible != newVisible) {
      if (this.animateImgButton && this.animateWithCss3) {
        this.imgButtonEl.removeCls(this.imgBtnCls + (oldVisible ? '-on' : '-off'));
        imgButtonEl.addCls(this.imgBtnCls + (newVisible ? '-on' : '-off'));
      }
      else {
        imgButtonEl.stopAnimation();
        imgButtonEl.setVisible(newVisible, this.animateimgButton);
      }

      // Adjust padding-right of the input tag to make room for the button
      // IE (up to v9) just ignores this and Gecko handles padding incorrectly with  textarea scrollbars
      if (!(this.isTextArea && Ext.isGecko) && !Ext.isIE) {
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=157846
        var deltaPaddingRight = imgButtonEl.getWidth() - this.imgButtonEl.getMargin('l');
        var currentPaddingRight = this.textField.inputEl.getPadding('r');
        var factor = (newVisible ? +1 : -1);
        this.textField.inputEl.dom.style.paddingRight = (currentPaddingRight + factor * deltaPaddingRight) + 'px';
      }
    }
  },

  isLeftButton:function (event) {
    return event.button === 0;
  },

  onDestroy:function () {
    this.callParent();
    delete this.textField.__imgBtnPlugin
  }
//
//  //sizeTextFieldBodyContents : function(width, height) {
//  sizeTextFieldBodyContents:function (ownerContext) {
//    var owner = this.owner,
//      clazz = owner.__imgBtnPlugin;
//    if (this.owner.__imgBtnPlugin && ownerContext.inputContext) {
//      if (ownerContext.target.allowBlank)
//        this.owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.offsetX, clazz.offsetY]);
//      else
//        this.owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.offsetX + 9, clazz.offsetY]);
//    }
//  },
//
//  sizeTriggerFieldBodyContents:function (ownerContext) {
//    var me = this,
//      owner = me.owner,
//      triggerWidth = owner.getTriggerWidth(),
//      clazz = owner.__imgBtnPlugin.textField.__imgBtnPlugin;
//
//    if (ownerContext.inputContext && (owner.hideTrigger || owner.readOnly || triggerWidth > 0)) {
//      if (ownerContext.target.allowBlank)
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.triggerComboFieldOffsetX, clazz.offsetY]);
//      else
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.triggerComboFieldOffsetX + 9, clazz.offsetY]);
//    }
//  },
//
//  sizeDisplayFieldBodyContents:function (ownerContext) {
//    var me = this,
//      owner = me.owner;
//
//    if (ownerContext.inputContext && (owner.hideTrigger || owner.readOnly)) {
//      if (ownerContext.target.allowBlank)
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [owner.offsetX, owner.offsetY]);
//      else
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [owner.offsetX + 9, owner.offsetY]);
//    }
//  },
//  sizeComboboxFieldBodyContents:function (ownerContext) {
//    var me = this,
//      owner = me.owner,
//      clazz = owner.__imgBtnPlugin.textField.__imgBtnPlugin;
//
//    if (ownerContext.inputContext) {
//
//      if (ownerContext.target.allowBlank)
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.triggerComboFieldOffsetX, clazz.offsetY]);
//      else
//        owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el, 'tr', [clazz.triggerComboFieldOffsetX + 9, clazz.offsetY]);
//    }
//
//    //console.log('---ownerContext.inputContext.allowBlank:',ownerContext.target,ownerContext.inputContext,ownerContext.allowBlank,ownerContext.inputContext.allowBlank);
//
////    if(ownerContext.inputContext){
////      owner.__imgBtnPlugin.imgButtonEl.alignTo(ownerContext.inputContext.el,'tr',[clazz.triggerComboFieldOffsetX,clazz.offsetY]);
////    }
//
//  }
});