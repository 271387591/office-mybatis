if (top != self) {
  top.location = self.location;
}

//if (dwr) {
////  dwr.engine.setActiveReverseAjax(true);
//  dwr.engine.setTimeout(600000);
//  dwr.engine.setErrorHandler(function(msg, exception) {
//    //Session timedout/invalidated
//    if (exception && exception.javaClassName == 'org.directwebremoting.extend.LoginRequiredException') {
//      //Reload or display an error etc.
//      window.location.href = globalRes.logoutUrl;
//    }
//  });
//
//  dwr.engine.setTextHtmlHandler(function() {
//    window.location.href = globalRes.logoutUrl;
//  });
//
//  dwr.engine.setPreHook(function() {
////    console.log('before dwr call...');
//  });
//  dwr.engine.setPostHook(function() {
//    if (globalRes.autoLogout) {
//      timeoutTask.delay((globalRes.sessionTimeout - countDown - 10) * 1000);
//    }
//  });
//}

var countDown = 30;
function ajaxPostRequest(url,params,callback){
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"请等候..."});
    myMask.show();
    Ext.Ajax.request({
        url: url || '',
        params: params || {},
        method: 'POST',
        success: function (response, options) {
            if (myMask != undefined){ myMask.destroy();}
            var result = Ext.decode(response.responseText,true);
            if(callback){
                callback(result);
            }
        },
        failure: function (response, options) {
            if (myMask != undefined){ myMask.hide();}
            Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
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

var timeoutTask = new Ext.util.DelayedTask(function() {
  var timer = new Array();
  var f = function(v) {
//console.log('v=',v);
    return function() {
      if (v == countDown) {
        Ext.MessageBox.hide();

        // session time out, need re login
        window.location.href = globalRes.logoutUrl;
      } else {
        Ext.MessageBox.updateProgress(v / countDown, Oz.Utils.getTplMsg(globalRes.timeoutTpl, {seconds: (countDown - v)}));
      }
    };
  };
  for (var i = 1; i <= countDown; i++) {
    timer[i - 1] = setTimeout(f(i), 1000 * i);
  }
    

  Ext.MessageBox.show({
    title: globalRes.timeoutTitle,
    msg: globalRes.timeoutMessage,
    progressText: Oz.Utils.getTplMsg(globalRes.timeoutTpl, {seconds: countDown}),
    width: 300,
    progress: true,
    closable: false,
    buttons: Ext.MessageBox.YESNO,
    fn: function(btn) {
      if (btn == 'yes') {
        // clear all timers
        for (var i = 0; i < countDown; i++) {
          if (timer[i]) {
            clearTimeout(timer[i]);
          }
        }

        // trigger a session reload
        //agentController.dummyCall();//dummy call
//        roleStore.load();// dummy
      }
      else {
        // session time out, need re login
        window.location.href = globalRes.logoutUrl;
      }
    },
    icon: Ext.MessageBox.WARNING
  });
});

//Ext.Ajax.on('requestcomplete', function(conn, response, options) {
//  var responseText = response.responseText;
//  if (responseText.indexOf('<body id="login">') != -1) {
//    Ext.MessageBox.show({
//      title: globalRes.reloginTitle,
//      width: messageBoxRes.width,
//      msg: globalRes.reloginMessage,
//      buttons: Ext.MessageBox.OK,
//      icon: Ext.MessageBox.ERROR,
//      fn: function() {
//        // session time out, need re login
//        window.location.href = globalRes.logoutUrl;
//      }
//    });
//  }
//  else{
//    if(globalRes.autoLogout){
//      var delayTime = (globalRes.sessionTimeout - countDown - 10) * 1000;
//      timeoutTask.delay(delayTime);
//    }
//  }
//});

// global access functions
//var frequencyGraphStore;
var roundTypeStore;

Ext.onReady(function () {
//  frequencyGraphStore = Ext.create('Ext.data.ArrayStore', {
////    autoDestroy: true,
//    storeId: 'frequencyGraphStore',
//    fields: ['value', 'label'],
//    data : graphFrequencies
//  });

//  roundTypeStore = Ext.create('Ext.data.ArrayStore', {
////    autoDestroy: true,
//    storeId: 'roundTypeStore',
//    fields: ['value', 'label'],
//    data : roundTypes
//  });
//
//  Ext.apply(Ext.form.field.VTypes, {
//    balanceText: globalRes.error.notBalanced,
//    balance: balanceVType
//  });
});


function balanceVType(v) {
  return balanceParens(v).balanced;
}

function balanceParens(v){
  v = '' || ('' + v);
  var re = /(\([^\(\)]*\))/g,
      test = v,
      hold = test,
      result = {
        balanced: true,
        index: -1,
        context: "none",
        display: v,
        reduced: ""
      }; // balanced_bool, index, context, resultstr, regex leftover

  while (hold != (test = test.replace(re, ""))) hold = test;

  var left = (test.match(/\(/g) || []).length;
  var right = (test.match(/\)/g) || []).length;
  var balance = right - left;

  result.balanced = !balance && !right && !left;
  result.reduced = test;

  // -------------------------------
  if (balance < 0) {
    var indx = -1;
    do{
      indx = v.indexOf("(", indx);
    }
    while (balance++);
    indx++;
    result.context = "left";
    result.index = indx - 1;
    result.display = v.substring(0, indx).fontcolor("red").bold() + v.substring(indx);
  }
  else
  if (balance > 0) {
    var indx = v.length + 1;
    while (balance--) {
      indx = v.lastIndexOf(")", indx - 1);
    }
    result.context = "right";
    result.index = indx;
    result.display = v.substring(0, indx) + v.substring(indx).fontcolor("red").bold();
  }
  else if (!result.balanced) { // equal left & right parens -- wrong orientation
    var lastresort = v.match(/[\)\(]/g);

    result.index = v.indexOf(lastresort[0]);
    result.display = v.substring(0, result.index) +
        v.substring(result.index,
            1 + v.lastIndexOf(lastresort[1])).fontcolor("red").bold() +
        v.substring(1 + v.lastIndexOf(lastresort[1]));
  }
  return result;
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

String.prototype.balanceParens = function(){
  var re = /(\([^\(\)]*\))/g;
  var test = this;
  var hold = test;
  var result = {
    balanced: true,
    index: -1,
    context: "none",
    display: this,
    reduced: ""
  }; // balanced_bool, index, context, resultstr, regex leftover

  while(hold!=(test = test.replace(re,""))) hold = test;

  var left = (test.match( /\(/g ) || []).length;
  var right = (test.match( /\)/g ) || []).length;
  var balance = right - left;

  result.balanced = !balance && !right && !left;
  result.reduced = test;

  // -------------------------------
  if(balance < 0){
    var indx = -1;
    do{
      indx = this.indexOf("(", indx);
    }
    while(balance++);
    indx++;
    result.context = "left";
    result.index = indx-1;
    result.display = this.substring(0,indx).fontcolor("red").bold() + this.substring(indx);
  }
  else
  if(balance > 0){
    var indx = this.length + 1;
    while(balance--)
    {
      indx = this.lastIndexOf(")", indx-1);
    }
    result.context = "right";
    result.index = indx;
    result.display = this.substring(0,indx) + this.substring(indx).fontcolor("red").bold();
  }
  else if(!result.balanced){ // equal left & right parens -- wrong orientation
    var lastresort = this.match(/[\)\(]/g);

    result.index = this.indexOf(lastresort[0]);
    result.display = this.substring(0, result.index) +
      this.substring(result.index,
        1+this.lastIndexOf(lastresort[1])).fontcolor("red").bold() +
      this.substring(1 +this.lastIndexOf(lastresort[1]));
  }

    
  return result;
}

function notify(title, message, autoHide) {
    var sticky = true;
    if (autoHide) {
        sticky = false;
    }
}
