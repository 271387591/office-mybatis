/**
 * Created by lihao on 10/20/14.
 */
Ext.define('Oz.app.Tabs', {
    extend: 'Ext.container.Container',
    requires: [
        'Oz.app.TabMenu'
    ],
    id:'apptabs',
    alias: 'widget.apptabs',
    componentCls: 'doctabs',
    minTabWidth: 80,
    maxTabWidth: 160,
    animDuration: 150,
    tabs: [],
    tabsInBar: [],
    tabCache: {},
    staticTabs: [],
    centerPanel:'',
    initComponent: function() {
        this.addEvents(
            /**
             * @event
             * Fired when one of the tabs gets activated.
             * @param {String} url The URL of the page associated with the tab.
             * @param {Object} opts Might contain `{navigate: true}`.
             */
            "tabActivate",
            /**
             * @event
             * Fired when one of the tabs gets closed from close button.
             * @param {String} url The URL of the page associated with the tab.
             */
            "tabClose",
            "addTab"
        );
        this.tpl = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="doctab overview {cls} {display}">',
            '<div class="l"></div>',
            '<div class="m">',
            '<tpl if="text">',
            '<a class="tabUrl ov-tab-text" href="{href}">{text}</a>',
            '<tpl else>',
            '<a class="tabUrl ov-tab" href="{href}">&nbsp;</a>',
            '</tpl>',
            '</div>',
            '<div class="r"></div>',
            '</div>',
            '</tpl>',
            '<div style="float: left; width: 8px">&nbsp;</div>',
            '<div class="tab-overflow"></div>'
        );
        this.closeTpl = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="doctab overview {cls}">',
            '<div class="l"></div>',
            '<div class="m">',
            '<tpl if="text">',
            '<a class="tabUrl ov-tab-text" href="{href}">{text}</a>',
            '<tpl else>',
            '<a class="tabUrl ov-tab" href="{href}">&nbsp;</a>',
            '</tpl>',
            '</div>',
            '<div class="r"></div>',
            '</div>',
            '</tpl>',
            '<div style="float: left; width: 8px">&nbsp;</div>',
            '<div class="tab-overflow"></div>'
        );
        

        this.html = this.tpl.applyTemplate(this.staticTabs);

        this.tabTpl = Ext.create('Ext.XTemplate',
            '<div class="doctab',
            '{[values.active ? (" active") : ""]}',
            '" style="',
            '{[values.width ? ("width: " + values.width + "px;") : ""]}',
            '{[values.visible ? "" : "visibility: hidden;"]}">',
            '<div class="l"></div>',
            '<div class="m">',
            '<span class="icn {iconCls}">&nbsp;</span>',
            '<a class="tabUrl main-tab" href="{href}">{text}</a>',
            '</div>',
            '<div class="r"><a class="close" href="{parentUrl}"></a></div>',
            '</div>'
        );

        this.on("afterrender", this.initListeners, this);

        this.on("resize", this.refresh, this);
        this.mon(this,'tabActivate',this.tabActivate)
        this.mon(this,'addTab',this.addTab)
        this.callParent();
    },

    initListeners: function() {
        this.refresh();
        this.initActive();
        this.el.on('mouseover', function(event, el) {
            Ext.get(el).addCls('ovr');
        }, this, {
            delegate: '.close'
        });
        this.el.on('mouseout', function(event, el) {
            Ext.get(el).removeCls('ovr');
        }, this, {
            delegate: '.close'
        });
        this.el.on('click', function(event, el) {
            var url = Ext.get(el).up('.doctab').down('.tabUrl').getAttribute('href');
            var parentUrl = Ext.get(el).up('.doctab').down('.close').getAttribute('href');
            this.removeTab(url,parentUrl);
            this.fireEvent("tabClose", url,parentUrl);
        }, this, {
            delegate: '.close',
            preventDefault: true
        });

        this.el.on('click', function(event, el) {
            if (Ext.fly(event.getTarget()).hasCls("close")) {
                return;
            }
            var url = Ext.get(el).down('.tabUrl').getAttribute('href');
            this.fireEvent("tabActivate", url);
        }, this, {
            delegate: '.doctab'
        });

        this.el.on('contextmenu', function(event, el) {
            if (!Ext.get(el).hasCls('overview')) {
                var url = Ext.get(el).down('.tabUrl').getAttribute('href');
                this.createMenu(url).showBy(el);
            }
        }, this, {
            delegate: '.doctab',
            preventDefault: true
        });

        this.el.on('click', Ext.emptyFn, this, {
            delegate: '.tabUrl',
            preventDefault: true
        });

        this.el.on('mouseleave', function() {
            if (this.shouldResize) {
                this.resizeTabs({animate: true});
            }
        }, this);
    },
    tabActivate: function(url, config){
        var staticTabs=this.staticTabs;
        var hasMainUrl = function(herf){
            for(var i=0;i<staticTabs.length;i++){
                var item=staticTabs[i];
                if(item.href==herf){
                    return herf;
                }
            }
        };
        var center=Ext.ComponentQuery.query('#'+this.centerPanel)[0];
        var card=Ext.ComponentQuery.query('#'+this.cardPanel)[0];
        var panel=Ext.ComponentQuery.query(url)[0];
        if(url==hasMainUrl(url)){
            if(!panel){
                panel=Ext.widget(url.substr(1),config);
            }
            this.loadIndex(panel);
        }else{
            if(panel){
                this.activateTab('#'+panel.itemId);
                center.setActiveTab(panel);
                card.getLayout().setActiveItem(center);
            }
        }
    },
    loadIndex:function(panel){
        this.activateTab('#'+panel.itemId);
        this.setActiveTab(panel);
    },
    
    setStaticTabs: function(tabs) {
        this.staticTabs = tabs;
        this.refresh();
    },

    /**
     * Returns array of static tab configs.
     * @return {Object[]} See {@link #setStaticTabs} for details.
     */
    getStaticTabs: function(tab) {
        return this.staticTabs;
    },

    /**
     * Adds a new tab
     *
     * @param {Object} tab
     * @param {String} tab.href URL of the resource
     * @param {String} tab.text Text to be used on the tab
     * @param {String} tab.iconCls CSS class to be used as the icon
     * @param {Object} opts Options object:
     * @param {Boolean} opts.animate True to animate the addition
     * @param {Boolean} opts.activate True to activate the tab
     */
    addTab: function(widget, itemId, parentUrl,config) {
        var me=this;
        var cardpanel = Ext.ComponentQuery.query('#'+this.cardPanel)[0];
        var centerpanel = Ext.ComponentQuery.query('#'+this.centerPanel)[0];
        cardpanel.getLayout().setActiveItem(centerpanel);
        var panel = Ext.ComponentQuery.query('#'+itemId)[0];
        if(!panel){
            if(config){
                config.itemId=itemId;
            }
            panel=Ext.widget(widget,config);
            centerpanel.add(panel);
            panel.on('close',function(){
                me.closeUrlTab(('#'+itemId),parentUrl);
            });
        }
        centerpanel.setActiveTab(panel);
        var tab={
            parentUrl:parentUrl,
            href: '#'+itemId,
            text: panel.text,
            tooltip:panel.text,
            iconCls: panel.iconCls
        }
        var opts ={ animate: true, activate: true };
        this.tabCache[tab.href] = tab;
        if (!this.hasTab(tab.href)) {
            this.tabs.push(tab.href);
            if (this.roomForNewTab()) {
                this.addTabToBar(tab, opts);
            }
            this.addTabToMenu(this.overflowButton.menu, tab);
        }
        if (opts.activate) {
            this.activateTab(tab.href);
        }
    },
    setActiveTab:function(panel){
        var center=Ext.ComponentQuery.query('#'+this.cardPanel)[0];
        if(center){
            center.layout.setActiveItem(panel);
        }
    },
    closeUrlTab:function(url,parentUrl){
        if (!this.hasTab(url)) {
            return;
        }
        this.removeFromArray(this.tabs, url);
        var removedIndex = this.removeFromArray(this.tabsInBar, url);

        // An empty space in tab-bar has now become available
        // If the all-tabs array has an item to fill this spot,
        // add the item from all-tabs array to tab-bar.
        var firstHiddenTab = this.tabs[this.tabsInBar.length];
        if (firstHiddenTab) {
            this.tabsInBar.push(firstHiddenTab);
        }

        // Was the active tab closed?
        if (this.activeTab === url) {
            if (this.tabs.length === 0) {
                var panel=Ext.ComponentQuery.query(parentUrl)[0];
                if(panel){
                    this.loadIndex(panel);
                }
            }else {
                if (removedIndex === this.tabs.length) {
                    removedIndex -= 1;
                }
                this.fireEvent("tabActivate", this.tabs[removedIndex]);
            }
        }

        // When removed tab got replaced with hidden tab do a full refresh of tabs.
        // Otherwise just remove the single tab.
        if (this.tabs.length >= this.maxTabsInBar()) {
            this.refresh();
        } else {
            this.removeTabFromBar(url);
        }
    },


    /**
     * Removes a tab. If the tab to be closed is currently active, activate a neighboring tab.
     *
     * @param {String} url URL of the tab to remove
     */
    removeTab: function(url,parentUrl) {
        if (!this.hasTab(url)) {
            return;
        }
        var panel = Ext.ComponentQuery.query(url)[0];
        if(panel){
            panel.close();
        }
        
    },

    // Removes item from array
    // Returns the index from which the item was removed.
    removeFromArray: function(array, item) {
        var idx = Ext.Array.indexOf(array, item);
        if (idx !== -1) {
            Ext.Array.erase(array, idx, 1);
        }
        return idx;
    },

    /**
     * Activates a tab
     *
     * @param {String} url URL of tab
     */
    activateTab: function(url) {
        this.activeTab = url;
        if (!this.inTabs(url)) {
            this.swapLastTabWith(url);
        }
        Ext.Array.each(Ext.query('.doctab a.tabUrl'), function(d) {
            Ext.get(d).up('.doctab').removeCls(['active', 'highlight']);
        });
        var activeTab = Ext.query('.doctab a[href="' + url + '"]')[0];
        if (activeTab) {
            var docTab = Ext.get(activeTab).up('.doctab');
            docTab.addCls('active');
        }
        this.highlightOverviewTab(url);
    },

    /**
     *  Re-renders tabs and overflow. Useful for window resize event.
     */
    refresh: function(closeAll) {
        var html;
        if(closeAll){
            html=this.closeTpl.applyTemplate(this.staticTabs);
        }else{
            html = this.tpl.applyTemplate(this.staticTabs);
        }
        var len = this.maxTabsInBar() < this.tabs.length ? this.maxTabsInBar() : this.tabs.length;
        this.tabsInBar = this.tabs.slice(0, len);
        for (var i=0; i< len; i++) {
            var tab = this.tabCache[this.tabs[i]];
            var tabData = Ext.apply(tab, {
                visible: true,
                active: this.activeTab === tab.href,
                width: this.tabWidth()
            });
            html += this.tabTpl.applyTemplate(tabData);
        }
        this.el.dom.innerHTML = html;
        if (this.activeTab && this.activeTab !== this.tabs[len-1]) {
            this.fireEvent("tabActivate", this.activeTab);
        }
        this.highlightOverviewTab(this.activeTab);
        this.createOverflowButton();
        this.addToolTips();
    },

    initActive:function(){
        var me=this;
        Ext.Array.each(this.staticTabs,function(tab){
            var display=tab.display;
            if('active'==display){
                me.fireEvent("tabActivate", tab.href);
            }
        });
    },
    closeAllTabs: function(item) {
        this.activeTab=item.tabUrl;
        var tabs=this.tabs;
        for(var i=0;i<tabs.length;i++){
            if(tabs[i]!=this.activeTab){
                var panel=Ext.ComponentQuery.query(tabs[i])[0];
                if(panel){
                    panel.close();
                }
            }
        }
        if (this.inTabBar(this.activeTab)) {
            this.tabs = this.tabsInBar = [ this.activeTab ];
        } else {
            this.tabs = this.tabsInBar = [];
        }
        var center=Ext.ComponentQuery.query('#'+this.centerPanel)[0];
        var card=Ext.ComponentQuery.query('#'+this.cardPanel)[0];
        var panel=Ext.ComponentQuery.query(this.activeTab.substr(1))[0];
        center.setActiveTab(panel);
        card.getLayout().setActiveItem(center);
        this.refresh(true);
    },



    /**
     * @private
     * Determines if the tab bar has room for a new tab.
     * @return {Boolean} True if tab bar has room for a new tab
     */
    roomForNewTab: function() {
        return this.tabsInBar.length < this.maxTabsInBar();
    },

    /**
     * @private
     * @return {Boolean} True if we are already tracking a tab with the given URL
     */
    hasTab: function(url) {
        return Ext.Array.contains(this.tabs, url);
    },

    /**
     * @private
     * Adds a tab to the tab bar
     */
    addTabToBar: function(tab, opts) {
        this.tabsInBar.push(tab.href);

        var docTab = Ext.get(this.tabTpl.append(this.el.dom, tab));

        this.addMainTabTooltip(docTab, tab);

        if (opts.animate && !Ext.isIE) {
            docTab.setStyle('width', '10px');
            docTab.setStyle({ visibility: 'visible' });
            docTab.animate({
                to: { width: this.tabWidth() }
            });
        }
        else {
            docTab.setStyle({ visibility: 'visible' });
        }

        this.resizeTabs(opts);
    },

    /**
     * @private
     * @return {Boolean} true if the tab is in the tab bar
     */
    inTabBar: function(url) {
        return Ext.Array.contains(this.tabsInBar, url);
    },

    /**
     * @private
     * @return {Boolean} true if the tab is in the tab bar or static tabs
     */
    inTabs: function(url) {
        var urls = Ext.Array.pluck(this.staticTabs, 'href').concat(this.tabsInBar);
        return Ext.Array.contains(urls, url);
    },

    /**
     * @private
     */
    removeTabFromBar: function(url) {
        var docTab = this.getTabEl(url);

        docTab.dom.removed = true;
        if (Ext.isIE) {
            docTab.remove();
            this.createOverflowButton(url);
        } else {
            docTab.animate({
                to: { top: 30 },
                duration: this.animDuration
            }).animate({
                to: { width: 10 },
                duration: this.animDuration,
                listeners: {
                    afteranimate: function() {
                        docTab.remove();
                        this.shouldResize = true;
                        this.createOverflowButton(url);
                    },
                    scope: this
                }
            });
        }
    },

    /**
     * @private
     * Swaps the last tab with the given tab currently in the overflow list
     */
    swapLastTabWith: function(url) {
        var lastTab = this.getTabEl(this.tabsInBar[this.tabsInBar.length - 1]);
        if (lastTab) {
            var newTab = this.tabTpl.append(document.body, this.tabCache[url]);
            lastTab.dom.parentNode.replaceChild(newTab, lastTab.dom);
            this.tabsInBar[this.tabsInBar.length - 1] = url;
            Ext.get(newTab).setStyle({ visibility: 'visible', width: String(this.tabWidth()) + 'px' });

            this.addMainTabTooltip(newTab, this.tabCache[url]);
        }
    },

    /**
     * @private
     */
    highlightOverviewTab: function(url) {
        if(url){
            var overviewTab = Ext.query('.doctab.' + url.substr(1));
            if (overviewTab && overviewTab[0]) {
                Ext.get(overviewTab[0]).addCls('highlight');
            }
        }
        
    },

    /**
     * @private
     * @return {Number} Maximum number of tabs we can fit in the tab bar
     */
    maxTabsInBar: function() {
        return Math.floor(this.tabBarWidth() / this.minTabWidth);
    },

    /**
     * @private
     * @return {Number} Width of a tab in the tab bar
     */
    tabWidth: function() {
        var width = Math.floor(this.tabBarWidth() / this.tabsInBar.length) + 6;

        if (width > this.maxTabWidth) {
            return this.maxTabWidth;
        }
        else if (width < this.minTabWidth) {
            return this.minTabWidth;
        }
        else {
            return width;
        }
    },

    /**
     * @private
     * @return {Number} Width of the tab bar (not including the static tabs)
     */
    tabBarWidth: function() {
        return this.getWidth() - (this.staticTabs.length * 50) - 15;
    },

    /**
     * @private
     * Resize tabs in the tab bar
     */
    resizeTabs: function(opts) {
        this.shouldResize = false;
        Ext.Array.each(Ext.query('.doctab'), function(t){
            var docTab = Ext.get(t);
            if (!docTab.dom.removed && !docTab.hasCls('overview')) {
                if (opts && opts.animate && !Ext.isIE) {
                    docTab.animate({
                        to: { width: this.tabWidth() }
                    });
                } else {
                    docTab.setWidth(this.tabWidth());
                }
            }
        }, this);
    },

    getTabEl: function(url) {
        var doctab = Ext.query('.doctab a[href="' + url + '"]');
        if (doctab && doctab[0]) {
            return Ext.get(doctab[0]).up('.doctab');
        }
    },

    // Creates new overflow button, replacing the existing one
    createOverflowButton: function(url) {
        if (this.overflowButton) {
            this.overflowButton.destroy();
        }

        this.overflowButton = Ext.create('Ext.button.Button', {
            baseCls: "",
            renderTo: this.getEl().down('.tab-overflow'),
            menu: this.createMenu(url)
        });
    },

    // creates menu listing all tabs
    createMenu: function(url) {
        var menu = new Oz.app.TabMenu({
            tabUrl:url,
            listeners: {
                closeAllTabs: this.closeAllTabs,
                tabItemClick: function(item) {
                    this.fireEvent("tabActivate", item.href, { navigate: true });
                },
                scope: this
            }
        });

        Ext.Array.each(this.tabs, function(tab) {
            this.addTabToMenu(menu, this.tabCache[tab]);
        }, this);

        return menu;
    },

    // Adds a tab to the menu
    addTabToMenu: function(menu, tab) {
        var idx = Ext.Array.indexOf(this.tabs, tab.href);

        if (this.tabs.length > this.tabsInBar.length && idx === this.maxTabsInBar()) {
            // Add 'overflow' class to last visible tab in overflow dropdown
            menu.addTabCls(tab, 'overflow');
        }

        var inTabBar = this.inTabBar(tab.href);
        menu.addTab(tab, inTabBar ? '' : 'overflow');
    },

    addToolTips: function() {
        Ext.Array.each(this.staticTabs, function(tab) {
            if(tab && (tab.cls!=undefined || tab.cls!=null)){
                var clses=Ext.query('.doctab.' + tab.cls);
                Ext.Array.each(clses,function(cls){
                    var el = Ext.get(cls);
                    if (el) {
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: tab.tooltip
                        });
                    }
                });
            }
        });

        Ext.Array.each(this.tabsInBar, function(url) {
            var el = Ext.get(Ext.query('a.main-tab[href="' + url + '"]')[0]);
            var tab = this.tabCache[url];
            if (el) {
                this.addMainTabTooltip(el.up(".doctab"), tab);
            }
        }, this);
    },

    addMainTabTooltip: function(tabEl, tab) {
        if (tab.tooltip) {
            Ext.create('Ext.tip.ToolTip', {
                target: tabEl,
                html: tab.tooltip
            });
        }
    }
});