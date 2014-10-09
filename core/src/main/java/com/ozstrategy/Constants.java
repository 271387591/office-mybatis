package com.ozstrategy;


/**
 * Constant values used throughout the application.
 *
 * @author   <a href="mailto:matt@raibledesigns.com">Matt Raible</a>
 * @version  $Revision$, $Date$
 */
public interface Constants {
  //~ Static fields/initializers ---------------------------------------------------------------------------------------

  /** The name of the ResourceBundle used in this application. */
  public static final String BUNDLE_KEY = "ApplicationResources";

  /** File separator from System properties. */
  public static final String FILE_SEP = System.getProperty("file.separator");

  /** User home from System properties. */
  public static final String USER_HOME = System.getProperty("user.home") + FILE_SEP;

  /** The name of the configuration hashmap stored in application scope. */
  public static final String CONFIG = "appConfig";

  /**
   * Session scope attribute that holds the locale set by the user. By setting this key to the same one that Struts
   * uses, we get synchronization in Struts w/o having to do extra work or have two session-level variables.
   */
  public static final String PREFERRED_LOCALE_KEY = "org.apache.struts2.action.LOCALE";

  /** The request scope attribute under which an editable user form is stored. */
  public static final String USER_KEY = "userForm";

  /** The request scope attribute that holds the user list. */
  public static final String USER_LIST = "userList";

  /** The request scope attribute for indicating a newly-registered user. */
  public static final String REGISTERED = "registered";

  /** The name of the Administrator role, as specified in web.xml. */
  public static final String ADMIN_ROLE = "ROLE_ADMIN";

  /** The name of the User role, as specified in web.xml. */
  public static final String USER_ROLE = "ROLE_USER";

  /** The name of the user's role list, a request-scoped attribute when adding/editing a user. */
  public static final String USER_ROLES = "userRoles";

  /** The name of the available roles list, a request-scoped attribute when adding/editing a user. */
  public static final String AVAILABLE_ROLES = "availableRoles";

  /** The name of the CSS Theme setting. */
  public static final String CSS_THEME = "csstheme";

  /** DOCUMENT ME! */
  public static final String JdbcDriver_mysql = "com.mysql.jdbc.Driver";

  /** DOCUMENT ME! */
  public static final String JdbcUrl_mysql = "jdbc:mysql://{0}:{1}/{2}?useUnicode=true&characterEncoding=utf-8";


  /** DOCUMENT ME! */
  public static final String JdbcDriver_oracle = "oracle.jdbc.driver.OracleDriver";

  /** DOCUMENT ME! */
  public static final String JdbcUrl_oralce = "jdbc:oracle:thin:@{0}:{1}:{2}";

    public static final String MESSAGE_PROCESS_SAVE_USER = "message.error.save.process.fail";
    public static final String MESSAGE_PROCESS_DEPLOYED_NULL = "message.error.deployed.null";
    public static final String MESSAGE_PROCESS_DEPLOYED_PROCESS_NOT_FOUND = "message.error.process.not.found";
    public static final String MESSAGE_FORM_READ_HTML_FIELD = "message.form.read.html.field";
    public static final String MESSAGE_FORM_SAVE_FIELD = "message.form.save.field";
    public static final String MESSAGE_START_PROCESS_FAIL = "message.start.process.fail";

    public static final String TASK_SIGN_NAME = "Sign_";
    public static final String TASK_SIGN_subType = "subType";
    public static final String TASK_SIGN_signType = "signType";
    public static final String TASK_SIGN_objection = "objection";
    public static final String TASK_SIGN_AGREECOUNT = "taskSignAgreeCounter";
    public static final String TASK_SIGN_perTotal = "perTotal";
    public static final String TASK_SIGN_personTotal = "personTotal";
    public static final String TASK_SIGN_nrOfActiveInstances = "nrOfActiveInstances";
    public static final String TASK_SIGN_nrOfInstances = "nrOfInstances";
    public static final String TASK_SIGN_ASSIGNEE = "signAssignee";
    public static final String TASK_SIGN_ASSIGNEE_Expression = "${signAssignee}";
    public static final String TASK_SIGN_TYPE_Expression = "${multiInstanceLoopService.canComplete(execution, subType,signType, nrOfInstances, nrOfActiveInstances, nrOfCompletedInstances, loopCounter)}";
    public static final String TASK_USER_NAME = "Task_";
    public static final String TASK_FORM_KEY = ".form";
    public static final String FLOW_Decision = "Decision_";
    public static final String FLOW_edge = "edge_";

    public static final String TASK_USER_TYPE = "userTask";
    public static final String START_EVENT_TYPE = "startEvent";
    public static final String START_EVENT_NAME = "Start_";
    public static final String START_Initiator = "userId";
    public static final String START_Initiator_Expression = "${userId}";
    public static final String END_EVENT_TYPE = "endEvent";
    public static final String END_EVENT_NAME = "End_";
    public static final String MODEL_FORM_ID = "formId";
    public static final String MODEL_FORM_NAME = "formName";
    public static final String MODEL_FORM_KEY = "formkey";
    public static final String MODEL_BPMN = ".bpmn";
    public static final String Flow_FileAttach_Name = "Flow_FileAttach_Name";
    public static final String Flow_Email_Name = "Flow_Email_Name";
    public static final String MAIL_TEMP_ATTACH = "mailTemp/";
    public static final String GRAPH_xmlns_CONVER = "exam";

} // end class Constants
