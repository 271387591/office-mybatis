package com.ozstrategy.service.userrole;


/**
 * An exception that is thrown by classes wanting to trap unique constraint violations. This is used to wrap Spring's
 * DataIntegrityViolationException so it's checked in the web layer.
 *
 * @author   <a href="mailto:matt@raibledesigns.com">Matt Raible</a>
 * @version  $Revision$, $Date$
 */
public class UserExistsException extends Exception {
  //~ Static fields/initializers ---------------------------------------------------------------------------------------

  private static final long serialVersionUID = 4050482305178810162L;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Constructor for UserExistsException.
   *
   * @param  message  exception message
   */
  public UserExistsException(final String message) {
    super(message);
  }
}
