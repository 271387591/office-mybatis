package com.ozstrategy.model.flows;

import com.ozstrategy.model.forms.FormField;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

/**
 * Created by lihao on 9/9/14.
 */
@Entity
public class ProcessFormFiledInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "formFieldId")
    private FormField formField;
    @Column
    private Integer chmod;

    @Column
    private String expression;
    @ManyToOne
    @JoinColumn(name = "processElementId")
    private ProcessElement processElement;
    @ManyToOne
    @JoinColumn(name = "processDefId")
    private ProcessDef processDef;
    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FormField getFormField() {
        return formField;
    }

    public void setFormField(FormField formField) {
        this.formField = formField;
    }

    public Integer getChmod() {
        return chmod;
    }

    public void setChmod(Integer chmod) {
        this.chmod = chmod;
    }

    public ProcessElement getProcessElement() {
        return processElement;
    }

    public void setProcessElement(ProcessElement processElement) {
        this.processElement = processElement;
    }

    public ProcessDef getProcessDef() {
        return processDef;
    }

    public void setProcessDef(ProcessDef processDef) {
        this.processDef = processDef;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }
}
