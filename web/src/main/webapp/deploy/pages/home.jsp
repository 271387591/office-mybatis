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
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all-neptune.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/desktopRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/jscriptRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-${language}.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/lib/jquery-1.7.1.min.js'/>"></script>


    <script type="text/javascript">
        extTheme = '<c:url value="/scripts/ext/resources/css/"/>';
        basePath = '<c:url value="/"/>';
        mxBasePath = 'mxgraph/src';
    </script>

    <script type="text/javascript" src='<c:url value="/demo/demo.js"/>'></script>

    
    <style type="text/css" >
        .x-message-box .ext-mb-loading {
            background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
            height: 52px !important;
        }
    </style>

    <script type="text/javascript">
        var isLogout = false;
        window.onbeforeunload = function () {
            if(!isLogout)
                return '您即将离开本页面，如有未保存的数据将会丢失，是否继续？';
        };
        Ext.Loader.setConfig({
                    enabled: true,
                    basePath: '<c:url value="/scripts/ext/src"/>',
                    disableCaching: true
                }
        );

        Ext.Loader.setPath({
            <%--'Ext.ux.desktop': '<c:url value="/scripts/desktop/js"/>',--%>
            'Ext.ux': '<c:url value="/demo"/>',
            FlexCenter: '<c:url value="/demo"/>',
            Oz: '<c:url value="/demo"/>'
        });

    </script>
    <%--<jwr:script src="/ozExtComponets/flexcenter/global.js" />--%>

    <script type="text/javascript">


        var apps = {};
        Ext.require([
            'FlexCenter.UserViewport',
            'Ext.data.ArrayStore',
            'Ext.util.CSS'
        ]);
        var ozSOAViewport;
        var ozSOA;
        Ext.onReady(function () {
            Ext.QuickTips.init();
            ozSOAViewport = new FlexCenter.UserViewport();
            var oDiv = document.getElementById('loading');
            oDiv.style.display = "none";
            for (var i = 0; i < oDiv.childNodes.length; i++)
                oDiv.removeChild(oDiv.childNodes[i]);

            <%--//perform when press backspace on desktop--%>
            function doKey(e) {
                var ev = e || window.event;//bet event obj
                var obj = ev.target || ev.srcElement;//get event source
                var t = obj.type || obj.getAttribute('type');//get event soruce type

                if (ev.keyCode == 8 && t == null) {
                    return false;
                }
            }
            if (Ext.isIE) {
                document.onkeydown = doKey;
            } else {
                document.onkeypress = doKey;
            }
        });

    </script>
    <title><fmt:message key="webapp.name" /></title>
</head>
<body>
<div id="loading" class="loading">
    <div class="ozMiddleIcon"></div>
</div>
<div id="tmpForm"></div>
</body>
</html>