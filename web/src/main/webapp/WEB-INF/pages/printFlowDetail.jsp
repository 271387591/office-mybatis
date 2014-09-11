<%--
  Created by IntelliJ IDEA.
  User: lihao
  Date: 11/14/13
  Time: 3:15 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<html>
<head>
    <style type="text/css">
        html, body {
            margin:0px;
            padding:0px;
            /*min-height:100%;*/
            /*font-family: 'Droid Sans', tahoma, "lucida sans", arial, sans-serif;*/
            /*font-size: 10px;*/
            /*line-height: 12px;*/
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
        /*table,th,td,{*/
            /*border:1px solid #F00*/
        /*}*/
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
    <title>${name}[打印执行情况]</title>
</head>
<body>
<div class="container"">
    <div class="header" style="height: 25px;text-align: right;width:100%;background-color: #11ebff">
        <input type="button" id="print" value="打印" style="margin-right: 20px;" onclick="doPrint()">
    </div>
    <!--startprint-->
    <div style="width: 95%;margin: 5px auto;">
        <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
            <tr>
                <th colspan="8">${name}</th>
            </tr>
            <tr>
                <th>序号</th>
                <th>任务名称</th>
                <th>执行人</th>
                <th>任务开始时间</th>
                <th>任务结束时间</th>
                <th>耗时(秒)</th>
                <th>状态</th>
                <th>审核意见</th>
            </tr>
            <c:forEach items="${data}" var="command" varStatus="status">
                <tr>
                    <td>${status.index+1}</td>
                    <td>${command.taskName}</td>
                    <td>${command.assigneeName}</td>
                    <td>${command.startTime}</td>
                    <td>${command.endTime}</td>
                    <td>${command.durationIn/1000}</td>
                    <td>
                        <c:choose>
                            <c:when test="${command.type==0}">
                                发起申请
                            </c:when>
                            <c:when test="${command.type==1}">
                                审核通过
                            </c:when>
                            <c:when test="${command.type==2}">
                                <font color="red">驳回</font>
                            </c:when>
                            <c:when test="${command.type==3}">
                                <font color="red">转办</font>
                            </c:when>
                            <c:when test="${command.type==4}">
                                追回
                            </c:when>
                            <c:when test="${command.type==5}">
                                会签任务
                            </c:when>
                            <c:when test="${command.type==6}">
                                结束
                            </c:when>
                        </c:choose>
                    </td>
                    <td>${command.objection}</td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </div>
    <!--endprint-->
</div>
</body>
</html>