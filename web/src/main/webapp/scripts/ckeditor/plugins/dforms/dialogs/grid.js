(function()
{
	var defaultToPixel = CKEDITOR.tools.cssLength;

	var commitValue = function( data )
	{
		var id = this.id;
		if ( !data.info )
			data.info = {};
		data.info[id] = this.getValue();
	};

	function tableColumns( table )
	{
		var cols = 0, maxCols = 0;
		for ( var i = 0, row, rows = table.$.rows.length; i < rows; i++ )
		{
			row = table.$.rows[ i ], cols = 0;
			for ( var j = 0, cell, cells = row.cells.length; j < cells; j++ )
			{
				cell = row.cells[ j ];
				cols += cell.colSpan;
			}

			cols > maxCols && ( maxCols = cols );
		}

		return maxCols;
	}

	function gridDialog( editor, command )
	{
		var makeElement = function( name )
			{
				return editor.document.createElement(name);
			};

		var dialogadvtab = editor.plugins.dialogadvtab;

		return {
			title : editor.lang.dforms.grid.title,
			minWidth : 310,
			minHeight : CKEDITOR.env.ie ? 310 : 280,

			onLoad : function()
			{
				var dialog = this;

				var styles = dialog.getContentElement( 'advanced', 'advStyles' );

				if ( styles )
				{
					styles.on( 'change', function( evt )
						{
							// Synchronize width value.
							var width = this.getStyle( 'width', '' ),
								txtWidth = dialog.getContentElement( 'info', 'txtWidth' );

							txtWidth && txtWidth.setValue( width, true );

							// Synchronize height value.
							var height = this.getStyle( 'height', '' ),
								txtHeight = dialog.getContentElement( 'info', 'txtHeight' );

							txtHeight && txtHeight.setValue( height, true );
						});
				}
			},

			onShow : function()
			{
				// Detect if there's a selected table.
				var selection = editor.getSelection(),
					ranges = selection.getRanges(),
					selectedTable = null;

				var rowsInput = this.getContentElement( 'info', 'txtRows' ),
					colsInput = this.getContentElement( 'info', 'txtCols' ),
					widthInput = this.getContentElement( 'info', 'txtWidth' ),
					heightInput = this.getContentElement( 'info', 'txtHeight'),
				    isgrid = this.getContentElement( 'info', 'isgrid' );
				if ( command == 'gridProperties' )
				{
					if ( ( selectedTable = selection.getSelectedElement() ) )
						selectedTable = selectedTable.getAscendant( 'table', true );
					else if ( ranges.length > 0 )
					{
						// Webkit could report the following range on cell selection (#4948):
						// <table><tr><td>[&nbsp;</td></tr></table>]
						if ( CKEDITOR.env.webkit )
							ranges[ 0 ].shrink( CKEDITOR.NODE_ELEMENT );

						var rangeRoot = ranges[0].getCommonAncestor( true );
						selectedTable = rangeRoot.getAscendant( 'table', true );
					}

					// Save a reference to the selected table, and push a new set of default values.
					this._.selectedElement = selectedTable;
				}
                
				// Enable or disable the row, cols, width fields.
				if ( selectedTable )
				{
					this.setupContent( selectedTable );
					rowsInput && rowsInput.disable();
					colsInput && colsInput.disable();
				}
				else
				{
					rowsInput && rowsInput.enable();
					colsInput && colsInput.enable();
				}
				
//				rowsInput && rowsInput.disable();
				
//				isgrid.on('check',function(){alert('dd');});
				
				// Call the onChange method for the widht and height fields so
				// they get reflected into the Advanced tab.
				widthInput && widthInput.onChange();
				heightInput && heightInput.onChange();
			},
			onOk : function()
			{
                var editor = this.getParentEditor();
                var selection = editor.getSelection(),
                    bms = this._.selectedElement && selection.createBookmarks();

                var table = this._.selectedElement || makeElement( 'table' ),
                    me = this,
                    data = {};

                this.commitContent( data, table );

                if ( data.info )
                {
                    var info = data.info;

                    // Generate the rows and cols.
                    if ( !this._.selectedElement )
                    {
                        var tbody = table.append( makeElement( 'tbody' ) ),
                            rows = parseInt( info.txtRows, 10 ) || 0,
                            cols = parseInt( info.txtCols, 10 ) || 0;

                        for ( var i = 0 ; i < rows ; i++ )
                        {
                            var tr=makeElement( 'tr' );
//                            tr.setAttribute( 'class','tr-info');
                            tr.setStyle('border','1px solid');
                            var row = tbody.append(tr);
                            for ( var j = 0 ; j < cols ; j++ )
                            {
                                if(i==0){
                                    var th = makeElement( 'th' );
                                    th.setStyle('border','1px solid');
                                    var cell = row.append(th);
                                    if ( !CKEDITOR.env.ie )
                                        cell.append( makeElement( 'br' ) );
                                }else{
                                    var td= makeElement( 'td' );
//                                td.setAttribute( 'class','td-info')
                                    td.setStyle('border','1px solid');
                                    var cell = row.append(td);
                                    if ( !CKEDITOR.env.ie )
                                        cell.append( makeElement( 'br' ) );
                                }
                            }
                        }
                    }

                    // Modify the table headers. Depends on having rows and cols generated
                    // correctly so it can't be done in commit functions.

                    // Should we make a <thead>?
                    var headers = info.selHeaders;
                    if ( !table.$.tHead && ( headers == 'row' || headers == 'both' ) )
                    {
                        var thead = new CKEDITOR.dom.element( table.$.createTHead() );
                        tbody = table.getElementsByTag( 'tbody' ).getItem( 0 );
                        var theRow = tbody.getElementsByTag( 'tr' ).getItem( 0 );
                        // Change TD to TH:
                        for ( i = 0 ; i < theRow.getChildCount() ; i++ )
                        {
                            var th = theRow.getChild( i );
                            // Skip bookmark nodes. (#6155)
                            if ( th.type == CKEDITOR.NODE_ELEMENT && !th.data( 'cke-bookmark' ) )
                            {
                                th.renameNode( 'th' );
                                th.setAttribute( 'scope', 'col' );
                            }
                        }
                        thead.append( theRow.remove() );
                    }

                    if ( table.$.tHead !== null && !( headers == 'row' || headers == 'both' ) )
                    {
                        // Move the row out of the THead and put it in the TBody:
                        thead = new CKEDITOR.dom.element( table.$.tHead );
                        tbody = table.getElementsByTag( 'tbody' ).getItem( 0 );

                        var previousFirstRow = tbody.getFirst();
                        while ( thead.getChildCount() > 0 )
                        {
                            theRow = thead.getFirst();
                            for ( i = 0; i < theRow.getChildCount() ; i++ )
                            {
                                var newCell = theRow.getChild( i );
                                if ( newCell.type == CKEDITOR.NODE_ELEMENT )
                                {
                                    newCell.renameNode( 'td' );
                                    newCell.removeAttribute( 'scope' );
                                }
                            }
                            theRow.insertBefore( previousFirstRow );
                        }
                        thead.remove();
                    }

                    // Should we make all first cells in a row TH?
                    if ( !this.hasColumnHeaders && ( headers == 'col' || headers == 'both' ) )
                    {
                        for ( row = 0 ; row < table.$.rows.length ; row++ )
                        {
                            newCell = new CKEDITOR.dom.element( table.$.rows[ row ].cells[ 0 ] );
                            newCell.renameNode( 'th' );
                            newCell.setAttribute( 'scope', 'row' );
                        }
                    }

                    // Should we make all first TH-cells in a row make TD? If 'yes' we do it the other way round :-)
                    if ( ( this.hasColumnHeaders ) && !( headers == 'col' || headers == 'both' ) )
                    {
                        for ( i = 0 ; i < table.$.rows.length ; i++ )
                        {
                            row = new CKEDITOR.dom.element( table.$.rows[i] );
                            if ( row.getParent().getName() == 'tbody' )
                            {
                                newCell = new CKEDITOR.dom.element( row.$.cells[0] );
                                newCell.renameNode( 'td' );
                                newCell.removeAttribute( 'scope' );
                            }
                        }
                    }

                    // Set the width and height.
                    info.txtHeight ? table.setStyle( 'height', info.txtHeight ) : table.removeStyle( 'height' );
//                    info.txtWidth ? table.setStyle( 'width', info.txtWidth ) : table.removeStyle( 'width' );
                    table.setStyle('border','1px solid');
                    table.setStyle('border-collapse','collapse');
                    table.setStyle( 'width', '100%' )
//                    table.setAttribute( 'cellSpacing',1);
//                    table.setAttribute( 'cellPadding',0);
//                    table.setAttribute( 'class','form-info');
//                    table.setAttribute( 'isdetail','true');
                    table.setAttribute('xtype','detailGrid');
                    table.setAttribute('xwidth',info.txtWidth);
                    if ( !table.getAttribute( 'style' ) )
                        table.removeAttribute( 'style' );
                }

                // Insert the table element if we're creating one.
                if ( !this._.selectedElement )
                {
                    editor.insertElement( table );
                    // Override the default cursor position after insertElement to place
                    // cursor inside the first cell (#7959), IE needs a while.
                    setTimeout( function()
                    {
                        var firstCell = new CKEDITOR.dom.element( table.$.rows[ 0 ].cells[ 0 ] );
                        var range = new CKEDITOR.dom.range( editor.document );
                        range.moveToPosition( firstCell, CKEDITOR.POSITION_AFTER_START );
                        range.select( 1 );
                    }, 0 );
                }
                // Properly restore the selection, (#4822) but don't break
                // because of this, e.g. updated table caption.
                else
                    try { selection.selectBookmarks( bms ); } catch( er ){}
			},
			contents : [
				{
					id : 'info',
					label : editor.lang.table.title,
					elements :
					[
                        {
                            type : 'hbox',
                            widths : [ '50%', '50%' ],
                            children :
                                [
                                    {
                                        id : 'name',
                                        type : 'text',
                                        label : editor.lang.dforms.grid.tablename,
                                        'default' : '',
                                        accessKey : 'N',
								        validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dforms.dcommon.validatename),
                                        accessKey : 'T',
                                        width:'100%',
                                        setup : function( selectedTable )
                                        {
                                            this.setValue( selectedTable.getAttribute( 'name' ) );
                                        },
                                        commit : function( data, selectedTable )
                                        {
                                            selectedTable.setAttribute( 'name', this.getValue() );
                                        }
                                    },
                                    {
                                        id : 'txtlabel',
                                        type : 'text',
                                        validate : CKEDITOR.dialog.validate.notEmpty(editor.lang.dforms.dcommon.txtlabel+ editor.lang.dforms.dcommon.validateEmpty),
                                        label : editor.lang.dforms.dcommon.txtlabel,
                                        'default' : '',
                                        accessKey : 'V',
                                        setup : function( element )
                                        {
                                            this.setValue(element.getAttribute( 'txtlabel' ) ||
                                                '' );
                                        },
                                        commit : function( data,selectedTable )
                                        {
                                            var element = data.element;
                                            selectedTable.setAttribute( 'txtlabel', this.getValue() );
                                        }
                                    }
                                ]
                        },
                        {
                            id : 'description',
                            type : 'textarea',
                            label : editor.lang.dforms.grid.description,
                            'default' : '',
                            setup : function( element )
                            {
                                this.setValue(element.getAttribute( 'description' ) ||'' );
                            },
                            commit : function( data,selectedTable )
                            {
                                var element = data.element;
                                selectedTable.setAttribute( 'description', this.getValue() );
                            }
                        },
//                        {
//                            type : 'hbox',
//                            widths : [ '5em' ],
//                            children :
//                                [
//                                    {
//                                        type : 'text',
//                                        id : 'txtWidth',
//                                        controlStyle : 'width:5em',
//                                        label : editor.lang.common.width,
//                                        title : editor.lang.common.cssLengthTooltip,
//                                        'default' : 500,
//                                        getValue : defaultToPixel,
//                                        validate : CKEDITOR.dialog.validate.cssLength( editor.lang.common.invalidCssLength.replace( '%1', editor.lang.common.width ) ),
//                                        onChange : function()
//                                        {
//                                            var styles = this.getDialog().getContentElement( 'advanced', 'advStyles' );
//                                            styles && styles.updateStyle( 'width', this.getValue() );
//                                        },
//                                        setup : function( selectedTable )
//                                        {
//                                            var val = selectedTable.getStyle( 'width' );
//                                            val && this.setValue( val );
//                                        },
//                                        commit : commitValue
//                                    }
//                                ]
//                        },
                        {
                            type : 'vbox',
                            padding : 0,
                            children :
                                [
                                    {
                                        type : 'text',
                                        id : 'txtRows',
                                        'default' : 2,
                                        label : editor.lang.table.rows,
                                        required : true,
                                        controlStyle : 'width:5em',
                                        style: 'display:none',
                                        validate : function()
                                        {
                                            var pass = true,
                                                value = this.getValue();
                                            pass = pass && CKEDITOR.dialog.validate.integer()( value )
                                                && value > 0;
                                            if ( !pass )
                                            {
                                                alert( editor.lang.table.invalidRows );
                                                this.select();
                                            }
                                            return pass;
                                        },
                                        setup : function( selectedElement )
                                        {
                                            this.setValue( selectedElement.$.rows.length );
                                            
                                        },
                                        commit : commitValue
                                    },
                                    {
                                        type : 'text',
                                        id : 'txtCols',
                                        'default' : 2,
//                                        hidden:true,
                                        label : editor.lang.table.columns,
                                        required : true,
                                        controlStyle : 'width:5em',
                                        validate : function()
                                        {
                                            var pass = true,
                                                value = this.getValue();
                                            pass = pass && CKEDITOR.dialog.validate.integer()( value )
                                                && value > 0;
                                            if ( !pass )
                                            {
                                                alert( editor.lang.table.invalidCols );
                                                this.select();
                                            }
                                            return pass;
                                        },
                                        setup : function( selectedTable )
                                        {
                                            this.setValue( tableColumns( selectedTable ) );
                                        },
                                        commit : function(data,element){
                                            var id = this.id;
                                            if ( !data.info )
                                                data.info = {};
                                            data.info[id] = this.getValue();
                                            element.setAttribute('column',data.info.txtCols);
                                        }
                                    },
                                    {
                                        type : 'select',
                                        id : 'selHeaders',
                                        'default' : '',
                                        hidden:true,
                                        label : editor.lang.table.headers,
                                        items :
                                            [
                                                [ editor.lang.table.headersNone, '' ],
                                                [ editor.lang.table.headersRow, 'row' ],
                                                [ editor.lang.table.headersColumn, 'col' ],
                                                [ editor.lang.table.headersBoth, 'both' ]
                                            ],
                                        setup : function( selectedTable )
                                        {
                                            // Fill in the headers field.
                                            var dialog = this.getDialog();
                                            dialog.hasColumnHeaders = true;

                                            // Check if all the first cells in every row are TH
                                            for ( var row = 0 ; row < selectedTable.$.rows.length ; row++ )
                                            {
                                                // If just one cell isn't a TH then it isn't a header column
                                                var headCell = selectedTable.$.rows[row].cells[0];
                                                if ( headCell && headCell.nodeName.toLowerCase() != 'th' )
                                                {
                                                    dialog.hasColumnHeaders = false;
                                                    break;
                                                }
                                            }

                                            // Check if the table contains <thead>.
                                            if ( ( selectedTable.$.tHead !== null) )
                                                this.setValue( dialog.hasColumnHeaders ? 'both' : 'row' );
                                            else
                                                this.setValue( dialog.hasColumnHeaders ? 'col' : '' );
                                        },
                                        commit : commitValue
                                    }
//                                    {
//                                        id : 'cmbAlign',
//                                        type : 'select',
//                                        'default' : '',
//                                        label : editor.lang.common.align,
//                                        items :
//                                            [
//                                                [ editor.lang.common.notSet , ''],
//                                                [ editor.lang.common.alignLeft , 'left'],
//                                                [ editor.lang.common.alignCenter , 'center'],
//                                                [ editor.lang.common.alignRight , 'right']
//                                            ],
//                                        setup : function( selectedTable )
//                                        {
//                                            this.setValue( selectedTable.getAttribute( 'align' ) || '' );
//                                        },
//                                        commit : function( data, selectedTable )
//                                        {
//                                            if ( this.getValue() )
//                                                selectedTable.setAttribute( 'align', this.getValue() );
//                                            else
//                                                selectedTable.removeAttribute( 'align' );
//                                        }
//                                    }

                                ]
                        }
//                        {
//							id : 'name',
//							type : 'text',
//							label : editor.lang.dforms.grid.tablename,
//                            'default' : '',
//							validate : CKEDITOR.dialog.validate.notEmpty('明细表名称不能为空'),
//							accessKey : 'T',
//							width:'100%',
//							setup : function( selectedTable )
//							{
//								this.setValue( selectedTable.getAttribute( 'name' ) );
//							},
//							commit : function( data, selectedTable )
//							{
//								selectedTable.setAttribute( 'name', this.getValue() );
//							}
//						},
//                        {
//							id : 'isgrid',
//							type : 'checkbox',
//							label : editor.lang.dforms.grid.detailgrid,
//							'default' : 'checked',
//							accessKey : 'P',
//							value : "checked",
//							setup : function( element )
//							{
//							    var value=element.getAttribute( 'isgrid' );
//							    if(value==1){
//							    	this.setValue(true);
//							    }
//							},
//
//							commit : function(  data, selectedTable )
//							{
//								var value = this.getValue();
//								if ( value )
//									selectedTable.setAttribute( 'isgrid','true');
//								else
//									selectedTable.setAttribute( 'isgrid','false');
//							}
//					    },
//						{
//							type : 'hbox',
//							widths : [ null, null ],
//							styles : [ 'vertical-align:top' ],
//							children :
//							[
//								{
//									type : 'vbox',
//									padding : 0,
//									children :
//									[
//										{
//											type : 'text',
//											id : 'txtRows',
//											'default' : 2,
//											label : editor.lang.table.rows,
//											required : true,
//											controlStyle : 'width:5em',
//                                            style: 'display:none',
//											validate : function()
//											{
//												var pass = true,
//													value = this.getValue();
//												pass = pass && CKEDITOR.dialog.validate.integer()( value )
//													&& value > 0;
//												if ( !pass )
//												{
//													alert( editor.lang.table.invalidRows );
//													this.select();
//												}
//												return pass;
//											},
//											setup : function( selectedElement )
//											{
//												this.setValue( selectedElement.$.rows.length );
//											},
//											commit : commitValue
//										},
//										{
//											type : 'text',
//											id : 'txtCols',
//											'default' : 2,
//											label : editor.lang.table.columns,
//											required : true,
//											controlStyle : 'width:5em',
//											validate : function()
//											{
//												var pass = true,
//													value = this.getValue();
//												pass = pass && CKEDITOR.dialog.validate.integer()( value )
//													&& value > 0;
//												if ( !pass )
//												{
//													alert( editor.lang.table.invalidCols );
//													this.select();
//												}
//												return pass;
//											},
//											setup : function( selectedTable )
//											{
//												this.setValue( tableColumns( selectedTable ) );
//											},
//											commit : function(data,element){
//                                                var id = this.id;
//                                                if ( !data.info )
//                                                    data.info = {};
//                                                data.info[id] = this.getValue();
//                                                element.setAttribute('column',data.info.txtCols);
//                                            }
//										},
//										{
//											type : 'select',
//											id : 'selHeaders',
//											'default' : '',
//											label : editor.lang.table.headers,
//											items :
//											[
//												[ editor.lang.table.headersNone, '' ],
//												[ editor.lang.table.headersRow, 'row' ],
//												[ editor.lang.table.headersColumn, 'col' ],
//												[ editor.lang.table.headersBoth, 'both' ]
//											],
//											setup : function( selectedTable )
//											{
//												// Fill in the headers field.
//												var dialog = this.getDialog();
//												dialog.hasColumnHeaders = true;
//
//												// Check if all the first cells in every row are TH
//												for ( var row = 0 ; row < selectedTable.$.rows.length ; row++ )
//												{
//													// If just one cell isn't a TH then it isn't a header column
//													var headCell = selectedTable.$.rows[row].cells[0];
//													if ( headCell && headCell.nodeName.toLowerCase() != 'th' )
//													{
//														dialog.hasColumnHeaders = false;
//														break;
//													}
//												}
//
//												// Check if the table contains <thead>.
//												if ( ( selectedTable.$.tHead !== null) )
//													this.setValue( dialog.hasColumnHeaders ? 'both' : 'row' );
//												else
//													this.setValue( dialog.hasColumnHeaders ? 'col' : '' );
//											},
//											commit : commitValue
//										},
//                                        {
//                                            id : 'cmbAlign',
//                                            type : 'select',
//                                            'default' : '',
//                                            label : editor.lang.common.align,
//                                            items :
//                                                [
//                                                    [ editor.lang.common.notSet , ''],
//                                                    [ editor.lang.common.alignLeft , 'left'],
//                                                    [ editor.lang.common.alignCenter , 'center'],
//                                                    [ editor.lang.common.alignRight , 'right']
//                                                ],
//                                            setup : function( selectedTable )
//                                            {
//                                                this.setValue( selectedTable.getAttribute( 'align' ) || '' );
//                                            },
//                                            commit : function( data, selectedTable )
//                                            {
//                                                if ( this.getValue() )
//                                                    selectedTable.setAttribute( 'align', this.getValue() );
//                                                else
//                                                    selectedTable.removeAttribute( 'align' );
//                                            }
//                                        }
//
//									]
//								},
//								{
//									type : 'vbox',
//									padding : 0,
//									children :
//									[
//										{
//											type : 'hbox',
//											widths : [ '5em' ],
//											children :
//											[
//												{
//													type : 'text',
//													id : 'txtWidth',
//													controlStyle : 'width:5em',
//													label : editor.lang.common.width,
//													title : editor.lang.common.cssLengthTooltip,
//													'default' : 500,
//													getValue : defaultToPixel,
//													validate : CKEDITOR.dialog.validate.cssLength( editor.lang.common.invalidCssLength.replace( '%1', editor.lang.common.width ) ),
//													onChange : function()
//													{
//														var styles = this.getDialog().getContentElement( 'advanced', 'advStyles' );
//														styles && styles.updateStyle( 'width', this.getValue() );
//													},
//													setup : function( selectedTable )
//													{
//														var val = selectedTable.getStyle( 'width' );
//														val && this.setValue( val );
//													},
//													commit : commitValue
//												}
//											]
//										},
//										{
//											type : 'hbox',
//											widths : [ '5em' ],
//											children :
//											[
//												{
//													type : 'text',
//													id : 'txtHeight',
//													controlStyle : 'width:5em',
//													label : editor.lang.common.height,
//													title : editor.lang.common.cssLengthTooltip,
//													'default' : '',
//													getValue : defaultToPixel,
//													validate : CKEDITOR.dialog.validate.cssLength( editor.lang.common.invalidCssLength.replace( '%1', editor.lang.common.height ) ),
//													onChange : function()
//													{
//														var styles = this.getDialog().getContentElement( 'advanced', 'advStyles' );
//														styles && styles.updateStyle( 'height', this.getValue() );
//													},
//
//													setup : function( selectedTable )
//													{
//														var val = selectedTable.getStyle( 'height' );
//														val && this.setValue( val );
//													},
//													commit : commitValue
//												}
//											]
//										}
//									]
//								}
//							]
//						}
					]
				}
//				,
//				dialogadvtab && dialogadvtab.createAdvancedTab( editor )
			]
		};
	}

	CKEDITOR.dialog.add( 'grid', function( editor )
		{
			return gridDialog( editor, 'grid' );
		} );
	CKEDITOR.dialog.add( 'gridProperties', function( editor )
		{
			return gridDialog( editor, 'gridProperties' );
		} );
})();
