package com.ozstrategy.webapp.command;

import java.util.HashMap;
import java.util.Map;


/**
 * DOCUMENT ME!
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class BaseResultCommand {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  /** Result data. */
   protected Object data = null;

  /** DOCUMENT ME! */
   protected ExtraResponseData extraResData;

  /** Error message. */
   protected String message;

  /** Result success. */
   protected Boolean success = Boolean.TRUE;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new BaseResultCommand object.
   *
   * @param  data  DOCUMENT ME!
   */
  public BaseResultCommand(Object data) {
    this.data = data;
  }

  /**
   * Creates a new BaseResultCommand object.
   *
   * @param  data  DOCUMENT ME!
   */
  public BaseResultCommand(ExtraResponseData data) {
    this.message      = "";
    this.success      = true;
    this.extraResData = data;
  }

  /**
   * Creates a new BaseResultCommand object.
   *
   * @param  message  DOCUMENT ME!
   * @param  success  DOCUMENT ME!
   */
  public BaseResultCommand(String message, Boolean success) {
    this.message = message;

    this.success = success;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  name   DOCUMENT ME!
   * @param  error  DOCUMENT ME!
   */
  public void addError(String name, String error) {
    this.success = false;

    if ((data == null) || (!(data instanceof Map))) {
      data = new HashMap<String, String>();
    }

    Map    map      = (Map) data;
    String curError = (String) map.get(name);

    if ((curError == null) || (curError.length() == 0)) {
      map.put(name, error);
    } else {
      curError += "|" + error;
      map.put(name, curError);
    }
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   data  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public BaseResultCommand addExtraResponseData(ExtraResponseData data) {
    this.extraResData = data;

    return this;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * Get result data.
   *
   * @return  result data
   */
  public Object getData() {
    return data;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public ExtraResponseData getExtraResData() {
    return extraResData;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * Get Message.
   *
   * @return  return message
   */
  public String getMessage() {
    return message;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  data  DOCUMENT ME!
   */
  public void setData(Object data) {
    this.data = data;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  extraResData  DOCUMENT ME!
   */
  public void setExtraResData(ExtraResponseData extraResData) {
    this.extraResData = extraResData;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  message  DOCUMENT ME!
   */
  public void setMessage(String message) {
    this.message = message;
  }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
} // end class BaseResultCommand
