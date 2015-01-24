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
    
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/ExecDashboard-all.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    
    

    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/editor.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext5.0/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css'/>"/>--%>
    
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/ExecDashboard-all.css'/>"/>--%>
    
    <%--<c:url var="grayExtTheme" value="/scripts/ext5.0/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css"/>--%>
    <%--<c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>--%>
    <%--<script type="text/javascript" src="<c:url value='/ext/ext-core.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext5.0/ext-all.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext5.0/bootstrap.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-zh_CN.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/json2.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ux/Ext/ux/growl/ext-growl.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value="/jscripts/desktopRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/jscriptRes.js"/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/desktop/classes.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext5.0/packages/ext-locale/build/ext-locale-${language}.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value="/scripts/ckeditor/ckeditor.js"/>"></script>

    <script type="text/javascript" src="<c:url value='/scripts/lib/jquery-1.7.1.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/lib/ajax-pushlet-client.js'/>"></script>

    <script type="text/javascript">
        <%--extTheme = '<c:url value="/scripts/ext/resources/css/ext-all"/>';--%>
        basePath = '<c:url value="/"/>';
        //        mxBasePath = basePath+'mxgraph/src';
        <%--defaultExtTheme=${defaultExtTheme};--%>
        //        mxDefaultLanguage='zh_CN';
    </script>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxClient.js"/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxModeler.js"/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/js/mxApplication.js"/>"></script>--%>

    <script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>
    <%--<style type="text/css" >--%>
    <%--.x-message-box .ext-mb-loading {--%>
    <%--background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;--%>
    <%--height: 52px !important;--%>
    <%--}--%>
    <%--</style>--%>
    <script type="text/javascript">
        <%--Ext.Loader.setConfig({--%>
        <%--enabled: true,--%>
        <%--basePath: '<c:url value="/scripts/ext/src"/>',--%>
        <%--disableCaching: true--%>
        <%--}--%>
        <%--);--%>
        Ext.Loader.setPath({
            <%--'Docs':'<c:url value="/scripts/app"/>',--%>
            <%--'Ext.ux.desktop': '<c:url value="/scripts/desktop/js"/>',--%>
            <%--'Ext.ux': '<c:url value="/scripts/ux/Ext5/ux"/>',--%>
            <%--FlexCenter: '<c:url value="/scripts/ozstrategy"/>',--%>
            <%--Oz: '<c:url value="/scripts/ux/Oz"/>'--%>
        });
    </script>

</head>

<body>
<div id="loading"><span class="title">Ext JS 4.2.0 - Sencha Docs</span><span class="logo"></span></div>
<div id="header-content"><strong>Ext JS 4.2.0 </strong>Sencha Docs</div>
<div id="notice-text">Sencha Docs</div>
<div id="welcome-content"><strong>wolecome </strong>Sencha Docs</div>

<div id='footer-content' style='display: none'>Ext JS 4.2.0 Docs - Generated with <a href='https://github.com/senchalabs/jsduck'>JSDuck</a> 4.6.1. <a href='http://www.sencha.com/legal/terms-of-use/'>Terms of Use</a></div>
<script type="text/javascript">
    
//Ext.require('Docs.Application');
//Ext.require([
//    'FlexCenter.UserViewport',
//]);

Ext.onReady(function() {
    
    Ext.create('Ext.container.Viewport',{
        layout: 'border',
        items:[
            {
                region:'center',
                xtype:'panel',
                title:'34'
            }
        ]
    });
    
//    Ext.create('Docs.Application');
    
//    Ext.create('Ext.app.Application',{
//        name: "FlexCenter",
//        controllers: [
//        ],
//        launch: function(){
//            Ext.create('FlexCenter.UserViewport');
//            Ext.get("loading").remove();
//        }
//        
//    })
});
  



</script>

</body>
</html>