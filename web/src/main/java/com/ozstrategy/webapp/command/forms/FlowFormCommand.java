package com.ozstrategy.webapp.command.forms;

import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.webapp.command.BaseObjectCommand;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 8/8/14.
 */
public class FlowFormCommand extends BaseObjectCommand {
    private Long id;
    private String name;
    private String displayName;
    private String description;
    private String content;
    private Boolean  enabled=Boolean.TRUE;
    private Long parentId;
    private Set<FlowFormCommand> children=new HashSet<FlowFormCommand>();
    private Set<FormFieldCommand> fields=new HashSet<FormFieldCommand>();

    public FlowFormCommand(FlowForm flowForm) {
        super(flowForm);
        this.id= flowForm.getId();
        this.name= flowForm.getName();
        this.displayName= flowForm.getDisplayName();
        this.description= flowForm.getDescription();
        this.content= flowForm.getContent();
        this.enabled= flowForm.getEnabled();
        this.parentId= flowForm.getParent()!=null?flowForm.getParent().getId():null;
        Set<FlowForm> flowForms=flowForm.getChildren();
        if(flowForms!=null && flowForms.size()>0){
            for(FlowForm form : flowForms){
                this.children.add(new FlowFormCommand(form));
            }
        }
        Set<FormField> formFields=flowForm.getFields();
        if(formFields!=null && formFields.size()>0){
            for(FormField formField : formFields){
                this.fields.add(new FormFieldCommand(formField));
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Set<FlowFormCommand> getChildren() {
        return children;
    }

    public void setChildren(Set<FlowFormCommand> children) {
        this.children = children;
    }

    public Set<FormFieldCommand> getFields() {
        return fields;
    }

    public void setFields(Set<FormFieldCommand> fields) {
        this.fields = fields;
    }
}
