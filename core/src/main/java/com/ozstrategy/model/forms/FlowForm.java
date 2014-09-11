package com.ozstrategy.model.forms;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.CascadeType;
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
 * Created by lihao on 8/8/14.
 */
@Entity
public class FlowForm extends BaseObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @Column
    private String displayName;
    @Column
    private String description;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "char",length = 1)
    private Boolean  enabled=Boolean.TRUE;
    @ManyToOne
    @JoinColumn(name = "parentId",nullable = true)
    private FlowForm parent;
    @OneToMany(mappedBy = "parent",fetch = FetchType.LAZY)
    private Set<FlowForm> children=new HashSet<FlowForm>();
    @OneToMany(mappedBy ="flowForm" ,fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<FormField> fields=new HashSet<FormField>();

    public FlowForm() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public FlowForm getParent() {
        return parent;
    }

    public void setParent(FlowForm parent) {
        this.parent = parent;
    }

    public Set<FlowForm> getChildren() {
        return children;
    }

    public void setChildren(Set<FlowForm> children) {
        this.children = children;
    }

    public Set<FormField> getFields() {
        return fields;
    }

    public void setFields(Set<FormField> fields) {
        this.fields = fields;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        FlowForm flowForm = (FlowForm) o;
        return new EqualsBuilder()
                .append(id, flowForm.id)
                .append(name,flowForm.name)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .hashCode();

    }
}
