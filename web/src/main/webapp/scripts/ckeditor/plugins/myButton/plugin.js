//注册“myButton”插件到编辑器
CKEDITOR.plugins.add( 'myButton', {
	//插件初始化方法
	init: function( editor ) {
		//定义打开对话框的命令
		editor.addCommand( 'myButton', new CKEDITOR.dialogCommand( 'myButton' ) );
		//创建一个工具栏按钮，它会执行我们上面定义的命令
		editor.ui.addButton( 'MyButton', {
			icon: this.path+'icons/image.png',
			//按钮（如果是有效的话）的文本显示，以及鼠标悬停提示
			label: '我的按钮',
			//单击按钮所执行的命令
			command: 'myButton'
			//toolbar: 'insert'
		});

		//注册我们的myButton.js
		CKEDITOR.dialog.add( 'myButton', this.path + 'dialogs/myButton.js' );

        editor.on( 'doubleclick', function( evt )
        {
            var element = evt.data.element;

            if ( element.is( 'form' ) )
                evt.data.dialog = 'form';
            else if ( element.is( 'select' ) )
                evt.data.dialog = 'dselect';
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
                        }else if(xtype=='boxgroup'){
                            evt.data.dialog = 'boxgroup';
                        }else if(xtype=='myButton'){
                            evt.data.dialog = 'myButton';
                        }else if(xtype){
                            evt.data.dialog = 'dtextfield';
                        }else{
                            evt.data.dialog = 'textfield';
                        }
                        break;
                }
            }
        });
	} 
});
