Ext.define('Oz.plugins.form.MaxWrapButton', {
  alias: 'plugin.maxwrapbutton',

  editorType: 'aceeditor',

  /**
   * @cfg {String} CSS class used for the button div.
   * Also used as a prefix for other classes (suffixes: '-mouse-over-input', '-mouse-over-button', '-mouse-down', '-on', '-off')
   */
  buttonCls: 'ux-max-wrap-btn',

  /**
   * The text field (or text area, combo box, date field) that we are attached to
   */
  textField: null,

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Set up and tear down
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor: function (cfg){
    Ext.apply(this, cfg);

    this.callParent(arguments);
  },

  /**
   * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
   * Most all the setup is delayed until the component is rendered.
   */
  init: function (textField){
    this.textField = textField;
    if (!textField.rendered){
      textField.on('afterrender', this.handleAfterRender, this);
    }
    else{
      // probably an existing input element transformed to extjs field
      this.handleAfterRender();
    }
  },

  /**
   * After the field has been rendered sets up the plugin (create the Element for the button, attach listeners).
   * @private
   */
  handleAfterRender: function (textField){
    if (this.textField.inputEl && this.textField.inputEl.dom.type){
      this.isTextArea = (this.textField.inputEl.dom.type.toLowerCase() == 'textarea');
    }

    this.createButtonEl();
    this.addListeners();

    this.repositionButton();
    this.updateButtonVisibility();
  },

  /**
   * Creates the Element and DOM for the button
   */
  createButtonEl: function (){
    this.buttonEl = this.textField.bodyEl.createChild({
      tag: 'div',
      cls: this.buttonCls
    });
    this.buttonEl.setStyle('visibility', 'hidden');
  },

  /**
   * Adds listeners to the field, its input element and the button to handle resizing, mouse over/out events, click events etc.
   */
  addListeners: function (){
    // listeners on input element (DOM/El level)
    var textField = this.textField;
    var bodyEl = textField.bodyEl;
    bodyEl.on('mouseover', this.handleMouseOverInputField, this);
    bodyEl.on('mouseout', this.handleMouseOutOfInputField, this);

    // listeners on text field (component level)
    textField.on('destroy', this.handleDestroy, this);
    textField.on('resize', this.repositionButton, this);

    // listeners on button (DOM/El level)
    var buttonEl = this.buttonEl;
    buttonEl.on('mouseover', this.handleMouseOverButton, this);
    buttonEl.on('mouseout', this.handleMouseOutOfButton, this);
    buttonEl.on('click', this.handleMouseClickOnButton, this);
  },

  /**
   * When the field is destroyed, we also need to destroy the button Element to prevent memory leaks.
   */
  handleDestroy: function (){
    this.buttonEl.destroy();
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Mouse event handlers
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Tada - the real action: If user left clicked on the button, then empty the field
   */
  handleMouseClickOnButton: function (event, htmlElement, object){
    var me = this;
    var win = Ext.widget('window', {
      title:       'Advance Criteria Editor',
      closable:    false,
      minimizable: false,
      maximizable: false,
      resizable:   false,
      modal:       true,
      buttonAlign: 'left',

      layout: 'fit',
      items:  [
        {
          xtype:            this.editorType,
          itemId:           'editor',
          grow:             false,
          defaultFocus:     true,
          showGutter:       false,
          enableFullScreen: false,
          varStoreId:       me.varStoreId,
          value:            this.textField.getValue(),
          readOnly:         this.textField.readOnly,
          disabled:         this.textField.disabled
        }
      ],

      buttons: [
//        {
//          text: 'Key Map',
//          handler: function(){
//
//          }
//        },
        '->',
        {
          text:    'Close',
          handler: function (){
            var value = win.down('#editor').getValue();
            me.textField.setValue(value);
            Ext.defer(win.destroy, 100, win);
            me.textField.focus(200);
          }
        }
      ]
    });

    win.show();
    win.maximize();
//    win.syncMonitorWindowResize();
//    win.setPosition(0, 0);
//    win.fitContainer();
  },

  handleMouseOverInputField: function (event, htmlElement, object){
    this.buttonEl.addCls(this.buttonCls + '-mouse-over-input');
    if (event.getRelatedTarget() == this.buttonEl.dom){
      // Moused moved to button and will generate another mouse event there.
      // Handle it here to avoid duplicate updates (else animation will break)
      this.buttonEl.removeCls(this.buttonCls + '-mouse-over-button');
      this.buttonEl.removeCls(this.buttonCls + '-mouse-down');
    }
    this.updateButtonVisibility();
  },

  handleMouseOutOfInputField: function (event, htmlElement, object){
    this.buttonEl.removeCls(this.buttonCls + '-mouse-over-input');
    if (event.getRelatedTarget() == this.buttonEl.dom){
      // Moused moved from button and will generate another mouse event there.
      // Handle it here to avoid duplicate updates (else animation will break)
      this.buttonEl.addCls(this.buttonCls + '-mouse-over-button');
    }
    this.updateButtonVisibility();
  },

  handleMouseOverButton: function (event, htmlElement, object){
    event.stopEvent();
    if (this.textField.bodyEl.contains(event.getRelatedTarget())){
      // has been handled in handleMouseOutOfInputField() to prevent double update
      return;
    }
    this.buttonEl.addCls(this.buttonCls + '-mouse-over-button');
    this.updateButtonVisibility();
  },

  handleMouseOutOfButton: function (event, htmlElement, object){
    event.stopEvent();
    if (this.textField.bodyEl.contains(event.getRelatedTarget())){
      // will be handled in handleMouseOverInputField() to prevent double update
      return;
    }
    this.buttonEl.removeCls(this.buttonCls + '-mouse-over-button');
    this.buttonEl.removeCls(this.buttonCls + '-mouse-down');
    this.updateButtonVisibility();
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Utility methods
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Repositions the button element based on the textfield.inputEl element
   * @private
   */
  repositionButton: function (textfield, width, height, oldWidth, oldHeight, eOpts){
    var buttonEl = this.buttonEl;
    if (!buttonEl){
      return;
    }

    this.buttonEl.alignTo(this.textField.inputEl, 'tl', [this.textField.inputEl.getWidth() - 25, 5]);
  },

  /**
   * Calculates the position of the button based on the textfield.inputEl element
   * @private
   */
  calculateButtonPosition: function (textField){
    var positions = textField.inputEl.getBox(true, true);
    var top = positions.y;
    var right = positions.x;
    if (this.fieldHasScrollBar()){
      right += Ext.getScrollBarWidth();
    }
    if (this.textField.triggerWrap){
      right += this.textField.getTriggerWidth();
    }
    return {
      right: right,
      top:   top
    };
  },

  /**
   * Checks if the field we are attached to currently has a scrollbar
   */
  fieldHasScrollBar: function (){
    if (!this.isTextArea){
      return false;
    }

    var inputEl = this.textField.inputEl;
    var overflowY = inputEl.getStyle('overflow-y');
    if (overflowY == 'hidden' || overflowY == 'visible'){
      return false;
    }
    if (overflowY == 'scroll'){
      return true;
    }
    //noinspection RedundantIfStatementJS
    if (inputEl.dom.scrollHeight <= inputEl.dom.clientHeight){
      return false;
    }
    return true;
  },


  /**
   * Small wrapper around buttonEl.isVisible() to handle setVisible animation that may still be in progress.
   */
  isButtonCurrentlyVisible: function (){
    return this.buttonEl.isVisible();
  },

  /**
   * Checks config options and current mouse status to determine if the button should be visible.
   */
  shouldButtonBeVisible: function (){

    var buttonEl = this.buttonEl;
    //noinspection RedundantIfStatementJS
    if (!buttonEl.hasCls(this.buttonCls + '-mouse-over-button')
      && !buttonEl.hasCls(this.buttonCls + '-mouse-over-input')){
      return false;
    }

    return true;
  },

  /**
   * Called after any event that may influence the button visibility.
   */
  updateButtonVisibility: function (){
    var oldVisible = this.isButtonCurrentlyVisible();
    var newVisible = this.shouldButtonBeVisible();

    var buttonEl = this.buttonEl;
    if (oldVisible != newVisible){
      this.buttonEl.removeCls(this.buttonCls + (oldVisible ? '-on' : '-off'));
      buttonEl.addCls(this.buttonCls + (newVisible ? '-on' : '-off'));
      buttonEl.setVisible(newVisible);
      buttonEl.setVisible(newVisible);

      // Set background-color of button to same as field's background-color (for those browsers/cases
      // where the padding-right (see below) does not work)
      buttonEl.setStyle('background-color', this.textField.inputEl.getStyle('background-color'));

      // Adjust padding-right of the input tag to make room for the button
      // IE (up to v9) just ignores this and Gecko handles padding incorrectly with  textarea scrollbars
      if (!(this.isTextArea && Ext.isGecko) && !Ext.isIE){
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=157846
        var deltaPaddingRight = buttonEl.getWidth() - this.buttonEl.getMargin('l');
        var currentPaddingRight = this.textField.inputEl.getPadding('r');
        var factor = (newVisible ? +1 : -1);
        this.textField.inputEl.dom.style.paddingRight = (currentPaddingRight + factor * deltaPaddingRight) + 'px';
      }
    }
  }

});