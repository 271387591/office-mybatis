package com.ozstrategy.webapp.command;

import com.ozstrategy.webapp.Constants;


/**
 * Created by IntelliJ IDEA. User: liaodongming Date: 11-11-22 Time: PM6:14 To change this template use File | Settings
 * | File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public abstract class ExtraResponseData {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  /** DOCUMENT ME! */
   protected String tag;

  /**
   * Constants.EXTRA_RESPONSE_DATA_TYPE_INFO Constants.EXTRA_RESPONSE_DATA_TYPE_WARN
   * Constants.EXTRA_RESPONSE_DATA_TYPE_EXCEPTION default : Constants.EXTRA_RESPONSE_DATA_TYPE_INFO
   */
   protected String type = Constants.EXTRA_RESPONSE_DATA_TYPE_INFO;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new ExtraResponseData object.
   */
  public ExtraResponseData() { }

  /**
   * Creates a new ExtraResponseData object.
   *
   * @param  type  DOCUMENT ME!
   * @param  tag   DOCUMENT ME!
   */
  public ExtraResponseData(String type, String tag) {
    this.type = type;
    this.tag  = tag;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
   public abstract String getNamespace();

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public String getTag() {
    return tag;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public String getType() {
    return type;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  tag  DOCUMENT ME!
   */
  public void setTag(String tag) {
    this.tag = tag;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  type  DOCUMENT ME!
   */
  public void setType(String type) {
    this.type = type;
  }
} // end class ExtraResponseData
