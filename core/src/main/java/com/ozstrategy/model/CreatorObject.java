package com.ozstrategy.model;

import com.ozstrategy.model.userrole.User;


/**
 * This class is used to store object creator and last updater information.
 *
 * <p><a href="BaseRule.java.html"><i>View Source</i></a></p>
 *
 * @author   <a href="mailto:rojer@ozstrategy.com">Rojer Luo Jun</a>
 * @version  $Revision$, $Date$
 */
public abstract class CreatorObject extends BaseObject {
  //~ Static fields/initializers ---------------------------------------------------------------------------------------

  private static final long serialVersionUID = 579757832122255158L;

  
  protected User creator;

  
  protected User lastUpdater;

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public User getCreator() {
    return creator;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public User getLastUpdater() {
    return lastUpdater;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  creator  DOCUMENT ME!
   */
  public void setCreator(User creator) {
    this.creator = creator;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  lastUpdater  DOCUMENT ME!
   */
  public void setLastUpdater(User lastUpdater) {
    this.lastUpdater = lastUpdater;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   */
  @Override public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("CreatorObject");
    sb.append("{creator=").append(creator);
    sb.append(", lastUpdater=").append(lastUpdater);
    sb.append('}');

    return sb.toString();
  }
} // end class CreatorObject
