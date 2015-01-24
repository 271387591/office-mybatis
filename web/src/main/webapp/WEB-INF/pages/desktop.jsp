<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<html>
<%
    String language = response.getLocale().toString();
    if ("en_US".equalsIgnoreCase(language)) {
        language = "en";
    }
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <c:set var="language"><%=language %></c:set>
    <%--<title>Flex Center Desktop</title>--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="icon" type="image/x-icon" />--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="shortcut icon" type="image/x-icon" />--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/desktop/css/desktop.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/editor.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/common.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/explorer.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/ux/Ext/ux/growl/css/ext-growl.css'/>"/>--%>

    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/growl/css/ext-growl.css'/>"/>

    <c:url var="defaultExtTheme" value="/scripts/ext/resources/css/ext-all.css"/>
    <%--<c:url var="grayExtTheme" value="/scripts/ext/resources/css/ext-all-gray.css"/>--%>
    <%--<c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>--%>
    <%--<script type="text/javascript" src="<c:url value='/ext/ext-core.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-zh_CN.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/json2.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ux/Ext/ux/growl/ext-growl.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value="/jscripts/desktopRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/jscriptRes.js"/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/desktop/classes.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-${language}.js'/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/ckeditor/ckeditor.js"/>"></script>

    <script type="text/javascript" src="<c:url value='/scripts/lib/jquery-1.7.1.min.js'/>"></script>

    <script type="text/javascript">
        extTheme = '<c:url value="/scripts/ext/resources/css/ext-all"/>';
        basePath = '<c:url value="/"/>';
        mxBasePath = basePath+'mxgraph/src';
        <%--defaultExtTheme=${defaultExtTheme};--%>
//        mxDefaultLanguage='zh_CN';
    </script>
    <script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxClient.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxModeler.js"/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/lib/ajax-pushlet-client.js'/>"></script>
    

  <style type="text/css" >
      .x-message-box .ext-mb-loading {
          background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
          height: 52px !important;
      }
  </style>

  <script type="text/javascript">
      var isLogout = false;
      window.onbeforeunload = function () {
          if(!isLogout){
              return '您即将离开本页面，如有未保存的数据将会丢失，是否继续？';
          }
      };
    // Enable dynamic loading for improved debugging support
//    Ext.getBody().addCls(Ext.baseCSSPrefix + 'theme-' + Ext.themeName);
    var theme = Ext.util.Cookies.get('FlexCenter_Ext_Theme');
    if(theme){
        Ext.util.CSS.swapStyleSheet("FlexCenter_Ext_Theme", extTheme + theme + ".css");
    }
    Ext.Loader.setConfig({
          enabled: true,
          basePath: '<c:url value="/scripts/ext/src"/>',
          disableCaching: true
        }
    );

    Ext.Loader.setPath({
      'Ext.ux.desktop': '<c:url value="/scripts/desktop/js"/>',
      'Ext.ux': '<c:url value="/scripts/ux/Ext/ux"/>',
      FlexCenter: '<c:url value="/scripts/ozstrategy"/>',
      Oz: '<c:url value="/scripts/ux/Oz"/>'
    });

  </script>
    <script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>

  <script type="text/javascript">
    var apps = {};
    Ext.require([
      'FlexCenter.App',
      'Ext.ux.utils.Utils',
      'FlexCenter.Constants',
      'Ext.data.ArrayStore',
      'Ext.util.CSS'
    ]);
    var flexCenterApp;
    var treeRegister;
    var surveyRegister;
    Ext.onReady(function () {
        
      flexCenterApp = new FlexCenter.App();
      var oDiv = document.getElementById('loading');
      oDiv.style.display = "none";
      for (var i = 0; i < oDiv.childNodes.length; i++)
        oDiv.removeChild(oDiv.childNodes[i]);

      //perform when press backspace on desktop
      function doKey(e) {
        var ev = e || window.event;//bet event obj
        var obj = ev.target || ev.srcElement;//get event source
        var t = obj.type || obj.getAttribute('type');//get event soruce type

        if (ev.keyCode == 8 && t == null) {
          return false;
        }
//          else if(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"){
//              return false;
//          }
      }

      if (Ext.isIE) {
        //in IE,Chrome
        document.onkeydown = doKey;
      } else {
        //in Firefox,Opera
        document.onkeypress = doKey;
      }
    });
  </script>

</head>
<body>
<div id="loading" class="loading">
    <div class="ozMiddleIcon"></div>
</div>
<div id="tmpForm"></div>
</body>
</html>