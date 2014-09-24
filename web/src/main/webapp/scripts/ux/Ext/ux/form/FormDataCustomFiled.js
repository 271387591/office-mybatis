/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/28/13
 * Time: 4:00 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define("Ext.ux.form.FormDataCustomFiled", {
    extend: 'Ext.form.field.Trigger',
    alias: ['widget.formDataCustomFiled', 'widget.formDataCustomFiled'],
//    alternateClassName: ['Ext.form.FileUploadField', 'Ext.ux.form.FileUploadField', 'Ext.form.File'],
    uses: ['Ext.button.Button', 'Ext.layout.component.field.Field'],

    /**
     * @cfg {String} buttonText
     * The button text to display on the upload button. Note that if you supply a value for
     * {@link #buttonConfig}, the buttonConfig.text value will be used instead if available.
     */
    //<locale>
    buttonText: 'Browse...',
    //</locale>

    /**
     * @cfg {Boolean} buttonOnly
     * True to display the file upload field as a button with no visible text field. If true, all
     * inherited Text members will still be available.
     */
    buttonOnly: false,

    /**
     * @cfg {Number} buttonMargin
     * The number of pixels of space reserved between the button and the text field. Note that this only
     * applies if {@link #buttonOnly} = false.
     */
    buttonMargin: 3,

    /**
     * @cfg {Object} buttonConfig
     * A standard {@link Ext.button.Button} config object.
     */

    /**
     * @event change
     * Fires when the underlying file input field's value has changed from the user selecting a new file from the system
     * file selection dialog.
     * @param {Ext.ux.form.FileUploadField} this
     * @param {String} value The file value returned by the underlying file input field
     */

    /**
     * @property {Ext.Element} fileInputEl
     * A reference to the invisible file input element created for this upload field. Only populated after this
     * component is rendered.
     */

    /**
     * @property {Ext.button.Button} button
     * A reference to the trigger Button component created for this upload field. Only populated after this component is
     * rendered.
     */

    /**
     * @cfg {String} [fieldBodyCls='x-form-file-wrap']
     * An extra CSS class to be applied to the body content element in addition to {@link #fieldBodyCls}.
     */
    fieldBodyCls: Ext.baseCSSPrefix + 'form-file-wrap',

    /**
     * @cfg {Boolean} readOnly
     * Unlike with other form fields, the readOnly config defaults to true in File field.
     */
    readOnly: true,

    // private
    componentLayout: 'triggerfield',

    // private. Extract the file element, button outer element, and button active element.
    childEls: ['customBtnEL', 'buttonEl', 'buttonEl-btnEl', 'browseButtonWrap'],

    // private
    onRender: function() {
        var me = this,
            inputEl;

        me.callParent(arguments);

        inputEl = me.inputEl;
        inputEl.dom.name = ''; //name goes on the fileInput, not the text input

        me.customBtnEL.dom.name = me.getName();
        me.customBtnEL.on({
            scope: me,
            click:me.onClick
        });

        if (me.buttonOnly) {
            me.inputCell.setDisplayed(false);
        }

        // Ensure the trigger cell is sized correctly upon render
        me.browseButtonWrap.dom.style.width = (me.browseButtonWrap.dom.lastChild.offsetWidth + me.buttonEl.getMargin('lr')) + 'px';
        if (Ext.isIE) {
            me.buttonEl.repaint();
        }
    },

    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup: function() {
        var me = this,
            result,
            btn = Ext.widget('button', Ext.apply({
                id: me.id + '-buttonEl',
                ui: me.ui,
                disabled: me.disabled,
                text: me.buttonText,
                cls: Ext.baseCSSPrefix + 'form-file-btn',
                preventDefault: false,
                style: me.buttonOnly ? '' : 'margin-left:' + me.buttonMargin + 'px'
            }, me.buttonConfig)),
            btnCfg = btn.getRenderTree(),
            inputElCfg = {
                id: me.id + '-customBtnEL',
                cls: Ext.baseCSSPrefix + 'form-file-input',
                tag: 'input',
                size: 1,
                value:'11111'
            };
        if (me.disabled) {
            inputElCfg.disabled = true;
        }
        btnCfg.cn = inputElCfg;
        result = '<td id="' + me.id + '-browseButtonWrap">' + Ext.DomHelper.markup(btnCfg) + '</td>';
//        btn.destroy();
        return result;
    },

    /**
     * @private
     * Creates the file input element. It is inserted into the trigger button component, made
     * invisible, and floated on top of the button's other content so that it will receive the
     * button's clicks.
     */
    createFileInput : function() {
        var me = this;
        me.customBtnEL = me.buttonEl.createChild({
            name: me.getName(),
            id: me.id + '-customBtnEL',
            cls: Ext.baseCSSPrefix + 'form-file-input',
            tag: 'input',
            size: 1
        });
        me.customBtnEL.on({
            scope: me,
            click: me.onClick
        });
    },

    /**
     * @private Event handler fired when the user selects a file.
     */
        onClick:function(){
//        this.lastValue = null;

    },


    /**
     * Overridden to do nothing
     * @method
     */
    setValue: function(v){
        Ext.ux.form.FormDataCustomFiled.superclass.setValue.call(this, v);
    },

    reset : function(){
        var me = this;
        if (me.rendered) {
            me.customBtnEL.remove();
            me.createFileInput();
            me.inputEl.dom.value = '';
        }
        me.callParent();
    },

    onDisable: function(){
        this.callParent();
        this.disableItems();
    },

    disableItems: function(){
        var file = this.customBtnEL;
        if (file) {
            file.dom.disabled = true;
        }
        this['buttonEl-btnEl'].dom.disabled = true;
    },

    onEnable: function(){
        var me = this;
        me.callParent();
        me.customBtnEL.dom.disabled = false;
        this['buttonEl-btnEl'].dom.disabled = true;
    },

//    isFileUpload: function() {
//        return true;
//    },

//    extractFileInput: function() {
//        var fileInput = this.fileInputEl.dom;
//        this.reset();
//        return fileInput;
//    },

    onDestroy: function(){
        Ext.destroyMembers(this, 'customBtnEL', 'buttonEl');
        this.callParent();
    }

});
