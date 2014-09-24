/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-9-23
 * Time: 上午10:08
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.forms.view.CKEditor', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.ckeditor',
    id: 'ckeditor',
    value:'<table xtype="table" border="1" cellpadding="1" cellspacing="1" style="border-collapse:collapse; border:1px solid;width:100%"><tbody><tr><th colspan="4">标题</th></tr><tr><th style="width: 200px;">字段一</th><td>&nbsp;</td><th style="width: 200px;"><strong>字段二</strong></th><td>&nbsp;</td></tr><tr><th><strong>字段三</strong></th><td>&nbsp;</td><th><strong>字段四</strong></th><td>&nbsp;</td></tr></tbody></table>',
    listeners:{
        afterrender:function(f){
            this.editor = CKEDITOR.replace(this.inputEl.id,{
                toolbarStartupExpanded:true,
                language:'zh-cn',
                height:445,
                extraPlugins:'dforms,sourcearea',
                baseFloatZIndex:19900,
                toolbar:[
                    [ 'Source'],
                    [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo','Find','Replace','-','SelectAll' ],
                    [ 'HorizontalRule','Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat','NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
                    [ 'TextField','Textarea','Select','BoxGroup','DateField','Grid','UserSelector','DepSelector','PosSelector'],
                    [ 'FontSize','TextColor','BGColor' ]
                ]

            });
            this.editor.setData('');
            this.editor.setData(f.getValue()? f.getValue():this.value);
        }
    },
    
//    onRender : function(ct, position){
//        if(!this.el){
//            this.defaultAutoCreate = {
//                tag: "textarea",
//                autocomplete: "off"
//            };
//        }
//        this.callParent(arguments);
//        this.editor = CKEDITOR.replace(this.inputEl.id,{
//                
//        });
//            ,{
//                language: 'zh-cn',
//                uiColor: '#AADC6E',
//                toolbarStartupExpanded: true,
//                    skin : 'moono_blue',
//                    toolbar :
//                            [
//                                ['TextField'],
////加粗 斜体， 下划线 穿过线 下标字 上标字
//                        ['Bold','Italic','Underline','Strike','Subscript','Superscript'],
////数字列表 实体列表 减小缩进 增大缩进
//                        ['NumberedList','BulletedList','-','Outdent','Indent'],
////左对齐 居中对齐 右对齐 两端对齐
//                        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
////超链接 取消超链接 锚点
//                        ['Link','Unlink','Anchor'],
////图片 flash 表格 水平线 表情 特殊字符 分页符
//                        ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
//                        '/',
////样式 格式 字体 字体大小
//                        ['Styles','Format','Font','FontSize'],
////文本颜色 背景颜色
//                        ['TextColor','BGColor'],
//////全屏 显示区块
////                        ['Maximize', 'ShowBlocks','-','Source']
//                        [ 'Source','-','Print','Maximize', 'ShowBlocks'],
//                        [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ],
//                        [ 'Find','Replace','-','SelectAll','-', 'Scayt' ],
//                        ['HiddenField','Select','DTextField','Textarea','Checkbox','Radio','Diccombo','UserSelector','DepSelector','PosSelector','DateField','Ckeditor','Officeeditor','Commoneditor','Fileattach','Grid'],
//                        ['ImageButton', '-','Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe','-','Link','Unlink','Anchor' ],
//                        [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
//                        [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
//                        [ 'Styles','Format','Font','FontSize' ],
//                        [ 'TextColor','BGColor' ],
//                        ['MyButton','DTextField']
//                    ],
//                extraPlugins :'dforms,myButton,sourcearea'
//
//        }
//);
//        CKFinder.setupCKEditor(this.editor,'scripts/ckfinder/');
//    },

    setValue: function(value) {
        this.callParent(arguments);
        if(this.editor){
            this.editor.setData(value);
        }
    },

    getValue: function() {
        if (this.editor) {
            this.editor.updateElement();
            return this.editor.getData()
        } else {
            return ''
        }
    },

    getRawValue: function() {
        if (this.editor) {
            this.editor.updateElement();
            return this.editor.getData()
        } else {
            return ''
        }
    }

});