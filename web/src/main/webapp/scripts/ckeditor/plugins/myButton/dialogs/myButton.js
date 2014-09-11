CKEDITOR.dialog.add( 'myButton', function(editor)
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
//		title :'哪个在笑？',
//		minWidth : 350,
//		minHeight : 100,
//		contents : [
//		            {
//		            	id : 'myModal',
//		            	label : '啊啊',
//		            	title : '啊啊',
//		            	elements :
//		            		[
//		            		 {
//		            			 id : 'personName',
//		            			 type : 'input',
//		            			 label : '请输入'
//		            		 }
//		            		 ]
//		            }
//		            ],
//		            onOk : function()
//		            {
//		            	editor.insertHtml(this.getValueOf( 'myModal', 'personName' )+"在笑！");
//		            }
        title : '哪个在笑?',
        resizable : CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth: 360,
        minHeight: 150,
        contents: [{
            id: 'cb',
            name: 'cb',
            label: 'cb',
            title: 'cb',
            elements: [{
            type: 'textarea',
            required: true,
            label: '文本',
            style: 'width:350px;height:100px',
            rows: 6,
            id: 'mytxt',
            'default': 'Hello World'
            }]
        }],
        onOk: function(){
//             	var mytxt = this.getValueOf('cb', 'mytxt');
//                editor.insertHtml(mytxt);
            var editor,
                element = this.textField,
                isInsertMode = !element;
             if ( isInsertMode )
            {
                editor = this.getParentEditor();
                element = editor.document.createElement( 'input' );
                element.setAttribute( 'type', 'text' );
            }
            element.setAttribute( 'xtype', 'myButton' );

            if ( isInsertMode )
                editor.insertElement( element );
            this.commitContent( { element : element } );
     	},
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
        }
//     	onLoad: function(){
//             	}

	}
		});