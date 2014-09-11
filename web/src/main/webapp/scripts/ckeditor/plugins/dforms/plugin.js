/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Forms Plugin
 */

CKEDITOR.plugins.add( 'dforms',
{
	lang : [ 'zh_cn'],
	init : function( editor )
	{
        var path = this.path;
		var lang = editor.lang;

//		editor.addCss(
//			'form' +
//			'{' +
//				'border: 1px dotted #FF0000;' +
//				'padding: 2px;' +
//			'}\n' );
//
//		editor.addCss(
//			'img.cke_hidden' +
//			'{' +
//				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/hiddenfield.gif' ) + ');' +
//				'background-position: center center;' +
//				'background-repeat: no-repeat;' +
//				'border: 1px solid #a9a9a9;' +
//				'width: 16px !important;' +
//				'height: 16px !important;' +
//			'}' );

		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, commandName, dialogFile )
		{
			editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName ) );
			var name=buttonName.charAt(0).toLowerCase() + buttonName.slice(1);
			editor.ui.addButton( buttonName,
				{
                    icon : path+'images/'+commandName+'.png',
					label : lang.dforms.dcommon[name],
					command : commandName
				});
			CKEDITOR.dialog.add( commandName, dialogFile );
		};

		var dialogPath = this.path + 'dialogs/';
		addButtonCommand( 'DCheckbox',		'dcheckbox',	dialogPath + 'checkbox.js' );
		addButtonCommand( 'DRadio',			'dradio',		dialogPath + 'radio.js' );
		addButtonCommand( 'DTextField',		'dtextfield',	dialogPath + 'textfield.js' );
		addButtonCommand( 'DTextArea',		'dtextarea',	dialogPath + 'textarea.js' );
		addButtonCommand( 'DateField',		'datefield',	dialogPath + 'datefield.js' );
		addButtonCommand( 'BoxGroup',		'boxgroup',	dialogPath + 'boxgroup.js' );
		addButtonCommand( 'UserSelector',	'userselector',	dialogPath + 'userselector.js' );
		addButtonCommand( 'DepSelector',	'depselector',	dialogPath + 'depselector.js' );
		addButtonCommand( 'PosSelector',	'posselector',	dialogPath + 'posselector.js' );
		addButtonCommand( 'DSelect',		'dselect',		dialogPath + 'dselect.js' );
		addButtonCommand( 'DHiddenField',	'dhiddenfield',	dialogPath + 'hiddenfield.js' );
		addButtonCommand( 'Ckeditor',	'ckeditor',	dialogPath + 'ckeditor.js' );
		addButtonCommand( 'Commoneditor',	'commoneditor',	dialogPath + 'commoneditor.js' );
		addButtonCommand( 'Officeeditor',	'officeeditor',	dialogPath + 'officeeditor.js' );
		addButtonCommand( 'Fileattach',	'fileattach',	dialogPath + 'fileattach.js' );
		addButtonCommand( 'Grid',	'grid',	dialogPath + 'grid.js' );
		addButtonCommand( 'GridProperties','gridProperties', dialogPath + 'grid.js' );
		addButtonCommand( 'Diccombo','diccombo', dialogPath + 'diccombo.js' );
		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					dtextfield :
					{
						label : lang.forms.textfield.title,
						command : 'dtextfield',
						group : 'dtextfield'
					},
					dtextarea :
					{
						label:lang.forms.textarea.title,
						command:'dtextarea',
						group:'dtextarea'
						
					},
					dcheckbox : 
					{
						label : lang.forms.checkboxAndRadio.checkboxTitle,
						command : 'dcheckbox',
						group : 'dcheckbox'
					},
					dradio : 
					{
						label : lang.forms.checkboxAndRadio.checkboxTitle,
						command : 'dradio',
						group : 'dradio'
					},
                    boxgroup:
                    {
                        label : lang.dforms.boxgroup.title,
                        command : 'boxgroup',
                        group : 'boxgroup'
                    },
					userselector : 
					{
						label : lang.dforms.userselector.title,
						command : 'userselector',
						group : 'userselector'
					},
					datefield : 
					{
						label : lang.dforms.datefield.title,
						command : 'datefield',
						group : 'datefield'
					},
					depselector : 
					{
						label : lang.dforms.depselector.title,
						command : 'depselector',
						group : 'depselector'
					},
					posselector : 
					{
						label : lang.dforms.posselector.title,
						command : 'posselector',
						group : 'posselector'
					},
					dselect : 
					{
						label : lang.dforms.dselect.title,
						command : 'dselect',
						group : 'dselect'
					},
					dhiddenfield : 
					{
						label : lang.dforms.dhiddenfield.title,
						command : 'dhiddenfield',
						group : 'dhiddenfield'
					},
					dselect : 
					{
						label : lang.dforms.dselect.title,
						command : 'dselect',
						group : 'dselect'
					},
					ckeditor : 
					{
						label : lang.dforms.ckeditor.title,
						command : 'ckeditor',
						group : 'ckeditor'
					},
					officeeditor : 
					{
						label : lang.dforms.officeeditor.title,
						command : 'officeeditor',
						group : 'officeeditor'
					},
					fileattach:
					{
						label : lang.dforms.fileattach.title,
						command : 'fileattach',
						group : 'fileattach'
					},
					grid :
					{
						label : lang.dforms.grid.title,
						command : 'gridProperties',
						group : 'grid'
					},
					griddelete:{
						label : lang.dforms.griddelete.title,
						command : 'dtableDelete',
						group : 'dtable'
					},
					commoneditor:{
						label : lang.dforms.commoneditor.title,
						command : 'commoneditor',
						group : 'commoneditor'
					},
					diccombo:{
						label:lang.dforms.diccombo.title,
						command:'diccombo',
						group : 'diccombo'
					}
				});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element )
				{
					if ( element && element.hasAscendant( 'form', true ) && !element.isReadOnly() )
						return { form : CKEDITOR.TRISTATE_OFF };
				});

			editor.contextMenu.addListener( function( element )
				{
					if ( element && !element.isReadOnly() )
					{
						var name = element.getName();
						var back={};
						if(element.hasAscendant('table',1)&&element.getAscendant('table',1).hasAttribute( 'isdetail'))
						{
							back={
								griddelete : CKEDITOR.TRISTATE_OFF,
								grid : CKEDITOR.TRISTATE_OFF
							};
						}
						
						if ( name == 'select' ){
							back['dselect']=CKEDITOR.TRISTATE_OFF;
							return back;
						}
						if ( name == 'textarea' ){
							var xtype=element.getAttribute('xtype');
						    if(xtype=='fckeditor'){
						    	back['ckeditor']=CKEDITOR.TRISTATE_OFF;
								return back;
						    }else if(xtype=='officeeditor'){
						    	back['officeeditor']=CKEDITOR.TRISTATE_OFF;
								return back;
						    }else if(xtype=='fileattach'){
						    	back['fileattach']=CKEDITOR.TRISTATE_OFF;
								return back;
						    }else if(xtype=='commoneditor'){
						    	back['commoneditor']=CKEDITOR.TRISTATE_OFF;
								return back;
						    }else 
						    	back['dtextarea']=CKEDITOR.TRISTATE_OFF;
							    return back;
						}
						if ( name == 'input' )
						{
							switch( element.getAttribute( 'type' ) )
							{
								case 'button' :
								case 'submit' :
								case 'reset' :
									back['button']=CKEDITOR.TRISTATE_OFF;
								    return back;

								case 'checkbox' :
									back['dcheckbox']=CKEDITOR.TRISTATE_OFF;
								    return back;

								case 'radio' :
									back['dradio']=CKEDITOR.TRISTATE_OFF;
								    return back;
								
								case 'hidden' : 
									back['dhiddenfield']=CKEDITOR.TRISTATE_OFF;
								    return back;
									
								case 'image' :
									back['imagebutton']=CKEDITOR.TRISTATE_OFF;
								    return back;

								default :
									var xtype=element.getAttribute('xtype');
								    if(xtype=='userselector'){
								    	back['userselector']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
								    else if(xtype=='datefield'){
								    	back['datefield']=CKEDITOR.TRISTATE_OFF;
								    	return back;
								    }
								    else if(xtype=='depselector'){
								    	back['depselector']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
								    else if(xtype=='posselector'){
								    	back['posselector']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
								    else if(xtype=='diccombo'){
								    	back['diccombo']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
                                    else if(xtype=='boxgroup'){
								    	back['boxgroup']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
								    else if(xtype){
								    	editor.removeMenuItem('textfield');
								    	back['dtextfield']=CKEDITOR.TRISTATE_OFF;
									    return back;
								    }
                                    
								    
								    back['textfield']=CKEDITOR.TRISTATE_OFF;
								    return back;
							}
						}
						
						

						if ( name == 'img' && element.data( 'cke-real-element-type' ) == 'dhiddenfield' )
						{
							back['dhiddenfield']=CKEDITOR.TRISTATE_OFF;
						    return back;
						}
						
						return back;
					
						
					}
					
					return null;
				});
			
			
		}

		editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'form' ) )
					evt.data.dialog = 'form';
				else if ( element.is( 'select' ) ){
                    if(element.getAttribute('xtype') == 'entitySelect'){
                        evt.data.dialog = 'dselect';
                    }else{
                        evt.data.dialog = 'select';
                    }
                }
				else if ( element.is( 'textarea' ) ){
					var xtype=element.getAttribute('xtype');
					if(xtype=='fckeditor'){
						evt.data.dialog = 'ckeditor';
					}else if(xtype=='officeeditor'){
						evt.data.dialog = 'officeeditor';
					}else if(xtype=='commoneditor'){
						evt.data.dialog = 'commoneditor';
					}else{
						evt.data.dialog = 'textarea';
					}
					
				}
				else if ( element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'dhiddenfield' )
					evt.data.dialog = 'dhiddenfield';
				else if ( element.is( 'input' ) )
				{
					switch ( element.getAttribute( 'type' ) )
					{
						case 'button' :
						case 'submit' :
						case 'reset' :
							evt.data.dialog = 'button';
							break;
						case 'checkbox' :
							evt.data.dialog = 'checkbox';
							break;
						case 'radio' :
							evt.data.dialog = 'radio';
							break;
						case 'image' :
							evt.data.dialog = 'imagebutton';
							break;
                        case 'textfield' :
                            evt.data.dialog = 'textfield';
						default :
							var xtype=element.getAttribute('xtype');
						    if(xtype=='userselector'){
						    	evt.data.dialog = 'userselector';
						    }else if(xtype=='datefield'){
						    	evt.data.dialog = 'datefield';
						    }else if(xtype=='diccombo'){
						    	evt.data.dialog = 'diccombo';
						    }else if(xtype=='depselector'){
						    	evt.data.dialog = 'depselector';
						    }else if(xtype=='posselector'){
						    	evt.data.dialog = 'posselector';
						    }else{
                                evt.data.dialog = 'textfield';
                            }
							break;
					}
				}
			});
	},

	afterInit : function( editor )
	{
		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;

		// Cleanup certain IE form elements default values.
		if ( CKEDITOR.env.ie )
		{
			htmlFilter && htmlFilter.addRules(
			{
				elements :
				{
					input : function( input )
					{
						var attrs = input.attributes,
							type = attrs.type;
						// Old IEs don't provide type for Text inputs #5522
						if ( !type )
							attrs.type = 'text';
						if ( type == 'checkbox' || type == 'radio' )
							attrs.value == 'on' && delete attrs.value;
					}
				}
			} );
		}

		if ( dataFilter )
		{
			dataFilter.addRules(
			{
				elements :
				{
					input : function( element )
					{
						if ( element.attributes.type == 'hidden' )
							return editor.createFakeParserElement( element, 'cke_hidden', 'dhiddenfield' );
					}
				}
			} );
		}
	},
	requires : [ 'image', 'fakeobjects' ]
} );

if ( CKEDITOR.env.ie )
{
	CKEDITOR.dom.element.prototype.hasAttribute = CKEDITOR.tools.override( CKEDITOR.dom.element.prototype.hasAttribute,
		function( original )
		{
			return function( name )
				{
					var $attr = this.$.attributes.getNamedItem( name );

					if ( this.getName() == 'input' )
					{
						switch ( name )
						{
							case 'class' :
								return this.$.className.length > 0;
							case 'checked' :
								return !!this.$.checked;
							case 'value' :
								var type = this.getAttribute( 'type' );
								return type == 'checkbox' || type == 'radio' ? this.$.value != 'on' : this.$.value;
						}
					}

					return original.apply( this, arguments );
				};
		});
}
