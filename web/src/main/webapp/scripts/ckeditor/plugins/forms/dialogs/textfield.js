/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.dialog.add("textfield", function (b) {
    var autoAttributes =
    {
        value : 1,
        size : 1,
        maxLength : 1
    };

    var acceptedTypes =
    {
        textfield : 1,
        numberfield : 1
    };

    return {
        title : b.lang.forms.textfield.title,
        minWidth : 350,
        minHeight : 130,
        onShow : function()
        {
            delete this.textField;

            var element = this.getParentEditor().getSelection().getSelectedElement();
            if ( element && element.getName() == "input" &&
                ( acceptedTypes[ element.getAttribute( 'xtype' ) ] || !element.getAttribute( 'xtype' ) ) )
            {
                this.textField = element;
                this.setupContent( element );
            }
        },
        onOk : function()
        {
            var editor,
                element = this.textField,
                isInsertMode = !element;

            if ( isInsertMode )
            {
                editor = this.getParentEditor();
                element = editor.document.createElement( 'input' );
                element.setAttribute( 'type', 'text' );
            }
//            element.setAttribute('class'	, 'x-form-text x-form-field' );

            if ( isInsertMode )
                editor.insertElement( element );
            element.setAttribute('xtype','textfield');
            this.commitContent( { element : element } );
        },
        onLoad : function()
        {
            var autoSetup = function( element )
            {
                var value = element.hasAttribute( this.id ) && element.getAttribute( this.id );
                this.setValue( value || '' );
            };

            var autoCommit = function( data )
            {
                var element = data.element;
                var value = this.getValue();

                if ( value )
                    element.setAttribute( this.id, value );
                else
                    element.removeAttribute( this.id );
            };

            this.foreach( function( contentObj )
            {
                if ( autoAttributes[ contentObj.id ] )
                {
                    contentObj.setup = autoSetup;
                    contentObj.commit = autoCommit;
                }
            } );
        }, contents: [
        {id: "info", label: b.lang.forms.textfield.title, title: b.lang.forms.textfield.title,
            elements: [
                {type: "hbox", widths: ["50%", "50%"], children: [
                    {id: "_cke_saved_name", type: "text", label: b.lang.forms.textfield.name, "default": "", accessKey: "N",validate : CKEDITOR.dialog.validate.notEmpty(b.lang.dforms.dcommon.validatename), setup: function (a) {
                        this.setValue(a.data("cke-saved-name") || a.getAttribute("name") || "")
                    }, commit: function (a) {
                        a = a.element;
                        this.getValue() ? a.data("cke-saved-name", this.getValue()) : (a.data("cke-saved-name", !1), a.removeAttribute("name"))
                    }},
                    {
                        id : 'txtlabel',
                        type : 'text',
                        validate : CKEDITOR.dialog.validate.notEmpty(b.lang.dforms.dcommon.validatetextlable),
                        label : b.lang.dforms.dcommon.txtlabel,
                        'default' : '',
                        accessKey : 'V',
                        setup : function( element )
                        {
                            this.setValue(element.getAttribute( 'txtlabel' ) ||
                                '' );
                        },
                        commit : function( data )
                        {
                            var element = data.element;
                            element.setAttribute( 'txtlabel', this.getValue() );
                        }
                    }
                ]},
//                {id: "value", type: "text", label: b.lang.forms.textfield.value, "default": "", accessKey: "V", commit: function (a) {
//                    if (CKEDITOR.env.ie && !this.getValue()) {
//                        var c = a.element, d = new CKEDITOR.dom.element("input", b.document);
//                        c.copyAttributes(d, {value: 1});
//                        d.replace(c);
//                        a.element = d
//                    } else e.call(this, a)
//                }},
//                {type: "hbox", widths: ["50%", "50%"], children: [
//                    {id: "size", type: "text", label: b.lang.forms.textfield.charWidth, "default": "", accessKey: "C", style: "width:50px", validate: CKEDITOR.dialog.validate.integer(b.lang.common.validateNumberFailed)},
//                    {id: "maxLength", type: "text", label: b.lang.forms.textfield.maxChars, "default": "", accessKey: "M", style: "width:50px",
//                        validate: CKEDITOR.dialog.validate.integer(b.lang.common.validateNumberFailed)}
//                ], onLoad: function () {
//                    CKEDITOR.env.ie7Compat && this.getElement().setStyle("zoom", "100%")
//                }},
                {id: "type", type: "select", label: b.lang.dforms.dcommon.datatype, "default": "notVal", accessKey: "M", items: [
                    [b.lang.dforms.dtextfield.typeNumber, "number"],
                    [b.lang.dforms.dtextfield.typeVarchar, "string"]
                ], setup: function (a) {
                    this.setValue(a.getAttribute("datatype"))
                }, commit: function (a) {
                    var c = a.element;
                    var v=this.getValue();
                    if (CKEDITOR.env.ie) {
                        var d = c.getAttribute("datatype"), e = this.getValue();
                        d != e && (d = CKEDITOR.dom.element.createFromHtml('<input datatype="'+v+ '></input>', b.document), c.copyAttributes(d, {type: 1}), d.replace(c), a.element = d)
                    } else{
                        c.setAttribute("datatype", v)
                    } 
                }}
            ]}
    ]}
});