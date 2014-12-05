if (top != self) {
  top.location = self.location;
}
Ext.require('Ext.ux.window.Notification');
var systemMessageTpl=new Ext.XTemplate(
    '<html>',
    '<title>系统待办任务提示</title>',
    '<body>',
    '<p>{contentMap.userFullName}:您好</p>',
    '<p>您有一条任务【<font color="red">{contentMap.taskName}</font>】未处理，来自{contentMap.starter}于{contentMap.startTime}申请的{contentMap.instanceTitle}，请你尽快处理。</p>',
    '<br/>本邮件来xxx办公管理系统自动产生，不需回复。',
    '</body>',
    '</html>'
);
PL._init();
PL.joinListen('/systemMessage?username='+globalRes.userName);
function onData(event) {
    var msg=event.get(globalRes.userName);
    msg = decodeURIComponent(msg);
    var obj={};
    obj.contentMap=Ext.decode(msg);
    var box=Ext.create('widget.uxNotification', {
        title: '你有未读信息',
        position: 'br',
        manager: 'instructions',
        cls: 'ux-notification-window',
        stickWhileHover: false,
        height: 150,
        width: 220,
        autoScroll:true,
        buttons:[
            {
                text:'查看更多',
                handler:function(){
                    var apptabs = Ext.ComponentQuery.query('#apptabs')[0];
                    apptabs.addTab('systemMessageView','systemMessageView','#welcomeindex');
                    box.close();
                }
            }

        ],
        html: systemMessageTpl.applyTemplate(obj),
        autoCloseDelay: 20000,
        slideInDuration: 500,
        slideBackDuration: 200
    }); 
    if(msg){
        if(box){
            box.show();
        }
    }else{
        if(box){
            box.close();
        }
    }
}
function ActionColumnHideAccess(config){
    var checkAccess=function(featureName){
        if(featureName == '#allowAll#'){
            return true;
        }
        var parts = featureName.split('|');
        for(var i = 0; i < parts.length; i ++){
            if(accessRes[parts[i]] == true){
                return true;
            }
        }
        return false;
    }
    var getClass=function(){
        if((checkAccess(config.featureName) || config.byPass) && config.extra){
            return config.cls;
        }
        return 'x-hide-display'
    }
    return getClass
}
function ActionColumnDisabledAccess(config){
    var checkAccess=function(featureName){
        if(featureName == '#allowAll#'){
            return true;
        }
        var parts = featureName.split('|');
        for(var i = 0; i < parts.length; i ++){
            if(accessRes[parts[i]] == true){
                return true;
            }
        }
        return false;
    }
    var isDisabled=function(){
        if(checkAccess(config.featureName) || config.byPass){
            return false;
        }
        return true;

    }
    return isDisabled
}

function ajaxPostRequest(url,params,callback,mask){

    var box = Ext.MessageBox;
    box.show({
        msg: globalRes.loading,
        progressText: globalRes.loading,
        width:300,
        wait:true,
        waitConfig: {interval:200},
        iconCls:'loading-ux', //custom class in msg-box.html
        animateTarget: 'mb7'
    });
    //var myMask = new Ext.LoadMask(Ext.getBody(), {msg:globalRes.loading});
    //if(!mask){
    //    myMask.show();
    //}
    Ext.Ajax.request({
        url: url || '',
        params: params || {},
        method: 'POST',
        success: function (response, options) {
            //if (myMask != undefined){ myMask.destroy();}
            if (box != undefined){ box.close();}
            var result = Ext.decode(response.responseText,true);
            if(callback){
                callback(result);
            }
        },
        failure: function (response, options) {
            //if (myMask != undefined){ myMask.hide();}
            if (box != undefined){ box.close();}
            Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
        }
    });
}

// ajax回调函数处理系统退出
Ext.Ajax.on('requestcomplete',checkUserSessionStatus, this);
function checkUserSessionStatus(conn,response,options){
//  debugger;
    //Ext重新封装了response对象
    try{
        if(response && response.getAllResponseHeaders().sessionstatus){
            setTimeout(function (){
                Ext.MessageBox.alert(globalRes.title.fail,globalRes.msg.logoutTimeout,function (){
                    location.href = location.href;
                });
            },500);
        }
    }catch (e){
        
    }
    
}
function setCookie(name,value,expires,path,domain,secure) {
    document.cookie = name + "=" + escape (value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}
function getCookie(name) {
    var prefix = name + "=";
    var start = document.cookie.indexOf(prefix);

    if (start==-1) {
        return null;
    }

    var end = document.cookie.indexOf(";", start+prefix.length);
    if (end==-1) {
        end=document.cookie.length;
    }

    var value=document.cookie.substring(start+prefix.length, end);
    return unescape(value);
}
Ext.applyIf(Array.prototype, {
    /**
     * Checks whether or not the specified object exists in the array.
     * @param {Object} o The object to check for
     * @param {Number} from (Optional) The index at which to begin the search
     * @return {Number} The index of o in the array (or -1 if it is not found)
     */
    indexOf : function(o, from){
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    },

    /**
     * Removes the specified object from the array.  If the object is not found nothing happens.
     * @param {Object} o The object to remove
     * @return {Array} this array
     */
    remove : function(o){
        var index = this.indexOf(o);
        if(index != -1){
            this.splice(index, 1);
        }
        return this;
    }
});

