package com.ozstrategy.webapp.command.userrole;


import com.ozstrategy.model.userrole.Role;

/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 13-9-29
 * Time: am 10:41
 * To change this template use File | Settings | File Templates.
 */
public class RoleTreeCommand {

  private Long id;
  private String text;
  private String iconCls;
  private Boolean leaf = true;
  private Boolean expanded = false;

  public RoleTreeCommand() {

  }

  public RoleTreeCommand(Role role) {
    this.id = role.getId();
    this.text = role.getDisplayName();
    this.iconCls = "";

  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getIconCls() {
    return iconCls;
  }

  public void setIconCls(String iconCls) {
    this.iconCls = iconCls;
  }

  public Boolean getLeaf() {
    return leaf;
  }

  public void setLeaf(Boolean leaf) {
    this.leaf = leaf;
  }

  public Boolean getExpanded() {
    return expanded;
  }

  public void setExpanded(Boolean expanded) {
    this.expanded = expanded;
  }
}
