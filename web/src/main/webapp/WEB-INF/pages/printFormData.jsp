<%--
  Created by IntelliJ IDEA.
  User: lihao
  Date: 11/15/13
  Time: 10:43 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<html>
<head>
    <style type="text/css">
        html, body {
            margin:0 auto;
            padding:0;
            background: #ffffff;
        }
        tr,th,td{
            font-size: 16px;
            border: 1px solid blue;
            font-family: 'Droid Sans', tahoma, "lucida sans", arial, sans-serif;
            line-height: 26px;
        }
        table{
            border-collapse:collapse;
            border:1px solid blue;
            margin: 0px auto;
            width: 80%;
        }
    </style>
    <script language=javascript>
        function doPrint() {
            bdhtml=window.document.body.innerHTML;
            sprnstr='<!--startprint-->';
            eprnstr='<!--endprint-->';
            prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
            prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
            window.document.body.innerHTML=prnhtml;
            window.print();
        }
    </script>
    <title>${name}[打印表单数据]</title>
</head>

<body>
<div>
    <div class="header" style="height: 25px;text-align: right;width:100%;background-color: #11ebff">
        <input type="button" id="print" value="打印" style="margin-right: 20px;" onclick="doPrint()">
    </div>
    <!--startprint-->
    <div style="width: 95%;margin: 5px auto;" id="content">
        ${data.content}
    </div>
    <!--endprint-->
</div>
</body>
</html>