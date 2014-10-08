package com.ozstrategy.model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;


/**
 * Base class for Model objects. Child objects should implement toString(), equals() and hashCode();
 *
 * <p><a href="BaseObject.java.html"><i>View Source</i></a></p>
 *
 * @author   <a href="mailto:matt@raibledesigns.com">Matt Raible</a>
 * @version  $Revision$, $Date$
 */
@MappedSuperclass
public abstract class BaseObject extends AbstractBaseObject implements Serializable {
  //~ Static fields/initializers ---------------------------------------------------------------------------------------

  private static final long serialVersionUID = -5137348947151932448L;
    @Column(
            name      = "createDate",
            nullable  = false,
            updatable = false
    )
    @Temporal(TemporalType.TIMESTAMP)
  protected Date createDate;

    @Column(name = "lastUpdateDate")
    @Temporal(TemporalType.TIMESTAMP)
  protected Date lastUpdateDate;

  // protected Integer version = 0;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Set createDate when new an object.
   */
  public BaseObject() {
    this.createDate     = new Date();
    this.lastUpdateDate = createDate;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /*
   * (non-Javadoc)
   *
   * @see java.lang.Object#equals(java.lang.Object)
   */
  @Override public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }

    if (obj == null) {
      return false;
    }

    if (getClass() != obj.getClass()) {
      return false;
    }

    final BaseObject other = (BaseObject) obj;

    if (this.createDate == null) {
      if (other.getCreateDate() != null) {
        return false;
      }
    } else if (!this.createDate.equals(other.getCreateDate())) {
      return false;
    }

    return true;
  } // end method equals

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  the createDate
   *
   * @hibernate.property
   *   not-null = "true"
   *   update   = "false"
   */
  public Date getCreateDate() {
    return createDate;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  // /**
  // * @return the version
  // * @hibernate.version
  // */
  // public Integer getVersion() {
  // return this.version;
  // }

  /**
   * DOCUMENT ME!
   *
   * @return  the lastUpdateDate
   *
   * @hibernate.property
   *   not-null = "false"
   */
  public Date getLastUpdateDate() {
    return lastUpdateDate;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /*
   * (non-Javadoc)
   *
   * @see java.lang.Object#hashCode()
   */
  @Override public int hashCode() {
    final int PRIME  = 31;
    int       result = 31;
    result = (PRIME * result)
      + ((this.createDate == null) ? 0 : this.createDate.hashCode());

    return result;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  createDate  the createDate to set
   */
  public void setCreateDate(Date createDate) {
    this.createDate = createDate;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  // /**
  // * @param version
  // * the version to set
  // */
  // public void setVersion(Integer version) {
  // this.version = version;
  // }

  /**
   * DOCUMENT ME!
   *
   * @param  lastUpdateDate  the lastUpdateDate to set
   */
  public void setLastUpdateDate(Date lastUpdateDate) {
    this.lastUpdateDate = lastUpdateDate;
  }

} // end class BaseObject
