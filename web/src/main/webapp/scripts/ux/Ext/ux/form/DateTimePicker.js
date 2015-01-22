/**
 * A date picker. This class is used by the Ext.form.field.Date field to allow browsing and selection of valid
 * dates in a popup next to the field, but may also be used with other components.
 *
 * Typically you will need to implement a handler function to be notified when the user chooses a date from the picker;
 * you can register the handler using the {@link #select} event, or by implementing the {@link #handler} method.
 *
 * By default the user will be allowed to pick any date; this can be changed by using the {@link #minDate},
 * {@link #maxDate}, {@link #disabledDays}, {@link #disabledDatesRE}, and/or {@link #disabledDates} configs.
 *
 * All the string values documented below may be overridden by including an Ext locale file in your page.
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Choose a future date:',
 *         width: 200,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items: [{
 *             xtype: 'datetimepicker',
 *             minDate: new Date(),
 *             handler: function(picker, date) {
 *                 // do something with the selected date
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.ux.form.DateTimePicker', {
    extend: 'Ext.picker.Date',
    requires: [
        'Ext.XTemplate',
        'Ext.button.Button',
        'Ext.button.Split',
        'Ext.util.ClickRepeater',
        'Ext.util.KeyNav',
        'Ext.EventObject',
        'Ext.fx.Manager',
        'Ext.picker.Month'
    ],
    alias: 'widget.datetimepicker',
    alternateClassName: 'Ext.DateTimePicker',

    renderTpl: [
        '<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                                '<em role="presentation"><span role="presentation"></span></em>',
                            '</a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showFooter">',
                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderFooterContainer(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.ex.picker.DateTime.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderFooterContainer: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.footerContainer.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],

    //<locale>
    /**
     * @cfg {String} todayText
     * The text to display on the button that selects the current date
     */
    todayText : 'Now',
    //</locale>

    //<locale>
    /**
     * @cfg {String} todayText
     * The text to display on the button that selects the current date
     */
    confirmText : 'Confirm',
    //</locale>
    
    //<locale>
    /**
     * @cfg {String} ariaTitle
     * The text to display for the aria title
     */
    ariaTitle: 'Date Picker: {0}',
    //</locale>
    
    //<locale>
    /**
     * @cfg {String} ariaTitleDateFormat
     * The date format to display for the current value in the {@link #ariaTitle}
     */
    ariaTitleDateFormat: 'F d H:i:s, Y',
    //</locale>

    //<locale>
    /**
     * @cfg {Boolean} showToday
     * False to hide the footer area containing the Today button and disable the keyboard handler for spacebar that
     * selects the current date.
     */
    showToday : true,
    //</locale>

    //<locale>
    /**
     * @cfg {Boolean} showToday
     * False to hide the footer area containing the Today button and disable the keyboard handler for spacebar that
     * selects the current date.
     */
    showTime : true,
    //</locale>

    //<locale>
    /**
     * @cfg {String} longDayFormat
     * The format for displaying a date in a longer format.
     */
    longDayFormat: 'F d H:i:s, Y',
    //</locale>

    // private, inherit docs
    initComponent : function() {
        var me = this;
        
        var value = me.value;

        this.callParent();

        if (me.showTime) {

            me.value = value || me.value;

            me.listeners = Ext.apply(me.listeners||{}, {
                dblclick: {
                    element: 'eventEl',
                    fn: me.handleDateDblClick, 
                    scope: me,
                    delegate: 'a.' + me.baseCls + '-date'
                }
            });
        }

    },

    afterRender: function () {
        /*
         * days array for looping through 6 full weeks (6 weeks * 7 days)
         * Note that we explicitly force the size here so the template creates
         * all the appropriate cells.
         */
        var me = this,
            today = Ext.Date.format(new Date(), me.format);

        me.callParent();
        
        if (me.todayBtn) {
            delete me.todayBtn.ownerCt;
            delete me.todayBtn.ownerLayout;
            Ext.destroy(me.todayBtn);
            delete me.todayBtn;
            me.todayBtn = new Ext.button.Button({
                //ownerCt: me,
                //ownerLayout: me.getComponentLayout(),
                //margin: 0,
                text: Ext.String.format(me.todayText, today),
                tooltip: Ext.String.format(me.todayTip, today),
                tooltipType: 'title',
                height:21,
                handler: me.selectToday,
                scope: me
            });
        }

        var footerItems = [];
        
        var footerColumns = 3;
        
        if (me.showTime) {
            me.hour = Ext.create('Ext.form.field.Number', {
                minValue: 0,
                maxValue: 23,
                width: 39,
                enableKeyEvents: true,
                scope: me,
                //fieldLabel: '时',
                //labelWidth: 20,
                hideLabel : true,
                style: {
                    //marginLeft: '2px',
                    marginTop: '5px'
                },
                listeners: {
                    scope: me,
                    change: function(field, e){
                        this.value.setHours(field.getValue());
                    },
                    blur: function(field, e){
                        this.update(this.value,true);
                    },
                    keyup: function(field, e){
                        if (field.getValue() > 23){
                            e.stopEvent();
                            field.setValue(23);
                        }
                    }
                 }
            });
            
            me.minute = Ext.create('Ext.form.field.Number', {
                minValue: 0,
                maxValue: 59,
                width: 39,
                enableKeyEvents: true,
                scope: me,
                //fieldLabel: '分',
                //labelWidth: 20,
                hideLabel : true,
                style: {
                    marginLeft: '2px',
                    marginTop: '5px'
                },
                listeners: {
                    scope: me,
                    change: function(field, e){
                        this.value.setMinutes(field.getValue());
                    },
                    blur: function(field, e){
                        this.update(this.value,true);
                    },
                    keyup: function(field, e){
                        if (field.getValue() > 59){
                            e.stopEvent();
                            field.setValue(59);
                        }
                    }
                }
            });
            
            me.second = Ext.create('Ext.form.field.Number', {
                minValue: 0,
                maxValue: 59,
                width: 39,
                enableKeyEvents: true,
                scope: me,
                //fieldLabel: '秒',
                //labelWidth: 20,
                hideLabel : true,
                style: {
                    marginLeft: '2px',
                    marginTop: '5px'
                },
                listeners: {
                    scope: me,
                    change: function(field, e){
                        this.value.setSeconds(field.getValue());
                    },
                    blur: function(field, e){
                        this.update(this.value,true);
                    },
                    keyup: function(field, e){
                        if (field.getValue() > 59){
                            e.stopEvent();
                            field.setValue(59);
                        }
                    }
                }
            });
            footerItems.push(me.hour);
            footerItems.push(me.minute);
            footerItems.push(me.second);
            me.confirmBtn = new Ext.button.Button({
                //ownerCt: me,
                //ownerLayout: me.getComponentLayout(),
                //margin: 0,
                text: Ext.String.format(me.confirmText, today),
                //tooltip: Ext.String.format(me.confirmTip, today),
                //tooltipType: 'title',
                height:21,
                handler: me.confirmClick,
                scope: me
            });
        }//*/
        
        if (me.showTime && me.showToday) {
            footerItems.push(Ext.create('Ext.container.Container', {
                //renderTo: document.body,
                //ownerCt: me,
                //wnerLayout: me.getComponentLayout(),
                colspan: footerColumns,
                layout: {
                    type:'table',
                    tableAttrs: {
                        align:'center'
                    },
                    tdAttrs: {align:'center'},
                    columns: 2
                    //type: 'hbox',
                    //align: 'middle'
                    //type: 'vbox',
                    //align: 'center'
                },
                defaults: {
                },
                items: [me.todayBtn,me.confirmBtn],
                scope: me
            }));
        } else if (me.showToday) {
            footerColumns = 1;
            footerItems.push(me.todayBtn);
        } else if (me.showTime) {
            footerColumns = 4;
            footerItems.push(me.confirmBtn);
        }
        
        if (footerItems.length>0) {
            me.footerContainer = Ext.create('Ext.container.Container', {
                //renderTo: document.body,
                //ownerCt: me,
                //ownerLayout: me.getComponentLayout(),
                layout: {
                    type:'table',
                    tableAttrs: {
                        align:'center'
                    },
                    tdAttrs: {align:'center'},
                    columns: footerColumns
                },
                items: footerItems,
                scope: me
            });
        }

        Ext.apply(me.renderData, {
            showFooter: me.isShowFooter()
        });
    },

    /**
     * Get the current active date.
     * @private
     * @return {Date} The active date
     */
    isShowFooter: function(){
        return this.showToday || this.showTime;
    },

    // Do the job of a container layout at this point even though we are not a Container.
    // TODO: Refactor as a Container.
    finishRenderChildren: function () {
        var me = this;
        
        me.callParent();
        //*
        if (me.showTime) {
            me.hour.finishRender();
            me.minute.finishRender();
            me.second.finishRender();
        }//*/
        if (me.isShowFooter()) {
        	me.footerContainer.finishRender();
        }
    },

    /**
     * Sets the value of the date field
     * @param {Date} value The date to set
     * @return {Ext.ex.picker.DateTime} this
     */
    setValue : function(value){
    	//this.value = Ext.Date.clearTime(value, true);
        this.value = value;
        if (this.showTime) {
            this.hour.setValue(this.value.getHours());
            this.minute.setValue(this.value.getMinutes());
            this.second.setValue(this.value.getSeconds());
        }
        return this.update(this.value);
    },
    
    selectDate: function(value) {
        if (this.showTime) {
            value.setHours(this.hour.getValue());
            value.setMinutes(this.minute.getValue());
            value.setSeconds(this.second.getValue());
        }
        this.value = value;
        return this.update(this.value);
    },

    /**
     * Set the disabled state of various internal components
     * @private
     * @param {Boolean} disabled
     */
    setDisabledStatus : function(disabled){
        var me = this;

        me.callParent();

        if (me.showTime) {
            me.confirmBtn.setDisabled(disabled);
        }
        if (me.isShowFooter()) {
        	me.footerContainer.setDisabled(disabled);
        }
    },

    /**
     * Respond to an ok click on the month picker
     * @private
     */
    onOkClick: function(picker, value){
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, me.getActive().getDate());

        if (date.getMonth() !== month) {
            // 'fix' the JS rolling date conversion if needed
            date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1));
        }
        /*
        if (me.showTime) {
            date.setHours(me.hour.getValue());
            date.setMinutes(me.minute.getValue());
            date.setSeconds(me.second.getValue());
        }//*/
        me.update(date);
        me.hideMonthPicker();
    },

    /**
     * Respond to a date being clicked in the picker
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler;

        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            //me.setValue(new Date(t.dateValue));
            
            me.selectDate(new Date(t.dateValue));
            
            delete me.doCancelFocus;
            
            /* 有时间输入时单击事件不退出选择，只移动光标 */
            if (me.showTime) return;

            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },

    /**
     * Respond to a date being clicked in the picker
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    handleDateDblClick : function(e, t){
        var me = this,
            handler = me.handler;

        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            //me.setValue(new Date(t.dateValue));
            
            me.selectDate(new Date(t.dateValue));

            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },

    /**
     * Sets the current value to today.
     * @return {Ext.ex.picker.DateTime} this
     */
    selectToday : function(){
        var me = this,
            btn = me.todayBtn,
            handler = me.handler;

        if(btn && !btn.disabled){
            //me.setValue(Ext.Date.clearTime(new Date()));
            me.value = new Date();
            me.update(me.value);

            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },

    /**
     * Sets the current value to today.
     * @return {Ext.ex.picker.DateTime} this
     */
    confirmClick : function(){
        var me = this,
            btn = me.confirmBtn,
            handler = me.handler;

        if(btn && !btn.disabled){
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },

    /**
     * Update the selected cell
     * @private
     * @param {Date} date The new date
     */
    selectedUpdate: function(date){
        var me        = this,
            //t         = date.getTime(),
            t         = Ext.Date.clearTime(date,true).getTime(),
            cells     = me.cells,
            cls       = me.selectedCls,
            cellItems = cells.elements,
            c,
            cLen      = cellItems.length,
            cell;

        cells.removeCls(cls);

        for (c = 0; c < cLen; c++) {
            cell = Ext.fly(cellItems[c]);

            if (cell.dom.firstChild.dateValue == t) {
                me.fireEvent('highlightitem', me, cell);
                cell.addCls(cls);

                if(me.isVisible() && !me.doCancelFocus){
                    Ext.fly(cell.dom.firstChild).focus(50);
                }

                break;
            }
        }
    },

    // private, inherit docs
    beforeDestroy : function() {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.hour,
                me.minute,
                me.second,
                me.confirmBtn,
                me.footerContainer
            );
        }
        me.callParent();
    }
});
