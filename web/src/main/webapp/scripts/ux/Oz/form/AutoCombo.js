/**
 * Created with IntelliJ IDEA.
 * User: yongliu
 * Date: 9/12/12
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.AutoCombo',{
  extend: 'Ext.form.field.ComboBox',
  alias: ['widget.autocombo','widget.autocombox','widget.autocomboxfiled','widget.autocombofield'],

  lastSelectedRecord: undefined,
  noValue: 'N/A',
  loadCount: 0,
  /**
   * @filterMode
   * local
   * remote
   */
  filterMode: 'local',

  /**
   * @defaultValue
   * when click the @next @prev @refresh button this value saved the last selected record value
   * from this @defaultValue the combo will select the record when @defaultValue in Page
   */
  defaultValue: undefined,

  /**
   * @defaultRecord
   * this value only used with @filterMode='remote'
   * the store will load records from @defaultRecord.get(@name) find this record which page is in in DB
   * @event dirtychange with this combo
   */
  defaultRecord: undefined,

  lastQuery: '',

  forceSelection: false,

  /**
   * @remoteRefresh
   * if @remoteRefresh =true, then call server method to refresh store's data, 
   * and also must override method @onRefresh to do call method to load store.
   * else just refresh memory store 
   */
  remoteRefresh: false,

  /**
   *  @resetZeroValue
   *  this property is set rawValue to N/A if value is 0
   */
  resetZeroValue: false,

  initComponent: function(){
    var me = this;
    this.listeners ={
      dirtychange: me.memoryStoreAutoLoadPageWithValueOnDirtyChange,
      beforeselect: me.onBeforeSelectHandler,
      select: me.onSelectHandler
    };
    this.callParent();
  },

  /**
   * @Private
   * @Override
   * @param toolbar
   * @param newPage
   * @returns {boolean}
   */
  onPageChange: function(toolbar, newPage){
    /*
     * Return false here so we can call load ourselves and inject the query param.
     * We don't want to do this for every store load since the developer may load
     * the store through some other means so we won't add the query param.
     */
    if(this.remoteRefresh && this.store.currentPage == newPage){
      this.onRefresh();
    }
    this.loadPage(newPage);
    return false;
  },

  onBeforeSelectHandler: function(cb,record){
    if(this.lastSelectedRecord){
      var prevRecord = this.store.findRecord(this.valueField, this.lastSelectedRecord.get(this.valueField), 0, false, true, true);
      var nodeItem = this.picker.getNode(prevRecord);
      if(nodeItem){
        Ext.get(nodeItem).removeCls('x-boundlist-selected');
      }
    }
    this.defaultValue = record.get(this.displayField);
    this.lastSelectedRecord = record;
  },

  onSelectHandler: function(cb,rs){
    this.dataInPage = this.store.currentPage;
    this.loadCount = 1;
    this.onSelect(cb, rs);
  },
  
  onSelect: function(combo, recs){
    
  },

  memoryStoreAutoLoadPageWithValueOnDirtyChange: function(cb,isDirty){
    if(this.filterMode === 'local'){
      var idx = 0, data = this.store.getProxy().data || [];
      for (var i = 0, len = data.length; i < len; i++) {
        var rec = data[i];
        if (rec[this.valueField] == this.getValue()) {
          idx = i;
          break;
        }
      }

      var pageNum = (Math.floor(idx / this.pageSize) + 1);
      this.dataInPage = pageNum = pageNum <= 0 ? 1 : pageNum;
      if (pageNum !== this.store.currentPage)
        this.store.loadPage(pageNum);
    }
    else {
      // remote
      var me = this;
      this.dataInPage = 1;
      if(this.defaultRecord && this.defaultRecord != null){
        this.store.setBaseParams('mode','AUTOLOADPAGEPOSITION');
        this.store.setBaseParams('otherId',this.defaultRecord.get(this.name));
        this.store.load({
          scope: me,
          callback: function(rs,operation,success){
            me.store.currentPage = operation.response.page || 1;
            me.dataInPage = me.store.currentPage;
            me.store.setBaseParams('mode',null);
            me.store.setBaseParams('otherId',null);

            // reset the value
            var v = me.defaultRecord.get(me.name);
            if(me.resetZeroValue && (!v || v == null || v == 0)){
              me.clearValue();
              me.reset();
            }else {
              me.setValue(me.defaultRecord.get(me.name));
            }
          }
        });
      }
    }

  },

  /**
   * @Override
   * @param value
   * @return {*}
   */
  setRawValue: function(value){
    var me = this;
    value = Ext.value(value, '');
    //value = value == 0 ? me.noValue : value;
    if(me.loadCount > 0 && me.dataInPage !== me.store.currentPage){
      value = Ext.isNumeric(value)? me.defaultValue : value;
    }
    me.loadCount ++;
    me.rawValue = value;
    if (me.inputEl) {
      me.inputEl.dom.value = value;
      //----------change --------------------
      if(value === me.noValue){
        me.inputEl.dom.style.color='gray';
      }else{
        me.inputEl.dom.style.color='black';
      }
      //-------------------------------------
    }

    return value;
  },

  /**
   * @Override
   */
  doAutoSelect: function() {
    var me = this,
      hasSelected = false,
      picker = me.picker,
      lastSelected, itemNode;
    if (picker && me.autoSelect && me.store.getCount() > 0) {
      // Highlight the last selected item and scroll it into view
      lastSelected = picker.getSelectionModel().lastSelected;
      //--------------change ---------------------------------
      if (me.lastSelectedRecord && !lastSelected && me.dataInPage === me.store.currentPage) {
        var curRecord = me.store.findRecord(me.valueField, me.lastSelectedRecord.get(me.valueField), 0, false, true, true);
        lastSelected = lastSelected || curRecord;
        hasSelected = true;
      }
      //------------------------------------------------------
      itemNode = picker.getNode(lastSelected || 0);
      if (itemNode) {
        if(hasSelected) {
          Ext.get(itemNode).addCls('x-boundlist-selected');
        }
        picker.highlightItem(itemNode);
        picker.listEl.scrollChildIntoView(itemNode, false);
      }
    }
  },

  onRefresh: Ext.emptyFn,

  loadData: function(data){
    if(data && data.length > 0){
      this.store.proxy.data = data;
    }
    if(this.pageSize > 0){
      this.store.load({params: {start: 0, limit: this.pageSize}, initLoad: true});
    }
  },

  onDestroy: function(){
    this.callParent();
  }
});