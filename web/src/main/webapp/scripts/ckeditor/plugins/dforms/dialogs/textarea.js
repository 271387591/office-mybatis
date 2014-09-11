/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'dtextarea', function( editor )
{
	return {
		title : editor.lang.textarea.title,
		minWidth : 350,
		minHeight : 250,
		onShow : function()
		{
			delete this.textarea;

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "textarea" )
			{
				this.textarea = element;
				this.setupContent( element );
			}
		},
		onOk : function()
		{
			var editor,
				element = this.textarea,
				isInsertMode = !element;

			if ( isInsertMode )
			{
				editor = this.getParentEditor();
				element = editor.document.createElement( 'textarea' );
			}
			
			element.setAttribute('class'	, 'x-form-textarea x-form-field x-column' );
			this.commitContent( element );

			if ( isInsertMode )
				editor.insertElement( element );
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.textarea.title,
				title : editor.lang.textarea.title,
				elements : [
					{
						type : 'hbox',
						widths:['50%','50%'],
						children:[{
							id : '_cke_saved_name',
							type : 'text',
							label : editor.lang.common.name,
							validate : CKEDITOR.dialog.validate.colNameValidate(
									editor.lang.common.name+ editor.lang.dcommon.colNameValidate),
							'default' : '',
							accessKey : 'N',
							setup : function( element )
							{
								this.setValue(
										element.data( 'cke-saved-name' ) ||
										element.getAttribute( 'name' ) ||
										'' );
							},
							commit : function( element )
							{
								if ( this.getValue() )
									element.data( 'cke-saved-name', this.getValue() );
								else
								{
									element.data( 'cke-saved-name', false );
									element.removeAttribute( 'name' );
								}
							}
						},{
							id : 'txtlabel',
							type : 'text',
							label : editor.lang.dcommon.txtlabel,
							validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dcommon.txtlabel+ editor.lang.dcommon.validateEmpty),
							'default' : '',
							accessKey : 'L',
							setup : function( element )
							{
								this.setValue(element.getAttribute( 'txtlabel' ) ||'' );
							},
							commit : function( element )
							{
								element.setAttribute( 'txtlabel', this.getValue() );
							}
						}
					]},
					{
						type : 'hbox',
						widths:['50%','50%'],
						children:[{
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
						},{
							id : 'width',
							type : 'text',
							label : editor.lang.common.width,
							'default' : '',
							accessKey : 'C',
							style : 'width:50px',
							validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
							setup : function( element )
							{
								this.setValue( element.getAttribute( 'width' ) );
							},
							commit : function( element )
							{
								element.setAttribute( 'width', this.getValue() );
								if(this.getValue()){
									element.setStyle('width',this.getValue()+'px');
								}
							}
						}
					]},
					{
						type : 'hbox',
						widths:['50%','50%'],
						children:[
							{
								id : 'cols',
								type : 'text',
								label : editor.lang.textarea.cols,
								'default' : '',
								accessKey : 'C',
								style : 'width:50px',
								validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
								setup : function( element )
								{
									var value = element.hasAttribute( 'cols' ) && element.getAttribute( 'cols' );
									this.setValue( value || '' );
								},
								commit : function( element )
								{
									if ( this.getValue() )
										element.setAttribute( 'cols', this.getValue() );
									else
										element.removeAttribute( 'cols' );
								}
							},
							{
								id : 'rows',
								type : 'text',
								label : editor.lang.textarea.rows,
								'default' : '',
								accessKey : 'R',
								style : 'width:50px',
								validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
								setup : function( element )
								{
									var value = element.hasAttribute( 'rows' ) && element.getAttribute( 'rows' );
									this.setValue( value || '' );
								},
								commit : function( element )
								{
									if ( this.getValue() )
										element.setAttribute( 'rows', this.getValue() );
									else
										element.removeAttribute( 'rows' );
								}
							}
						]
					},
					{
						id : 'value',
						type : 'textarea',
						label : editor.lang.textfield.value,
						'default' : '',
						setup : function( element )
						{
							this.setValue( element.$.defaultValue );
						},
						commit : function( element )
						{
							element.$.value = element.$.defaultValue = this.getValue() ;
						}
					},
					{
						id : 'txtisnotnull',
						type : 'checkbox',
						label : editor.lang.dtextfield.txtisnotnull,
						'default' : '',
						accessKey : 'P',
						value : "checked",
						setup : function( element )
						{
						    var value=element.getAttribute( 'txtisnotnull' );
						    if(value==1){
						    	this.setValue(true);
						    }
						},
						commit : function( element )
						{
							var value = this.getValue();
							if ( value )
								element.setAttribute( 'txtisnotnull','1');
							else
								element.setAttribute( 'txtisnotnull','0');
						}
				}

				]
			}
		]
	};
});
