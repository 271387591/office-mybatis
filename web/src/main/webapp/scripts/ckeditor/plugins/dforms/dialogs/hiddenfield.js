/*
 * Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
CKEDITOR.dialog.add('dhiddenfield', function(editor) {
			return {
				title : editor.lang.hidden.title,
				hiddenField : null,
				minWidth : 350,
				minHeight : 130,
				onShow : function() {
					delete this.hiddenField;

					var editor = this.getParentEditor(), selection = editor.getSelection(), element = selection.getSelectedElement();

					if (element && element.data('cke-real-element-type') && element.data('cke-real-element-type') == 'dhiddenfield') {
						this.hiddenField = element;
						element = editor.restoreRealElement(this.hiddenField);
						this.setupContent(element);
						selection.selectElement(this.hiddenField);
					}
				},
				onOk : function() {
					var name = this.getValueOf('info', '_cke_saved_name'), editor = this.getParentEditor(), element = CKEDITOR.env.ie && !(CKEDITOR.document.$.documentMode >= 8) ? editor.document.createElement('<input name="'
							+ CKEDITOR.tools.htmlEncode(name) + '">') : editor.document.createElement('input');

					element.setAttribute('type', 'hidden');
					this.commitContent(element);
					var fakeElement = editor.createFakeElement(element, 'cke_hidden', 'dhiddenfield');
					if (!this.hiddenField)
						editor.insertElement(fakeElement);
					else {
						fakeElement.replace(this.hiddenField);
						editor.getSelection().selectElement(fakeElement);
					}
					return true;
				},
				contents : [{
							id : 'info',
							label : editor.lang.hidden.title,
							title : editor.lang.hidden.title,
							elements : [{
										type : 'hbox',
										widths : ['50%', '50%'],
										children : [{
													id : '_cke_saved_name',
													type : 'text',
													label : editor.lang.hidden.name,
													validate: CKEDITOR.dialog.validate.colNameValidate(
															editor.lang.common.name+ editor.lang.dcommon.colNameValidate),
													'default' : '',
													accessKey : 'N',
													setup : function(element) {
														this.setValue(element.data('cke-saved-name') || element.getAttribute('name') || '');
													},
													commit : function(element) {
														if (this.getValue())
															element.setAttribute('name', this.getValue());
														else {
															element.removeAttribute('name');
														}
													}
												}, {
													id : 'txtlabel',
													type : 'text',
													validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dcommon.txtlabel + editor.lang.dcommon.validateEmpty),
													label : editor.lang.dcommon.txtlabel,
													'default' : '',
													accessKey : 'V',
													setup : function(element) {
														this.setValue(element.getAttribute('txtlabel') || '');
													},
													commit : function(element) {
														element.setAttribute('txtlabel', this.getValue());
													}
												}]
									},{
										type : 'hbox',
										widths : ['50%', '50%'],
										children : [{
											id : 'txtvaluetype',
											type : 'select',
											label : editor.lang.dtextfield.datatype,
											'default' : 'varchar',
											accessKey : 'T',
											items :
											[
												[ editor.lang.dtextfield.typeVarchar, 'varchar' ],
												[ editor.lang.textfield.typeText, 'text' ],
												[ editor.lang.dtextfield.typeInt, 'int' ],
												[ editor.lang.dtextfield.typeBigInt, 'bigint' ],
												[ editor.lang.dtextfield.typeSmallInt, 'smallint' ],
												[ editor.lang.dtextfield.typeDouble, 'double' ],
												[ editor.lang.dtextfield.typeFloat, 'float' ],
												[ editor.lang.dtextfield.typeDecimal, 'decimal' ]
											],
											setup : function( element )
											{
												this.setValue( element.getAttribute( 'txtvaluetype' ) );
											},
											commit : function( element )
											{
												element.setAttribute( 'txtvaluetype', this.getValue() );
											}
										},
										{
											id : 'txtsize',
											type : 'text',
											label : editor.lang.textfield.charWidth,
											'default' : '',
											accessKey : 'M',
											style : 'width:50px',
											validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
											setup : function( element )
											{
												this.setValue( element.getAttribute( 'txtsize' ) );
											},
											commit : function( element )
											{
												element.setAttribute( 'txtsize', this.getValue() );
											}
										}]
									},{
										id : 'txtisprimary',
										type : 'checkbox',
										label : editor.lang.dtextfield.txtisprimary,
										'default' : '',
										accessKey : 'P',
										value : "checked",
										setup : function( element )
										{
										    var value=element.getAttribute( 'txtisprimary' );
										    if(value==1){
										    	this.setValue(true);
										    }
										},
										commit : function( element )
										{
//											var element = data.element;
											var value = this.getValue();
											if ( value )
												element.setAttribute( 'txtisprimary','1');
											else
												element.setAttribute( 'txtisprimary','0');
										}
								}]
						}]
			};
		});
