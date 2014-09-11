package com.ozstrategy.model.forms;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Created by lihao on 8/8/14.
 */
@Entity
public class FormField extends BaseObject {
    public static final String detailGrid="detailGrid";
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @Column
    private String label;
    @Column
    private String xtype;
    @Column(columnDefinition = "TEXT")
    private String html;
    @ManyToOne
    @JoinColumn(name = "flowFormId")
    private FlowForm flowForm;
    @Column
    private String dataType;

    public FormField() {
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

    public String getXtype() {
        return xtype;
    }

    public void setXtype(String xtype) {
        this.xtype = xtype;
    }

    public FlowForm getFlowForm() {
        return flowForm;
    }

    public void setFlowForm(FlowForm flowForm) {
        this.flowForm = flowForm;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        FormField formField = (FormField) o;
        return new EqualsBuilder()
                .append(id,formField.id)
                .append(name, formField.name)
                .append(xtype, formField.xtype)
                .append(flowForm,formField.flowForm)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .append(xtype)
                .append(flowForm)
                .hashCode();

    }
}
