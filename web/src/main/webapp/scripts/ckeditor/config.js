/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
//    config.language = 'zh-cn';
//    config.uiColor = '#AADC6E';
//    config.skin='moono_blue';
//    config.toolbarStartupExpanded=true;
    config.language = 'zh-cn';
    config.uiColor = '#CED9E7';
    config.toolbarStartupExpanded = true;
    config.skin = 'moono_blue';
    config.baseFloatZIndex = 19900;
//    config.autoGrow_minHeight = 700
    config.height=400;
    //'UserSelector','DepSelector','PosSelector','DSelect', 'Checkbox','Radio',
    config.toolbar =
        [
            [ 'Source','-','Print', 'ShowBlocks'],
            [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ],
            [ 'Find','Replace','-','SelectAll','-', 'Scayt' ],
            ['HiddenField','Select','TextField','Textarea','BoxGroup','DateField','Grid','UserSelector','DepSelector','PosSelector','DSelect'],
            ['ImageButton', '-','Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe','-','Link','Unlink','Anchor' ],
            [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
            [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
            [ 'Styles','Format','Font','FontSize' ],
            [ 'TextColor','BGColor' ]
        ];
    config.extraPlugins = 'dforms,sourcearea';
//    config.protectedSource.push(/<\s*input[\s\S]*?>/gi);
//    config.startupMode ='source';


    //与CKFinder集成
//    config.filebrowserBrowseUrl = 'scripts/ckfinder/ckfinder.html';
//    config.filebrowserImageBrowseUrl = 'scripts/ckfinder/ckfinder.html?type=Images';
//    config.filebrowserFlashBrowseUrl = 'scripts/ckfinder/ckfinder.html?type=Flash';
//    config.filebrowserUploadUrl = 'scripts/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Files';
//    config.filebrowserImageUploadUrl = 'scripts/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Images';
//    config.filebrowserFlashUploadUrl = 'scripts/ckfinder/core/connector/java/connector.java?command=QuickUpload&type=Flash' ;
//
//    config.filebrowserWindowWidth = '900';
//    config.filebrowserWindowHeight = '600';

};
