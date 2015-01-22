<%@ include file="/common/taglibs.jsp"%>
var globalRes = {
  logoutUrl: '<c:url value="/logout"/>',
  userName: '${command.username}',
  userFullName: '${command.fullName}',
  userId: '${command.id}',
  isAdmin : '${command.admin}',
  features: '${command.features}',
  title:{
    resetLocale: '<fmt:message key="globalRes.title.resetLocale" />',
    logout: '<fmt:message key="globalRes.title.logout" />',
    prompt: '<fmt:message key="globalRes.title.prompt" />',
success: '<fmt:message key="globalRes.title.success" />',
warning: '<fmt:message key="globalRes.title.warning" />',
    fail: '<fmt:message key="globalRes.title.fail" />'
  },
  header:{
    createDate: '<fmt:message key="globalRes.header.createDate" />',
man: '<fmt:message key="globalRes.header.man" />',
woman: '<fmt:message key="globalRes.header.woman" />',
    lastUpdateDate: '<fmt:message key="globalRes.header.lastUpdateDate" />'
  },


  buttons: {
    back: '<fmt:message key="globalRes.buttons.back" />',
    add: '<fmt:message key="globalRes.buttons.add" />',
    duplicate: '<fmt:message key="globalRes.buttons.duplicate" />',
    edit: '<fmt:message key="globalRes.buttons.edit" />',
    del: '<fmt:message key="globalRes.buttons.delete" />',
    remove: '<fmt:message key="globalRes.buttons.remove" />',
    update: '<fmt:message key="globalRes.buttons.update" />',
    save: '<fmt:message key="globalRes.buttons.save" />',
    refresh: '<fmt:message key="globalRes.buttons.refresh" />',
    ok: '<fmt:message key="globalRes.buttons.ok" />',
    cancel: '<fmt:message key="globalRes.buttons.cancel" />',
    submit: '<fmt:message key="globalRes.buttons.submit" />',
    reset: '<fmt:message key="globalRes.buttons.reset" />',
    start: '<fmt:message key="globalRes.buttons.start" />',
search: '<fmt:message key="globalRes.buttons.search" />',
clear: '<fmt:message key="globalRes.buttons.clear" />',
lookFor: '<fmt:message key="globalRes.buttons.lookFor" />',
managerBtn: '<fmt:message key="globalRes.buttons.managerBtn" />',
    close: '<fmt:message key="globalRes.buttons.close" />'
  },
  msg: {
    resetLocaleFail: '<fmt:message key="globalRes.resetLocale.error" />',
    logout: '<fmt:message key="globalRes.logout.msg" />',
    logoutTimeout: '<fmt:message key="globalRes.logoutTimeOut.msg" />'
  },
  tooltip: {
    moveToRight: '<fmt:message key="globalRes.tooltip.moveToRight" />',
    moveAllToRight: '<fmt:message key="globalRes.tooltip.moveAllToRight" />',
    moveToLeft: '<fmt:message key="globalRes.tooltip.moveToLeft" />',
    moveAllToLeft: '<fmt:message key="globalRes.tooltip.moveAllToLeft" />',
    notEmpty: '<fmt:message key="globalRes.tooltip.notEmpty" />'
  },

  yes: '<fmt:message key="globalRes.yes" />',
  no: '<fmt:message key="globalRes.no" />',

  error: {
    notBalanced: '<fmt:message key="globalRes.error.notBalanced" />'
  },
  changeBackground: '<fmt:message key="globalRes.changeBackground" />',
  uxImageUrl: '<c:url value="/styles/default/images"/>',
  remoteException: '<fmt:message key="globalRes.remoteException" />',
  remoteTimeout: '<fmt:message key="globalRes.remoteTimeout" />',
startingDetail: '<fmt:message key="globalRes.startingDetail" />',
copyrightInfo: '<fmt:message key="globalRes.copyrightInfo" />',
instructions: '<fmt:message key="globalRes.instructions" />',
  logout_msg: '<fmt:message key="globalRes.logout.msg" />'
};

var accessRes = {
<c:forEach var="feature" items="${command.features}" varStatus="status">
    ${feature}: true<c:if test="${!status.last}">,</c:if>
</c:forEach>
};
