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
    
    

    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/editor.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext5.0/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css'/>"/>--%>
    
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/ExecDashboard-all.css'/>"/>--%>
    
    <%--<c:url var="grayExtTheme" value="/scripts/ext5.0/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css"/>--%>
    <%--<c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>--%>
    <%--<script type="text/javascript" src="<c:url value='/ext/ext-core.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext5.0/ext-all.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext5.0/bootstrap.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>--%>
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

    <%--<script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>--%>
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
        <%--Ext.Loader.setPath({--%>
            <%--&lt;%&ndash;'Ext.ux.desktop': '<c:url value="/scripts/desktop/js"/>',&ndash;%&gt;--%>
            <%--'Ext.ux': '<c:url value="/scripts/ux/Ext5/ux"/>',--%>
            <%--FlexCenter: '<c:url value="/scripts/ozstrategy"/>',--%>
            <%--&lt;%&ndash;Oz: '<c:url value="/scripts/ux/Oz"/>'&ndash;%&gt;--%>
        <%--});--%>
    </script>

</head>

<body>
<div id="content"></div>
<script type="text/javascript">
    PL._init();
    PL.joinListen('/system/pushlet');
    function onData(event) {
        console.log(event.get("publisher"));
    }



</script>

</body>
</html>