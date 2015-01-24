package com.ozstrategy.model.system;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 15/7/13
 * Time: 1:50 下午
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class GlobalType extends BaseObject {

  @GeneratedValue(strategy = GenerationType.AUTO)
  @Id
  protected Long typeId;
    
  @Column
  protected String typeName;
  @Column
  protected String typeKey;
  @Column
  protected String path;
  @Column
  protected Integer depth;

  @JoinColumn(
      name    = "parentId"
  )
  @ManyToOne
  protected GlobalType parent;
  @Column
  protected String catKey;

  @Column
  protected Integer priority;

  @Column
  protected Boolean enabled = true;

  @OneToMany(mappedBy = "parent",fetch = FetchType.EAGER)
  private Set<GlobalType> children = new HashSet<GlobalType>();

  public Long getTypeId() {
    return typeId;
  }

  public void setTypeId(Long typeId) {
    this.typeId = typeId;
  }

  public String getTypeName() {
    return typeName;
  }

  public void setTypeName(String typeName) {
    this.typeName = typeName;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Integer getDepth() {
    return depth;
  }

  public void setDepth(Integer depth) {
    this.depth = depth;
  }

  public GlobalType getParent() {
    return parent;
  }

  public void setParent(GlobalType parent) {
    this.parent = parent;
  }

  public String getCatKey() {
    return catKey;
  }

  public void setCatKey(String catKey) {
    this.catKey = catKey;
  }

  public Integer getPriority() {
    return priority;
  }

  public void setPriority(Integer priority) {
    this.priority = priority;
  }

  public Boolean getEnabled() {
    return enabled;
  }

  public void setEnabled(Boolean enabled) {
    this.enabled = enabled;
  }

//  public int hashCode() {
//    return new HashCodeBuilder(-82280557, -700257973)
//        .append(this.typeId)
//        .append(this.typeName)
//        .append(this.path)
//        .append(this.depth)
//        .append(this.catKey)
//        .append(this.priority)
//        .toHashCode();
//  }
//
//  public String toString() {
//    return new ToStringBuilder(this)
//        .append("typeId", this.typeId)
//        .append("typeName", this.typeName)
//        .append("path", this.path)
//        .append("depth", this.depth)
//        .append("catKey", this.catKey)
//        .append("priority", this.priority)
//        .toString();
//  }

  public Set<GlobalType> getChildren() {
    return children;
  }

  public void setChildren(Set<GlobalType> children) {
    this.children = children;
  }

  public String getTypeKey() {
    return typeKey;
  }

  public void setTypeKey(String typeKey) {
    this.typeKey = typeKey;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;

    GlobalType that = (GlobalType) o;

    return new EqualsBuilder()
            .append(typeId, that.typeId)
            .append(typeName, that.typeName)
            .append(typeKey,that.typeKey)
            .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder()
            .append(typeId)
            .append(typeName)
            .append(typeKey)
            .hashCode();
  }
}
