<%--<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<html>
<%
    String language = response.getLocale().toString();
    if ("en_US".equalsIgnoreCase(language)) {
        language = "en";
    }
%>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title><fmt:message key="webapp.name"/></title>
    <c:set var="language"><%=language %></c:set>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/desktop/css/desktop.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/common.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/explorer.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/growl/css/ext-growl.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/ux/Ext/ux/growl/css/ext-growl.css'/>"/>--%>

    <c:url var="defaultExtTheme" value="/scripts/ext/resources/css/ext-all.css"/>
    <%--<c:url var="grayExtTheme" value="/scripts/ext/resources/css/ext-all-gray.css"/>--%>
    <%--<c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>--%>
    <%--<script type="text/javascript" src="<c:url value='/ext/ext-core.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ux/Ext/ux/growl/ext-growl.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value="/jscripts/desktopRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/jscriptRes.js"/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/desktop/classes.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-${language}.js'/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/ckeditor/ckeditor.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/lib/modeler.min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/lib/jquery-1.7.1.min.js"/>"></script>

    <script type="text/javascript">
        extTheme = '<c:url value="/scripts/ext/resources/css/ext-all"/>';
        basePath = '<c:url value="/"/>';
        mxBasePath = 'mxgraph/src';
    </script>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxClient.js"/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/js/mxApplication.js"/>"></script>--%>


  <script type="text/javascript" src='<c:url value="/demo/demo.js"/>'></script>


</head>
<body>
<div id="loading" class="loading">
    <div class="ozMiddleIcon"></div>
</div>
<div id="tmpForm"></div>
<style type="text/css" >
    .x-message-box .ext-mb-loading {
        background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
        height: 52px !important;
    }
</style>
<script type="text/javascript">
    var apps = {};
    Ext.Loader.setPath({
        'Ext.ux.desktop': '<c:url value="/demo"/>',
        'Ext.ux': '<c:url value="/demo"/>',
        FlexCenter: '<c:url value="/demo"/>',
        Oz: '<c:url value="/demo"/>'
    });


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
</body>
</html>