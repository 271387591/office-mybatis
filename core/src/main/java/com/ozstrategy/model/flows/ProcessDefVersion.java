package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by lihao on 9/20/14.
 */
public class ProcessDefVersion extends BaseObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @Column
    private Long globalTypeId;
    @Column
    private String category;
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
    private Long flowFormId;
    @Column(columnDefinition = "TEXT")
    private String documentation;
    @Column
    private Boolean enabled=Boolean.TRUE;
    @Column
    private Long processDefId;

    public ProcessDefVersion() {
    }

    public ProcessDefVersion copy(ProcessDef def){
        this.name=def.getName();
        this.globalTypeId=def.getGlobalTypeId();
        this.category=def.getCategory();
        this.version= def.getVersion();
        this.actResId= def.getActResId();
        this.actDefId= def.getActDefId();
        this.graphResId= def.getGraphResId();
        this.modelId= def.getModelId();
        this.flowFormId= def.getFlowForm().getId();
        this.documentation= def.getDocumentation();
        this.enabled=def.getEnabled();
        this.processDefId=def.getId();
        return this;        
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

    public Long getGlobalTypeId() {
        return globalTypeId;
    }

    public void setGlobalTypeId(Long globalTypeId) {
        this.globalTypeId = globalTypeId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public Long getFlowFormId() {
        return flowFormId;
    }

    public void setFlowFormId(Long flowFormId) {
        this.flowFormId = flowFormId;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Long getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(Long processDefId) {
        this.processDefId = processDefId;
    }
}
