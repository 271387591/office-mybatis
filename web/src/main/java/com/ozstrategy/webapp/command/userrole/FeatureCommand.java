package com.ozstrategy.webapp.command.userrole;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Date;


/**
 * Created by IntelliJ IDEA. User: rojer Date: Apr 1, 2010 Time: 11:33:30 AM To change this template use File | Settings
 * | File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class FeatureCommand {
  //~ Static fields/initializers ---------------------------------------------------------------------------------------

  /** DOCUMENT ME! */
  protected static final transient Log log = LogFactory.getLog(
      FeatureCommand.class);

  /** DOCUMENT ME! */
  protected Date createDate;


  /** DOCUMENT ME! */
  protected String description;

  /** DOCUMENT ME! */
  protected String displayName;

  /** DOCUMENT ME! */
  protected String name;

  /** DOCUMENT ME! */
  protected Long id;

  /** DOCUMENT ME! */
  protected Date lastUpdateDate;
    private String criteria;



  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new FeatureCommand object.
   */
  public FeatureCommand() { }

  /**
   * Creates a new FeatureCommand object.
   *
   * @param  roleFeature  DOCUMENT ME!
   */
  public FeatureCommand(RoleFeature roleFeature) {
    this(roleFeature.getFeature(), "");
  }

  /**
   * Creates a new FeatureCommand object.
   *
   * @param  feature  DOCUMENT ME!
   */
  public FeatureCommand(Feature feature) {
    id             = feature.getId();
    description    = feature.getDescription();
    displayName    = feature.getDisplayName();
    createDate     = feature.getCreateDate();
    lastUpdateDate = feature.getLastUpdateDate();
      this.name=feature.getName();
      this.criteria= feature.getCriteria();
  }

  /**
   * Creates a new FeatureCommand object.
   *
   * @param  feature   DOCUMENT ME!
   * @param  criteria  DOCUMENT ME!
   */
  public FeatureCommand(Feature feature, String criteria) {
    this(feature);
  }

    public static Log getLog() {
        return log;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getLastUpdateDate() {
        return lastUpdateDate;
    }

    public void setLastUpdateDate(Date lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
    }

    public Feature toFeature() {
    Feature feature = new Feature();
    feature.setId(id);
    feature.setDisplayName(displayName);
    feature.setDescription(description);
      feature.setName(name);

    return feature;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   role  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public RoleFeature toRoleFeature(Role role) {
    Feature     feature     = toFeature();
    RoleFeature roleFeature = new RoleFeature();
    roleFeature.setFeature(feature);
    roleFeature.setRole(role);

    return roleFeature;
  }

    public String getCriteria() {
        return criteria;
    }

    public void setCriteria(String criteria) {
        this.criteria = criteria;
    }
} // end class FeatureCommand
