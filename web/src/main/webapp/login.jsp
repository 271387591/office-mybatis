<%@ page language="java" errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Locale" %>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%
    String language = response.getLocale().toString();
    if ("en_US".equalsIgnoreCase(language)) {
        language = "en";
    }
    ServletContext servletContext = request.getSession().getServletContext();
    ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
//    String msg = ctx.getMessage("webapp.name",null,new Locale("en"));
//    out.print(msg);
%>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>office</title>
  <link href="styles/login.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="<c:url value='/scripts/lib/jquery-1.7.1.min.js'/>"></script>
  <%--<script type="text/javascript" src="<c:url value='/scripts/loginNewsScroll.js'/>"></script>--%>
  <script type="text/javascript">
      var appPath = "${appPath}";
    $(document).ready(function (e) {
      $('#j_username').bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
          $('#loginForm').submit();
        }
      });
      $('#j_password').bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
          $('#loginForm').submit();
        }
      });
      $("#j_username").focus();
    });
  </script>
</head>
<body id="login">
<div id="wrappertop"></div>
<div id="wrapper">
    <div id="content">
        <div id="header" style="padding: 0 0 0 0">
            <h1><a href=""><img src="images/oz-logo.png" style="margin-bottom: 5px;margin-top: 5px;" width="400" height="53" alt="Wudang"></a> </h1>
        </div>
        <div id="darkbanner" class="banner510">
            <h2>用户登陆</h2>
        </div>
        <div id="darkbannerwrap">
        </div>
        <form action="<c:url value='/j_security_check'/>" method="post" id="loginForm">
            <fieldset class="form">
                <p>
                    <label for="j_username">用户名</label>
                    <input type="text" name="j_username" id="j_username">
                </p>

                <p>
                    <label for="j_password">密码</label>
                    <input class="textInput" type="password" name="j_password" id="j_password">
                </p>
                <div style="float: left;margin: 8px 0 8px 70px">
                    <button type="submit" class="positive" onClick="$('#login').submit();">
                        <img src="images/key.png" alt="登陆">登陆
                    </button>
                    <button type="reset" class="positive" >
                        <img src="images/undo.png" alt="重置">重置
                    </button>
                </div>
                <c:if test="${param.error != null}">
                    <div style="float: left;width: 400px;height: 20px; font-size:13px;margin-left: 80px;padding: 15px 0 5px 0;color: red ">
                        用户名或密码错误
                    </div>
                </c:if>
            </fieldset>


        </form>
    </div>
</div>

<div id="wrapperbottom_branding">
    <div id="wrapperbottom_branding_text">
        <div style="padding: 5px 0 5px 0">
            <%--<span style="font-weight: bold;">注</span>:本系统仅完美支持Internet Explorer8.0及以上版本,Firefox,Google Chrome浏览器--%>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <%--<div><fmt:message key="copyright.info"/></div>--%>
        <%--<div><fmt:message key="contactInfo"/></div>--%>
    </div>
</div>
</body>
</html>