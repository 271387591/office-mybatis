/**
 * Created with IntelliJ IDEA.
 * User: Wang Yang
 * Date: 12-11-27
 * Time: PM2:45
 */
Ext.define('Oz.form.CKEditor', {
  extend: 'Ext.form.field.TextArea',
  alias:  'widget.ckeditor',

  requires: [
  ],

//  componentLayout: 'ckeditor',
  fireEventOn: false,
  fireEventName: 'editorafterrender',
  CKConfig: {
    resize_enabled: false
  },

  initComponent: function (){
    if(this.fireEventOn){
      this.addEvents(this.fireEventName, 'editordirtychange');
    }
    this.callParent(arguments);
    var me = this;
    this.on('afterrender', function (){
      Ext.apply(this.CKConfig, {
        height: this.getHeight(),
        readOnly: this.readOnly,
        filebrowserBrowseUrl : '../ckfinder/ckfinder.html?type=Files',
        filebrowserImageBrowseUrl: '../ckfinder/ckfinder.html?type=Images',
        filebrowserFlashBrowseUrl : '../ckfinder/ckfinder.html?type=Flash',
        filebrowserUploadUrl : basePath + 'data/ckfinderUpload?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl : basePath + 'data/ckfinderUpload?command=QuickUpload&type=Images',
        filebrowserFlashUploadUrl : basePath + 'data/ckfinderUpload?command=QuickUpload&type=Flash'
      });

      this.editor = CKEDITOR.replace(this.inputEl.id, this.CKConfig);
      CKFinder.setupCKEditor(this.editor,{
          basePath: 'ckfinder/'
        }
      );

      this.editorId = this.editor.id;
      if(this.editor){
        // set the dirty to false when init
        this.editor.resetDirty();

        if(me.fireEventOn && me.fireEventName){
          this.editor.on('instanceReady',function(evt){
            //~----- check the editor is modified ------------------------------------------------------------
            var actEditor = evt.editor;
            actEditor['dirty'] = false;
            actEditor['selectionChangeCounter'] = 0;
            ///////focus the editor/////
//            Ext.Function.defer(function(){
//              actEditor.focus();
//            }, 900);
//            actEditor.focus();
            ///////////////////////////

            actEditor.on('key', function (kevt) {
              // the kevt.data.keyCode is the CKEDITOR keyCode(CTRL, SHIFT and ALT)
              // so for get real keyCode from
              // kevt.data.keyCode & ~(CKEDITOR.SHIFT | CKEDITOR.CTRL | CKEDITOR.ALT);
              var keyCode = kevt.data.keyCode & ~(CKEDITOR.SHIFT | CKEDITOR.CTRL | CKEDITOR.ALT);

              // A number representing the key code (or combination).
              // It is the sum of the current key code and the
              //  CTRL, SHIFT, ALT, TAB, CAPS_LOCK, COMMAND(224) constants,
              // if those are pressed
              // then fire @editordirtychange
              if(!me.readOnly && keyCode != Ext.EventObject.CTRL && keyCode != Ext.EventObject.SHIFT && keyCode != Ext.EventObject.ALT
                && keyCode != Ext.EventObject.CAPS_LOCK && keyCode !=Ext.EventObject.TAB && keyCode != 224){
                actEditor['dirty'] = true;
                me.fireEvent('editordirtychange', evt);
              }
            });

            //~----- listeners the toolbar clicked then fire editordirtychange-------
            actEditor.on('selectionChange', function (kevt) {
              if(!me.readOnly){
                actEditor['selectionChangeCounter'] += 1;
                if(actEditor['selectionChangeCounter'] > 1 && actEditor['dirty'] && kevt.editor.checkDirty()){
                  me.fireEvent('editordirtychange', kevt);
                }
              }
            });
            actEditor.on('focus', function (kevt) {
              if(!me.readOnly){
                actEditor['selectionChangeCounter'] += 1;
                if(actEditor['selectionChangeCounter'] > 1 &&actEditor['dirty'] && kevt.editor.checkDirty()){
                  actEditor['dirty'] = true;
                  me.fireEvent('editordirtychange', kevt);
                }
              }
            });
            //!------end listeners the toolbar clicked------------------------------

            //!-----------------------------------------------------------------------------------------------
            me.fireEvent(me.fireEventName, evt);
          });
        }
//        else {
//          this.editor.on('instanceReady',function(evt){
//            var actEditor = evt.editor;
//            ///////focus the editor/////
////            Ext.Function.defer(function(){
//////              actEditor.focus();
////              actEditor.focusManager.focus(actEditor.editable());
////            }, 900);
////            
//            ///////////////////////////
//          });
//        }
      }
      if (this.value && this.editor){
        this.editor.setData(this.value);
      }
    }, this);
  },

  onRender: function (ct, position){
    if (!this.el){
      this.defaultAutoCreate = {
        tag:          'textarea',
        autocomplete: 'off'
      };
    }
    this.callParent(arguments);
  },

  setRawValue: function (value){
    this.callParent(arguments);
    if (this.editor){
      var me = this;
      Ext.Function.defer(function (){
        me.editor.setData(value);
      }, 300);
    }
  },

  getRawValue: function (){
    if (this.editor){
      return this.editor.getData();
    } else{
      return ''
    }
  },

  setReadOnly: function(readOnly) {
    this.callParent(arguments);

    if (this.editor){
      this.editor.setReadOnly(readOnly);
    }
  },

  setHeight: function(newHeight){
    var editorContentId = this.editorId+'_contents';
    var content = document.getElementById(editorContentId);
    if(content){
      with(content.style){
        height = newHeight +'px';
      }
    }
  },

  isDirty: function(){
    return this.editor.checkDirty();
  },

  onDestroy: function (){
    delete this.editorId;
    if (this.editor){
      CKEDITOR.remove(this.editor);
      var div = document.getElementById('inlineDiv');
      if(div){
        Ext.removeNode(div);
      }
    }

    this.callParent();
  }
});

//CKEDITOR.on('instanceReady', function (e){
//  var o = Ext.ComponentQuery.query('ckeditor[editorId="' + e.editor.id + '"]'),
//    comp = o[0];
//  e.editor.resize(comp.getWidth(), comp.getHeight())
//  comp.on('resize', function (c, adjWidth, adjHeight){
//    c.editor.resize(adjWidth, adjHeight)
//  })
//});