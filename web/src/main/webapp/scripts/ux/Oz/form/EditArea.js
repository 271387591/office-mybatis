/**
 * Created with IntelliJ IDEA.
 * User: Wang Yang
 * Date: 12-11-27
 * Time: PM2:45
 */
Ext.define('Oz.form.EditArea', {
  extend: 'Ext.form.field.TextArea',
  alias:  'widget.editarea',

  requires: [
  ],

  editorConfig: {
    syntax:          "js",
    start_highlight: true,
    font_size: "12",
    font_family: "verdana, monospace",
    allow_resize: "y",
    allow_toggle: false,
//    autocompletion: true,
    toolbar: "save, |, search, go_to_line, |, undo, redo, |, select_font",
    plugins: 'autocompletion'
  },

  initSyntax: function(){

    var store = Oz.plugins.form.TestManagerSuggest.getStore();
    var keywords = [
      ['if'],
      ['return'],
      ['while'],
      ['else']
    ]
    store.each(function(rec){
      keywords.push([rec.get('value')]);
    });

    editAreaLoader.load_syntax["bcc"] = {
      'DISPLAY_NAME' : 'Javascript'

      ,'AUTO_COMPLETION' :  {
        "default": {	// the name of this definition group. It's posisble to have different rules inside the same definition file
          "REGEXP": { "before_word": "[^a-zA-Z0-9_]|^"	// \\s|\\.|
            ,"possible_words_letters": "[a-zA-Z0-9_]+"
            ,"letter_after_word_must_match": "[^a-zA-Z0-9_]|$"
            ,"prefix_separator": "\\."
          }
          ,"CASE_SENSITIVE": false
          ,"MAX_TEXT_LENGTH": 100		// the maximum length of the text being analyzed before the cursor position
          ,"KEYWORDS": {
            '': keywords
//              [	// the prefix of thoses items
//            /**
//             * 0 : the keyword the user is typing
//             * 1 : (optionnal) the string inserted in code ("{@}" being the new position of the cursor, "§" beeing the equivalent to the value the typed string indicated if the previous )
//             * 		If empty the keyword will be displayed
//             * 2 : (optionnal) the text that appear in the suggestion box (if empty, the string to insert will be displayed)
//             */
//              ['Array', '§()', '']
//              ,['alert', '§({@})', 'alert(String message)']
//              ,['document']
//              ,['window']
//            ]
//            ,'window' : [
//              ['location']
//              ,['document']
//              ,['scrollTo', 'scrollTo({@})', 'scrollTo(Int x,Int y)']
//            ]
//            ,'location' : [
//              ['href']
//            ]
          }
        }
      }
    };


//    editAreaLoader.execCommand(this.editorId, 'set_editable', readOnly);
  },

  initComponent: function (){
    this.initSyntax();
    this.callParent(arguments);
    var me  = this;
    this.on('afterrender', function (){
      var saveFn = function(){
        me.saveHandler(me, me.getValue());
      }

      Ext.apply(this.editorConfig, {
        height: this.getHeight(),
        readOnly: this.readOnly,
        save_callback: saveFn
      });

      this.editorId = this.inputEl.id;

      editAreaLoader.init(Ext.applyIf(this.editorConfig, {
        id: this.editorId
      }));


      if (this.value){
        editAreaLoader.setValue(this.editorId, this.value);
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
    this.callParent(arguments)
  },

  saveHandler: function(cmp, value){

  },

  setRawValue: function (value){
    this.callParent(arguments);
    if (this.editorId){
      var me = this;
      Ext.Function.defer(function (){
        editAreaLoader.setValue(me.editorId, value);
      }, 300);
    }
  },

  getRawValue: function (){
    if (this.editorId){
      return editAreaLoader.getValue(this.editorId);
    } else{
      return ''
    }
  },

  setReadOnly: function(readOnly) {
    this.callParent(arguments);

    if (this.editorId){
      this.editorId.setReadOnly(readOnly);
      editAreaLoader.execCommand(this.editorId, 'set_editable', readOnly);
    }
  },

  beforeDestroy: function (){
    if (this.editorId){
      editAreaLoader.delete_instance(this.editorId);
      delete this.editorId;
    }

    this.callParent();
  }
});
