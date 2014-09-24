/*
 * Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
CKEDITOR.dialog.add('datefield', function(editor) {
    var autoAttributes = {
        value : 1,
        size : 1,
        maxLength : 1
    };

    var acceptedTypes = {
        text : 1,
        password : 1
    };

    return {
        title : editor.lang.dforms.datefield.title,
        minWidth : 350,
        minHeight : 160,
        onShow : function() {
            delete this.textField;

            var element = this.getParentEditor().getSelection().getSelectedElement();
            if (element && element.getName() == "input" && (acceptedTypes[element.getAttribute('type')] || !element.getAttribute('type'))) {
                this.textField = element;
                this.setupContent(element);
            }
        },
        onOk : function() {
            var editor, element = this.textField, isInsertMode = !element;

            if (isInsertMode) {
                editor = this.getParentEditor();
                element = editor.document.createElement('input');
                element.setAttribute('type', 'text');

            }
            element.setAttribute('xtype', 'datefield');
//            element.setAttribute('class', 'x-form-text x-form-field');
            if (isInsertMode)
                editor.insertElement(element);
            this.commitContent({
                        element : element
                    });
        },
        onLoad : function() {
            var autoSetup = function(element) {
                var value = element.hasAttribute(this.id) && element.getAttribute(this.id);
                this.setValue(value || '');
            };

            var autoCommit = function(data) {
                var element = data.element;
                var value = this.getValue();

                if (value)
                    element.setAttribute(this.id, value);
                else
                    element.removeAttribute(this.id);
            };

            this.foreach(function(contentObj) {
                        if (autoAttributes[contentObj.id]) {
                            contentObj.setup = autoSetup;
                            contentObj.commit = autoCommit;
                        }
                    });
        },
        contents : [{
                    id : 'info',
                    label : editor.lang.forms.textfield.title,
                    title : editor.lang.forms.textfield.title,
                    elements : [{
                                type : 'hbox',
                                widths : ['50%', '50%'],
                                children : [{
                                            id : '_cke_saved_name',
                                            type : 'text',
                                            label : editor.lang.forms.textfield.name,
                                            'default' : '',
                                            accessKey : 'N',
                                            validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dforms.dcommon.validatename),
                                            setup : function(element) {
                                                this.setValue(element.data('cke-saved-name') || element.getAttribute('name') || '');
                                            },
                                            commit : function(data) {
                                                var element = data.element;

                                                if (this.getValue())
                                                    element.data('cke-saved-name', this.getValue());
                                                else {
                                                    element.data('cke-saved-name', false);
                                                    element.removeAttribute('name');
                                                }
                                            }
                                        },
                                    {
                                            id : 'txtlabel',
                                            type : 'text',
                                            validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dforms.dcommon.validatetextlable),
                                            label : editor.lang.dforms.dcommon.txtlabel,
                                            'default' : '',
                                            accessKey : 'V',
                                            setup : function(element) {
                                                this.setValue(element.getAttribute('txtlabel') || '');
                                            },
                                            commit : function(data) {
                                                var element = data.element;
                                                element.setAttribute('txtlabel', this.getValue());
                                            }
                                        }
                                ]
                            }, {
                                type : 'hbox',
                                widths : ['50%', '50%'],
                                children : [
                                    {
                                        id : 'txtvaluetype',
                                        type : 'select',
                                        label : editor.lang.dforms.dtextfield.dateformat,
                                        'default' : 'yyyy-MM-dd',
                                        accessKey : 'T',
                                        items : [['yyyy-MM-dd'], ['yyyy-MM-dd HH:mm:ss']],
                                        setup : function(element) {
                                            this.setValue(element.getAttribute('txtvaluetype'));
                                        },
                                        commit : function(data) {
                                            var element = data.element;
                                            element.setAttribute('txtvaluetype', this.getValue());
                                        }
                                    }
//                                    {
//                                        id : 'dataformat',
//                                        type : 'select',
//                                        label : editor.lang.dforms.datefield.datetype,
//                                        'default' : 'yyyy-MM-dd',
//                                        accessKey : 'T',
//                                        items : [['yyyy-MM-dd'], ['yyyy-MM-dd HH:mm:ss']],
//                                        setup : function(element) {
//                                            this.setValue(element.getAttribute('dataformat'));
//                                        },
//                                        commit : function(data) {
//                                            var element = data.element;
//                                            element.setAttribute('dataformat', this.getValue());
//                                        }
//                                    }
                                ]
                            } 
//                        {
//                                type : 'hbox',
//                                widths : ['50%', '50%'],
//                                children : [{
//                                            id : 'txtisnotnull',
//                                            type : 'checkbox',
//                                            label : editor.lang.dforms.dtextfield.txtisnotnull,
//                                            'default' : '',
//                                            accessKey : 'P',
//                                            value : "checked",
//                                            setup : function(element) {
//                                                var value = element.getAttribute('xvtype');
//                                                if (value == 'notNull') {
//                                                    this.setValue(true);
//                                                }
//                                            },
//                                            commit : function(data) {
//                                                var element = data.element;
//                                                var value = this.getValue();
//                                                if (value)
//                                                    element.setAttribute('xvtype', 'notNull');
//                                                else
//                                                    element.setAttribute('xvtype', 'notVal');
//                                            }
//                                        } 
//                                    {
//                                            id : 'iscurrent',
//                                            type : 'checkbox',
//                                            label : editor.lang.dforms.datefield.istoday,
//                                            'default' : '',
//                                            accessKey : 'P',
//                                            value : "checked",
//                                            setup : function(element) {
//                                                var value = element.getAttribute('iscurrent');
//                                                if (value == 1) {
//                                                    this.setValue(true);
//                                                }
//                                            },
//                                            commit : function(data) {
//                                                var element = data.element;
//                                                var value = this.getValue();
//                                                if (value)
//                                                    element.setAttribute('iscurrent', '1');
//                                                else
//                                                    element.setAttribute('iscurrent', '0');
//                                            }
//                                        }
//                                ]
//                            }
                    ]
                }]
    };
});
