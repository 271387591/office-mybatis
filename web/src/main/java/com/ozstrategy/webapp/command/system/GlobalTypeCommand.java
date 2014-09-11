package com.ozstrategy.webapp.command.system;

import com.ozstrategy.model.system.GlobalType;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/4/13
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
public class GlobalTypeCommand {

    protected Long typeId;

    protected String typeName;

    protected String typeKey;

    protected String path;

    protected Integer depth;

    protected Long parentId;

    protected String catKey;

    protected String parentName;

    protected Integer priority;

    private Date createDate;

    private Set<GlobalTypeCommand> children = new HashSet<GlobalTypeCommand>();
    private Long id;
    private String text;
    private String iconCls;
    private boolean leaf;
    private Boolean expanded;

    public GlobalTypeCommand() {
    }

    public GlobalTypeCommand(Long typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }

    public GlobalTypeCommand(GlobalType type, Boolean required) {
        this.id = type.getTypeId();
        this.typeId = type.getTypeId();
        this.typeName = type.getTypeName();
        this.typeKey = type.getTypeKey();
        this.text = type.getTypeName();
        this.path = type.getPath();
        this.createDate = type.getCreateDate();
        this.depth = type.getDepth();
        this.parentId = type.getParent() != null ? type.getParent().getTypeId() : null;
        this.parentName = type.getParent() != null ? type.getParent().getTypeName() : null;
        this.catKey = type.getCatKey();
        this.priority = type.getPriority();

        this.iconCls = "";

        Set<GlobalType> children = type.getChildren();
        if (children != null && children.size() > 0) {
            this.leaf = false;
            if (required) {
                expanded = true;
            }
            for (GlobalType child : children) {
                this.children.add(new GlobalTypeCommand(child, required));
            }
        } else {
            this.leaf = true;
            expanded = false;
        }
    }

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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Set<GlobalTypeCommand> getChildren() {
        return children;
    }

    public void setChildren(Set<GlobalTypeCommand> children) {
        this.children = children;
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

    public boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public Boolean getExpanded() {
        return expanded;
    }

    public void setExpanded(Boolean expanded) {
        this.expanded = expanded;
    }

    public String getTypeKey() {
        return typeKey;
    }

    public void setTypeKey(String typeKey) {
        this.typeKey = typeKey;
    }
}
