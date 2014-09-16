package com.ozstrategy.webapp.command.forms;

import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.webapp.command.BaseObjectCommand;

/**
 * Created by lihao on 8/8/14.
 */
public class FormFieldCommand extends BaseObjectCommand {
    private Long id;
    private String name;
    private String label;
    private String xtype;
    private String html;
    private Long flowFormId;
    private String dataType;

    public FormFieldCommand(FormField formField) {
        super(formField);
        this.id= formField.getId();
        this.name= formField.getName();
        this.label= formField.getLabel();
        this.xtype= formField.getXtype();
        this.html= formField.getHtml();
        this.dataType= formField.getDataType();
        this.flowFormId= formField.getFlowForm()!=null? formField.getFlowForm().getId():null;
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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getXtype() {
        return xtype;
    }

    public void setXtype(String xtype) {
        this.xtype = xtype;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public Long getFlowFormId() {
        return flowFormId;
    }

    public void setFlowFormId(Long flowFormId) {
        this.flowFormId = flowFormId;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }
}
