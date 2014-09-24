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

    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/common.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/explorer.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/ux/Ext/ux/growl/css/ext-growl.css'/>"/>--%>

    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/growl/css/ext-growl.css'/>"/>

    <c:url var="defaultExtTheme" value="/scripts/ext/resources/css/ext-all.css"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/editor.css'/>"/>
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
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxClient.js"/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxModeler.js"/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/js/mxApplication.js"/>"></script>--%>

    <script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>
    <style type="text/css" >
        .x-message-box .ext-mb-loading {
            background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
            height: 52px !important;
        }
    </style>
    <script type="text/javascript">
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

</head>

<body>
<textarea id="editorArea">
</textarea>
<script type="text/javascript">
    
    
    CKEDITOR.replace( 'editorArea', { 
        height: 100,
            language : 'zh-cn',
            extraPlugins : 'dforms,sourcearea',
        toolbar :
            [
                [ 'Source','-','Print', 'ShowBlocks'],
//                [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ],
//                [ 'Find','Replace','-','SelectAll','-', 'Scayt' ],
                ['HiddenField','Select','TextField','Textarea','BoxGroup','DateField','Grid','UserSelector','DepSelector','PosSelector','DSelect'],
//                ['ImageButton', '-','Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe','-','Link','Unlink','Anchor' ],
//                [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
//                [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
//                [ 'Styles','Format','Font','FontSize' ],
//                [ 'TextColor','BGColor' ]
            ]
    } );
    
</script>

</body>
</html>