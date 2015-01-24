<%@ page language="java" errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%
    String language = response.getLocale().toString();
    if ("en_US".equalsIgnoreCase(language)) {
        language = "en";
    }
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title><fmt:message key="webapp.name"/></title>
    <c:set var="language"><%=language %></c:set>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/desktop/css/desktop.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/growl/css/ext-growl.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/login/css/login.css'/>"/>
    <c:url var="defaultExtTheme" value="/scripts/ext/resources/css/ext-all.css"/>
    <c:url var="grayExtTheme" value="/scripts/ext/resources/css/ext-all-gray.css"/>
    <c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-${language}.js'/>"></script>
    <script type="text/javascript">
        var appPath = "${appPath}";
        loginError = '';
        <c:if test="${not empty param.error}">
        <c:if test="${not empty param.reason}">
        loginError = '<fmt:message key="errors.reason.${param.reason}" />';
        </c:if>
        <c:if test="${empty param.reason}">
        loginError = '<fmt:message key="errors.password.mismatch" />';
        </c:if>
        </c:if>
        var loginRes = {
            formAction: '<c:url value="/j_security_check"/>',
            appsName: '<fmt:message key="webapp.name" />',
            title: '<fmt:message key="login.title" />',
            username: '<fmt:message key="login.username" />',
            password: '<fmt:message key="login.password" />',
            login: '<fmt:message key="button.login" />',
            reset: '<fmt:message key="globalRes.buttons.reset" />',
            errorTitle: '<fmt:message key="login.title.error" />',
            error: '<fmt:message key="errors.password.mismatch" />',
            loginMsg: '<fmt:message key="login.loginMsg" />',
            picture: '<div class="product-logo"></div>'
        };
    </script>
    <script type="text/javascript" src="<c:url value='/scripts/lib/login.js'/>"></script>
</head>
<body id="login">
<script type="text/javascript">
    if (!Ext.isIE) {
        var str = '<div id="mask" style="width:100%;height:100%;background:#E5E5E5;position:absolute;z-index:20000;left:0;top:0;">&#160;</div>'
                + '<div id="loading">'
                + '<div class="loading-indicator">'
                + '<fmt:message key="login.loading"/>'
                + '</div>'
                + '</div>'
                + '<div id="login-dlg"></div>';
        document.writeln(str);
    }
</script>

<script type="text/javascript" >
    Ext.Loader.setConfig({enabled: true});
    Ext.Loader.setPath('Oz', '<c:url value="/scripts/login"/>');
    Ext.onReady(function() {
        Ext.BLANK_IMAGE_URL = '<c:url value="/scripts/desktop/images/s.gif"/>';
        if (Ext.isIE) {
            Ext.create('Oz.LoginWindow', {
                loginError: loginError
            }).show();
        }
        else {
            var loading = Ext.get('loading');
            mask = Ext.get("mask");
            mask.setOpacity('0.8');
            mask.setBounds(loading.getX(), loading.getY(), loading.getWidth(), loading.getHeight(), {
                remove: true,
                duration: 500,
                opacity: '0.3',
                easing: 'bounceOut',
                callback: function(){
                    loading.fadeOut({
                        duration: 300,
                        remove: true,
                        callback: function(){
                            Ext.create('Oz.LoginWindow', {
                                loginError: loginError
                            }).show();
                        }
                    });
                }
            });
        }
    });
</script>
</body>
</html>