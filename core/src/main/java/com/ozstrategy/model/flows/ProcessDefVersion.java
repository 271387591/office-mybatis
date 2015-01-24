package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * Created by lihao on 9/20/14.
 */
@Entity
@Table(name = "PROECESSDEFVERSION",indexes = {
        @Index(columnList = "globalTypeId"),
        @Index(columnList = "processDefId")
})
public class ProcessDefVersion extends BaseObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 128,nullable = true)
    private String name;
    @Column(nullable = true)
    private Long globalTypeId;
    @Column(nullable = true,length = 128)
    private String category;
    @Column(nullable = true,length = 4)
    private Integer version;
    @Column(nullable = true,length = 64)
    private String actDefId;
    @Column(nullable = true,length = 64)
    private String actResId;
    @Column(nullable = true,length = 64)
    private String graphResId;
    @Column(nullable = true)
    private Long flowFormId;
    @Column(columnDefinition = "TEXT")
    private String documentation;
    @Column(columnDefinition = "char",length = 1)
    private Boolean enabled=Boolean.TRUE;
    @Column(nullable = true)
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
        this.flowFormId= def.getFlowForm()!=null?def.getFlowForm().getId():null;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        ProcessDefVersion that = (ProcessDefVersion) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(name, that.name)
                .append(version, that.version)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .append(version)
                .hashCode();

    }
}
