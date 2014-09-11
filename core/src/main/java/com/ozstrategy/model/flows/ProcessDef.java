package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import com.ozstrategy.model.system.GlobalType;

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
 * Created by lihao on 9/9/14.
 */
@Entity
public class ProcessDef extends BaseObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @ManyToOne
    @JoinColumn(name = "globalTypeId")
    private GlobalType globalType;
    @Column
    private Integer version;
    @Column
    private String actDefId;
    @Column
    private String actResId;
    @Column
    private String graphResId;
    @Column
    private String modelId;
    @Column
    private String depId;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column
    private Boolean enabled=Boolean.TRUE;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processDef")
    private Set<ProcessElement> elements=new HashSet<ProcessElement>();
    @ManyToOne
    @JoinColumn(name = "parentId",nullable = true)
    private ProcessDef parent;
    @OneToMany(mappedBy = "parent",fetch = FetchType.LAZY)
    private Set<ProcessDef> children=new HashSet<ProcessDef>();

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

    public GlobalType getGlobalType() {
        return globalType;
    }

    public void setGlobalType(GlobalType globalType) {
        this.globalType = globalType;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getActDefId() {
        return actDefId;
    }

    public void setActDefId(String actDefId) {
        this.actDefId = actDefId;
    }

    public String getActResId() {
        return actResId;
    }

    public void setActResId(String actResId) {
        this.actResId = actResId;
    }

    public String getGraphResId() {
        return graphResId;
    }

    public void setGraphResId(String graphResId) {
        this.graphResId = graphResId;
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public Set<ProcessElement> getElements() {
        return elements;
    }

    public void setElements(Set<ProcessElement> elements) {
        this.elements = elements;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getDepId() {
        return depId;
    }

    public void setDepId(String depId) {
        this.depId = depId;
    }

    public ProcessDef getParent() {
        return parent;
    }

    public void setParent(ProcessDef parent) {
        this.parent = parent;
    }

    public Set<ProcessDef> getChildren() {
        return children;
    }

    public void setChildren(Set<ProcessDef> children) {
        this.children = children;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
