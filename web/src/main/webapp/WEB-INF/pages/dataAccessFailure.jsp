<%@ include file="/common/taglibs.jsp" %>

<title>Data Access Error</title>
<head>
    <meta name="heading" content="Data Access Failure"/>
    <meta name="menu" content="AdminMenu"/>
</head>

<p>
    <c:out value="${requestScope.exception.message}"/>
</p>

<!--
<% 
((Exception) request.getAttribute("exception")).printStackTrace(new java.io.PrintWriter(out));  
%>
-->

<a href="mainMenu" onclick="history.back();return false">&#171; Back</a>
<div class="doctab overview classes">
    <div class="l"></div>
    <div class="m">
        <a class="tabUrl ov-tab" href="#">&nbsp;</a>
    </div>
    <div class="r"></div>
</div> 
<div class = "doctab overview classes" > 
    <div class="l"></div> 
    <div class = "m" > <a class="tabUrl ov-tab" href="#!/api">&nbsp;</a> </div>
    <div class="r"></div >
</div>
<div class="doctab overview videos">
    <div class="l"></div>
    <div class="m">
        <a class="tabUrl ov-tab" href="#!/video">&nbsp;</a>
    </div>
    <div class="r"></div>
</div>
<div style="float: left; width: 8px">&nbsp;</div>
<div class="tab-overflow"></div>




<div class="doctab overview classes">
    <div class="l"></div>
    <div class="m"><a class="tabUrl ov-tab" href="#">&nbsp;</a></div>
    <div class="r"></div>
</div>
<div class="doctab overview classes">
    <div class="l"></div>
    <div class="m"><a class="tabUrl ov-tab" href="#">&nbsp;</a></div>
    <div class="r"></div>
</div>
<div style="float: left; width: 8px">&nbsp;</div>
<div class="tab-overflow"></div> 
