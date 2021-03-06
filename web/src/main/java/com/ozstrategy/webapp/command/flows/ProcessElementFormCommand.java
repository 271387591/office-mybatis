package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessElementForm;
import com.ozstrategy.model.forms.FormField;

/**
 * Created by lihao on 9/15/14.
 */
public class ProcessElementFormCommand {
    private Long id;
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
    private Integer chmod;
    public ProcessElementFormCommand(ProcessElementForm instance){
        this.id= instance.getId();
        this.name= instance.getName();
        this.variable= instance.getVariable();
        this.type=instance.getType();
        this.readable= instance.getChmod()!=null&&instance.getChmod()==0;
        this.writeable= instance.getChmod()==null || instance.getChmod()==1;
        this.required= instance.getChmod()!=null&&instance.getChmod()==2;
        this.chmod= instance.getChmod();
        this.expression= instance.getExpression();
    }
    public ProcessElementFormCommand(FormField instance){
        this.id= instance.getId();
        this.name= instance.getLabel();
        this.variable= instance.getName();
        this.type=instance.getDataType();
        chmod=1;
    }
    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getChmod() {
        return chmod;
    }

    public void setChmod(Integer chmod) {
        this.chmod = chmod;
    }
}
