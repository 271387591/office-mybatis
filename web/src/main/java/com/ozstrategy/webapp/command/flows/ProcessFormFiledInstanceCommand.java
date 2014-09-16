package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessFormFiledInstance;

/**
 * Created by lihao on 9/15/14.
 */
public class ProcessFormFiledInstanceCommand {
    private Long id;
    private Long formFieldId;
    private Long processElementId;
    private Long processDefId;
    protected String name;
    protected String expression;
    protected String variable;
    protected String type;
    protected String defaultExpression;
    protected String datePattern;
    protected Boolean readable = true;
    protected Boolean writeable = true;
    protected Boolean required;
    public ProcessFormFiledInstanceCommand(ProcessFormFiledInstance instance){
        this.id= instance.getId();
        this.formFieldId=instance.getFormField()!=null?instance.getFormField().getId():null;
        this.name=instance.getFormField()!=null?instance.getFormField().getLabel():null;
        this.variable=instance.getFormField()!=null?instance.getFormField().getName():null;
        this.type=instance.getFormField()!=null?instance.getFormField().getDataType():null;
        this.readable= instance.getChmod()!=null&&instance.getChmod()==0;
        this.writeable= instance.getChmod()==null || instance.getChmod()==1;
        this.required= instance.getChmod()!=null&&instance.getChmod()==2;
        this.expression= instance.getExpression();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFormFieldId() {
        return formFieldId;
    }

    public void setFormFieldId(Long formFieldId) {
        this.formFieldId = formFieldId;
    }

    public Long getProcessElementId() {
        return processElementId;
    }

    public void setProcessElementId(Long processElementId) {
        this.processElementId = processElementId;
    }

    public Long getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(Long processDefId) {
        this.processDefId = processDefId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getVariable() {
        return variable;
    }

    public void setVariable(String variable) {
        this.variable = variable;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDefaultExpression() {
        return defaultExpression;
    }

    public void setDefaultExpression(String defaultExpression) {
        this.defaultExpression = defaultExpression;
    }

    public String getDatePattern() {
        return datePattern;
    }

    public void setDatePattern(String datePattern) {
        this.datePattern = datePattern;
    }

    public Boolean getReadable() {
        return readable;
    }

    public void setReadable(Boolean readable) {
        this.readable = readable;
    }

    public Boolean getWriteable() {
        return writeable;
    }

    public void setWriteable(Boolean writeable) {
        this.writeable = writeable;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }
}
