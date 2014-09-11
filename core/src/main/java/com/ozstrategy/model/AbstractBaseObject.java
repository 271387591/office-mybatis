package com.ozstrategy.model;

/**
 * This class is used to store abstract base object.
 *
 * <p><a href="AbstractBaseObject.java.html"><i>View Source</i></a></p>
 *
 * @author   <a href="mailto:rojer@ozstrategy.com">Rojer Luo Jun</a>
 * @version  $Revision$, $Date$
 */
public abstract class AbstractBaseObject {
  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new AbstractBaseObject object.
   */
  public AbstractBaseObject() {
    super();
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * @see  Object#equals(Object)
   */
  @Override public abstract boolean equals(Object o);

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * @see  Object#hashCode()
   */
  @Override public abstract int hashCode();

} // end class AbstractBaseObject
