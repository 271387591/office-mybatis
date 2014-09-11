package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.webapp.command.BaseObjectCommand;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/10/14.
 */
public class ProcessDefCommand extends BaseObjectCommand {
    private Long id;
    private String name;
    private Integer version;
    private String actDefId;
    private String actResId;
    private String graphResId;
    private String modelId;
    private String depId;
    private String description;
    private Long parentId;
    private Set<ProcessDefCommand> children=new HashSet<ProcessDefCommand>();
    public ProcessDefCommand(ProcessDef processDef) {
        super(processDef);
        this.id= processDef.getId();
        this.name= processDef.getName();
        this.version= processDef.getVersion();
        this.actDefId= processDef.getActDefId();
        this.actResId= processDef.getActResId();
        this.graphResId= processDef.getGraphResId();
        this.modelId= processDef.getModelId();
        this.depId= processDef.getDepId();
        this.description= processDef.getDescription();
        this.parentId= processDef.getParent()!=null? processDef.getParent().getId():null;
        Set<ProcessDef> processDefs= processDef.getChildren();
        if(processDefs!=null && processDefs.size()>0){
            for(ProcessDef child:processDefs){
                this.children.add(new ProcessDefCommand(child));
            }
        }
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

    public String getDepId() {
        return depId;
    }

    public void setDepId(String depId) {
        this.depId = depId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Set<ProcessDefCommand> getChildren() {
        return children;
    }

    public void setChildren(Set<ProcessDefCommand> children) {
        this.children = children;
    }
}
