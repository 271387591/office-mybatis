/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'fileattach', function( editor )
{
	return {
		title : editor.lang.dforms.fileattach.title,
		minWidth : 350,
		minHeight : 130,
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
			element.setAttribute('xtype'	, 'fileattach' );
			element.setAttribute('txtvaluetype'	, 'varchar' );
			this.commitContent( element );

			if ( isInsertMode )
				editor.insertElement( element );
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.dforms.fileattach.title,
				title : editor.lang.dforms.fileattach.title,
				elements : [
					{
						type : 'hbox',
						widths:['50%','50%'],
						children:[{
							id : '_cke_saved_name',
							type : 'text',
							label : editor.lang.common.name,
							validate : CKEDITOR.dialog.validate.notEmpty('附件名称不能为空'),
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
						}
//                            {
//							id : 'txtlabel',
//							type : 'text',
//							label : editor.lang.dforms.dcommon.txtlabel,
//							validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dforms.dcommon.txtlabel+ editor.lang.dforms.dcommon.validateEmpty),
//							'default' : '',
//							accessKey : 'L',
//							setup : function( element )
//							{
//								this.setValue(element.getAttribute( 'txtlabel' ) ||'' );
//							},
//							commit : function( element )
//							{
//								element.setAttribute( 'txtlabel', this.getValue() );
//							}
//						}
					]},
					{
						type : 'hbox',
						widths:['50%','50%'],
						children:[{
							id : 'width',
							type : 'text',
							label : editor.lang.common.width,
							'default' : '',
							accessKey : 'C',
							style : 'width:50px',
							validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
							setup : function( element )
							{
							    var width=element.$.clientWidth;
							    if(!width){
							    	width=element.getAttribute( 'width' );
							    }
								this.setValue(width);
							},
							commit : function( element )
							{
								element.setAttribute( 'width', this.getValue() );
								if(this.getValue()){
									element.setStyle('width',this.getValue()+'px');
								}
							}
						},
						{
							id : 'txtheight',
							type : 'text',
							label : editor.lang.common.height,
							'default' : '',
							accessKey : 'H',
							style : 'width:50px',
							validate : CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
							setup : function( element )
							{
								var h=element.$.clientHeight;
							    if(!h){
							    	h=element.getAttribute( 'txtheight' );
							    }
								this.setValue( h || '' );
							},
							commit : function( element )
							{
								if ( this.getValue() ){
									element.setAttribute( 'txtheight', this.getValue() );
								    element.setStyle('height',this.getValue()+'px');
								}else
									element.removeAttribute( 'txtheight' );
							}
						}
					]}

				]
			}
		]
	};
});
