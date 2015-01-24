package com.ozstrategy;

public interface Constants {
    public static final String ADMIN_ROLE = "ROLE_ADMIN";
    public static final String JdbcDriver_mysql = "com.mysql.jdbc.Driver";
    public static final String JdbcUrl_mysql = "jdbc:mysql://{0}:{1}/{2}?useUnicode=true&characterEncoding=utf-8";
    public static final String JdbcDriver_oracle = "oracle.jdbc.driver.OracleDriver";
    public static final String JdbcUrl_oralce = "jdbc:oracle:thin:@{0}:{1}:{2}";
    public static final String MESSAGE_PROCESS_DEPLOYED_NULL = "message.error.resource.fail";
    public static final String MESSAGE_PROCESS_DEPLOYED_PROCESS_NOT_FOUND = "message.error.process.not.found";
    public static final String MESSAGE_PROCESS_DEPLOYED_PROCESS_START_NODE_HAS_ONE_MORE_TASK = "message.error.process.start.node.has.one.more.task";
    public static final String MESSAGE_START_PROCESS_FAIL = "message.processDefController.startProcessFail";
    public static final String MESSAGE_START_PROCESS_NOT_FOUND_START_TASK = "message.start.process.not.found.start.task";
    public static final String MESSAGE_RETURN_TASK_FAIL = "message.processDefController.returnTask";
    public static final String MESSAGE_REPLEVY_TASK_FAIL = "message.processDefController.replevyTask";
    public static final String MESSAGE_COMPLETE_TASK_NOT_FOUND_TASK = "message.complete.task.not.found.task";
    public static final String TASK_USER_TYPE = "userTask";
    public static final String END_EVENT_TYPE = "endEvent";
    public static final String START_EVENT_TYPE = "startEvent";
} 
