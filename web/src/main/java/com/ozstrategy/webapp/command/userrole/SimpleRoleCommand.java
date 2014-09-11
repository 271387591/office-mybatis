package com.ozstrategy.webapp.command.userrole;

import com.ozstrategy.model.userrole.Role;


/**
 * Created by IntelliJ IDEA. User: liaodongming Date: 12-2-15 Time: PM12:29 To change this template use File | Settings
 * | File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class SimpleRoleCommand {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  /** DOCUMENT ME! */
  protected String displayName;

  /** DOCUMENT ME! */
  protected Long id;

  //
  // protected Date lastUpdateDate;
  /** DOCUMENT ME! */
  protected String name;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new SimpleRoleCommand object.
   */
  public SimpleRoleCommand() { }


  /**
   * Creates a new SimpleRoleCommand object.
   *
   * @param  role  DOCUMENT ME!
   */
  public SimpleRoleCommand(Role role) {
    this.id          = role.getId();
    this.name        = role.getName();
    this.displayName = role.getDisplayName();

  } // end  SimpleRoleCommand

  /**
   * Creates a new SimpleRoleCommand object.
   *
   * @param  name  DOCUMENT ME!
   * @param  id    DOCUMENT ME!
   */
  public SimpleRoleCommand(String name, Long id) {
    this.id   = id;
    this.name = name;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public String getDisplayName() {
    return displayName;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public Long getId() {
    return id;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public String getName() {
    return name;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  displayName  DOCUMENT ME!
   */
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  id  DOCUMENT ME!
   */
  public void setId(Long id) {
    this.id = id;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  name  DOCUMENT ME!
   */
  public void setName(String name) {
    this.name = name;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public Role toRole() {
    Role role = new Role();
    role.setId(this.id);
    role.setName(this.name);
    // role.setOrganizationRole(this.organizationRole);

    return role;
  }
} // end class SimpleRoleCommand
