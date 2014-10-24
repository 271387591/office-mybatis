package com.ozstrategy.model.flows;

import com.ozstrategy.model.CreatorObject;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by lihao on 9/27/14.
 */
@Entity
@Table(name = "PROCESSDEFINSTANCEDRAFT")
public class ProcessDefInstanceDraft extends CreatorObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 128,nullable = true)
    private String name;
    @Column(length = 4000,nullable = true)
    private String description;
    @Column(nullable = true)
    private Long processDefId;
    @Column(nullable = true,length = 128)
    private String processDefName;
    @Column(nullable = false,length = 4)
    private Integer version;
    @Column(columnDefinition = "char",length = 1)
    private Boolean sendEmail;
    @Column(nullable = true)
    private Long fileAttachOne;
    @Column(length = 128,nullable = true)
    private String fileAttachOneName;
    @Column(nullable = true)
    private Long fileAttachTwo;
    @Column(length = 128,nullable = true)
    private String fileAttachTwoName;
    @Column(nullable = true)
    private Long fileAttachThree;
    @Column(length = 128,nullable = true)
    private String fileAttachThreeName;
    @Column(nullable = true,length = 2000)
    private String formData;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(Long processDefId) {
        this.processDefId = processDefId;
    }

    public String getProcessDefName() {
        return processDefName;
    }

    public void setProcessDefName(String processDefName) {
        this.processDefName = processDefName;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Boolean getSendEmail() {
        return sendEmail;
    }

    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }

    public Long getFileAttachOne() {
        return fileAttachOne;
    }

    public void setFileAttachOne(Long fileAttachOne) {
        this.fileAttachOne = fileAttachOne;
    }

    public Long getFileAttachTwo() {
        return fileAttachTwo;
    }

    public void setFileAttachTwo(Long fileAttachTwo) {
        this.fileAttachTwo = fileAttachTwo;
    }

    public Long getFileAttachThree() {
        return fileAttachThree;
    }

    public void setFileAttachThree(Long fileAttachThree) {
        this.fileAttachThree = fileAttachThree;
    }

    public String getFormData() {
        return formData;
    }

    public void setFormData(String formData) {
        this.formData = formData;
    }

    public String getFileAttachOneName() {
        return fileAttachOneName;
    }

    public void setFileAttachOneName(String fileAttachOneName) {
        this.fileAttachOneName = fileAttachOneName;
    }

    public String getFileAttachTwoName() {
        return fileAttachTwoName;
    }

    public void setFileAttachTwoName(String fileAttachTwoName) {
        this.fileAttachTwoName = fileAttachTwoName;
    }

    public String getFileAttachThreeName() {
        return fileAttachThreeName;
    }

    public void setFileAttachThreeName(String fileAttachThreeName) {
        this.fileAttachThreeName = fileAttachThreeName;
    }
}
