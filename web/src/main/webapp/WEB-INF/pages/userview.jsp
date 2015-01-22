<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <%--<title>Flex Center Desktop</title>--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="icon" type="image/x-icon" />--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="shortcut icon" type="image/x-icon" />--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/scripts/desktop/css/desktop.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
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


    <script type="text/javascript">
        extTheme = '<c:url value="/scripts/ext/resources/css/"/>';
        basePath = '<c:url value="/"/>';
    </script>

    <!-- Loads and initiaizes the library -->
    <%--<script type="text/javascript" src='<c:url value="/mxgraph/js/mxClient.js"/>'></script>--%>
    <%--<script type="text/javascript" src='<c:url value="/scripts/mxgraph/js/mxClient_debug.js"/>'></script>--%>

    <%--<script type="text/javascript">--%>
    <%--mxBasePath = '<c:url value="/scripts/mxgraph"/>';--%>
    <%--mxImageBasePath = '<c:url value="/scripts/mxgraph/images"/>';--%>
    <%--</script>--%>


    <script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>

    <%--<jwr:script src="/scripts/mxgraph/js/mxClient_debug.js"/>--%>
    <%--<jwr:script src="/bundles/desktop.js" />--%>

    <%--<c:choose>--%>
    <%--<c:when test="${fn:contains(header['User-Agent'],'MSIE 6') or fn:contains(header['User-Agent'],'MSIE 7')}">--%>
    <%--<jwr:style src="/bundles/IE67_desktop.css" />--%>
    <%--<jwr:style src="/bundles/IE67_lib${cookie.FlexCenter_Ext_Theme.value}.css" />--%>
    <%--<script type="text/javascript">--%>
    <%--function getExtThemePath(themeValue){--%>
    <%--return JAWR.loader.getCSSPath('/bundles/IE67_lib'+themeValue+".css")--%>
    <%--}--%>
    <%--</script>--%>
    <%--</c:when>--%>
    <%--<c:otherwise>--%>
    <%--<jwr:style src="/bundles/desktop.css" />--%>
    <%--<jwr:style src="/bundles/lib${cookie.FlexCenter_Ext_Theme.value}.css" />--%>
    <%--<script type="text/javascript">--%>
    <%--function getExtThemePath(themeValue){--%>
    <%--return JAWR.loader.getCSSPath('/bundles/lib'+themeValue+".css")--%>
    <%--}--%>
    <%--</script>--%>
    <%--</c:otherwise>--%>
    <%--</c:choose>--%>
    <style type="text/css" >
        .x-message-box .ext-mb-loading {
            background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
            height: 52px !important;
        }
    </style>

    <script type="text/javascript">
//        Ext.Ajax.on('requestcomplete',checkUserSessionStatus, this);
//        function checkUserSessionStatus(conn,response,options){
//            try{
//                //Ext重新封装了response对象
//                if(response.getAllResponseHeaders && response.getAllResponseHeaders().sessionstatus){
//                    setTimeout(function (){
//                        Ext.MessageBox.alert('失败','您的登录已超时，请重新登录',function (){
//                            isLogout = true;
//                            location.href = "login";
//                        });
//                    },500);
//                }
//            }catch(e){return true;}//这里防止部分程序使用response.getWriter().print的不一致
//        }
        var isLogout = false;
//        window.onbeforeunload = function () {
//            if(!isLogout)
//                return '您即将离开本页面，如有未保存的数据将会丢失，是否继续？';
//        };
        // Enable dynamic loading for improved debugging support
        Ext.Loader.setConfig({
                    enabled: true,
                    basePath: '<c:url value="/scripts/ext/src"/>',
                    disableCaching: true
                }
        );

        Ext.Loader.setPath({
            <%--'Ext.ux.desktop': '<c:url value="/scripts/desktop/js"/>',--%>
            'Ext.ux': '<c:url value="/scripts/ux/Ext/ux"/>',
            FlexCenter: '<c:url value="/scripts/ozstrategy"/>',
            Oz: '<c:url value="/scripts/ux/Oz"/>'
        });

    </script>
    <%--<jwr:script src="/ozExtComponets/flexcenter/global.js" />--%>

    <script type="text/javascript">
        var apps = {};
        Ext.require([
            'FlexCenter.Viewport',
            'Oz.util.Utils',
            'Ext.data.ArrayStore',
            'Ext.util.CSS'
        ]);

        var ozSOAViewport;

        var PortalItem=function(portalItemId,colNum,rowNum){
            this.portalItemId=portalItemId;
            this.colNum=colNum;
            this.rowNum=rowNum;
        };

        var ozSOA;
        Ext.onReady(function () {
            Ext.QuickTips.init();
            var storeTheme = getCookie('OzSOA-Ext-Theme');
            if (storeTheme == null || storeTheme == '') {
                storeTheme = 'ext-all';
            }
            Ext.util.CSS.swapStyleSheet("OzSOA-Ext-Theme", extTheme + storeTheme + ".css");
            if (!ozSOA) {
                ozSOA = new Ext.util.MixedCollection();
            }
            ozSOAViewport = new FlexCenter.Viewport();
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