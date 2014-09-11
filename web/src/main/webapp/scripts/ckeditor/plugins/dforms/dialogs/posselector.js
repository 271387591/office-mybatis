/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'posselector', function( editor )
{
	var autoAttributes =
	{
		value : 1,
		size : 1,
		maxLength : 1
	};

	var acceptedTypes =
	{
		text : 1,
		password : 1
	};
	return {
		title : editor.lang.dforms.posselector.title,
		minWidth : 350,
		minHeight : 160,
		onShow : function()
		{
			delete this.textField;

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "input" &&
					( acceptedTypes[ element.getAttribute( 'type' ) ] || !element.getAttribute( 'type' ) ) )
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
			element.setAttribute( 'xtype', 'posselector' );
			element.setAttribute('class'	, 'x-form-text x-form-field' );
			if ( isInsertMode )
				editor.insertElement( element );
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
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.forms.textfield.title,
				title : editor.lang.forms.textfield.title,
				elements : [
					{
						type : 'hbox',
						widths : [ '50%', '50%' ],
						children :
						[
							{
								id : '_cke_saved_name',
								type : 'text',
								label : editor.lang.forms.textfield.name,
								'default' : '',
								accessKey : 'N',
								validate : CKEDITOR.dialog.validate.notEmpty('岗位名称不能为空'),
								setup : function( element )
								{
									this.setValue(
											element.data( 'cke-saved-name' ) ||
											element.getAttribute( 'name' ) ||
											'' );
								},
								commit : function( data )
								{
									var element = data.element;

									if ( this.getValue() )
										element.data( 'cke-saved-name', this.getValue() );
									else
									{
										element.data( 'cke-saved-name', false );
										element.removeAttribute( 'name' );
									}
								}
							},
							{
								id : 'txtlabel',
								type : 'text',
								validate : CKEDITOR.dialog.validate.notEmpty('岗位的标签不能为空'),
								label : editor.lang.dforms.dcommon.txtlabel,
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
						]
					},
//					{
//						type : 'hbox',
//						widths : [ '50%', '50%' ],
//						children :
//						[
//							{
//								id : 'width',
//								type : 'text',
//								label : editor.lang.common.width,
//								'default' : '',
//								accessKey : 'C',
//								style : 'width:50px',
//								validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
//								setup : function( element )
//								{
//									this.setValue( element.getAttribute( 'width' ) );
//								},
//								commit : function( data )
//								{
//									var element = data.element;
//									element.setAttribute( 'width', this.getValue() );
//									if(this.getValue()){
//										element.setStyle('width',this.getValue()+'px');
//									}
//								}
//							},{
//								id : 'txtsize',
//								type : 'text',
//								label : editor.lang.forms.textfield.charWidth,
//								'default' : '',
//								accessKey : 'S',
//								style : 'width:50px',
//								validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed )
//							}
//						],
//						onLoad : function()
//						{
//							// Repaint the style for IE7 (#6068)
//							if ( CKEDITOR.env.ie7Compat )
//								this.getElement().setStyle( 'zoom', '100%' );
//						}
//					},
//                    {
//                        id : 'txtvaluetype',
//                        type : 'select',
//                        label : editor.lang.dforms.dtextfield.datatype,
//                        'default' : 'varchar',
//                        accessKey : 'T',
//                        items :
//                            [
//                                [ editor.lang.dforms.dtextfield.typeVarchar, 'varchar' ],
//                                [ editor.lang.forms.textfield.typeText, 'text' ],
//                                [ editor.lang.dforms.dtextfield.typeInt, 'int' ],
//                                [ editor.lang.dforms.dtextfield.typeBigInt, 'bigint' ],
//                                [ editor.lang.dforms.dtextfield.typeSmallInt, 'smallint' ],
//                                [ editor.lang.dforms.dtextfield.typeDouble, 'double' ],
//                                [ editor.lang.dforms.dtextfield.typeFloat, 'float' ],
//                                [ editor.lang.dforms.dtextfield.typeDecimal, 'decimal' ]
//                            ],
//                        setup : function( element )
//                        {
//                            this.setValue( element.getAttribute( 'txtvaluetype' ) );
//                        },
//                        commit : function( data )
//                        {
//                            var element = data.element;
//                            element.setAttribute( 'txtvaluetype', this.getValue() );
//                        }
//                    },
					{
						type : 'hbox',
						widths : [ '50%', '50%' ],
						children :
						[
							{
									id : 'txtisnotnull',
									type : 'checkbox',
									label : editor.lang.dforms.dtextfield.txtisnotnull,
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
									commit : function( data )
									{
										var element = data.element;
										var value = this.getValue();
										if ( value )
											element.setAttribute( 'txtisnotnull','1');
										else
											element.setAttribute( 'txtisnotnull','0');
									}
							},{
								id : 'issingle',
								type : 'checkbox',
								label : editor.lang.dforms.userselector.issingle,
								'default' : '',
								accessKey : 'P',
								value : "checked",
								setup : function( element )
								{
								    var value=element.getAttribute( 'issingle' );
								    if(value==1){
								    	this.setValue(true);
								    }
								},
								commit : function( data )
								{
									var element = data.element;
									var value = this.getValue();
									if ( value )
										element.setAttribute( 'issingle','1');
									else
										element.setAttribute( 'issingle','0');
								}
						}
					]}
				]
			}
		]
	};
});
