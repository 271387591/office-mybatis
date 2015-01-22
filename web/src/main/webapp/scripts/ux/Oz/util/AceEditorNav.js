/**
 * Created with IntelliJ IDEA.
 * User: Wang Yang
 * Date: 12-12-13
 * Time: PM4:30
 */

Ext.define('Oz.util.AceEditorNav', {
  requires: 'Ext.view.BoundList',

  constructor: function (config){
    Ext.apply(this, config);
  },

  up: function (){
    var me = this,
      boundList = me.boundList,
      allItems = boundList.all,
      oldItem = boundList.highlightedItem,
      oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
      newItemIdx = oldItemIdx > 0 ? oldItemIdx - 1 : allItems.getCount() - 1; //wraps around
    me.highlightAt(newItemIdx);
  },

  down: function (){
    var me = this,
      boundList = me.boundList,
      allItems = boundList.all,
      oldItem = boundList.highlightedItem,
      oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
      newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0; //wraps around
    me.highlightAt(newItemIdx);
  },

  home: function (){
    this.highlightAt(0);
  },

  end: function (){
    var me = this;
    me.highlightAt(me.boundList.all.getCount() - 1);
  },

  enter: function (e){
    this.selectHighlighted(e);
  },

  /**
   * Highlights the item at the given index.
   * @param {Number} index
   */
  highlightAt: function (index){
    var boundList = this.boundList,
      item = boundList.all.item(index);
    if (item){
      item = item.dom;
      boundList.highlightItem(item);
      boundList.getTargetEl().scrollChildIntoView(item, false);
    }
  },

  /**
   * Triggers selection of the currently highlighted item according to the behavior of
   * the configured SelectionModel.
   */
  selectHighlighted: function (e){
    var me = this,
      boundList = me.boundList,
      highlighted = boundList.highlightedItem,
      selModel = boundList.getSelectionModel();
    if (highlighted){
      selModel.selectWithEvent(boundList.getRecord(highlighted), e);
    }
  }

});