package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessDefInstanceDraft;
import com.ozstrategy.webapp.command.CreatorObjcetCommand;

/**
 * Created by lihao on 9/28/14.
 */
public class ProcessDefInstanceDraftCommand extends CreatorObjcetCommand{
    private Long id;
    private String name;
    private String description;
    private Long processDefId;
    private String processDefName;
    private Integer version;
    private Boolean sendEmail;
    private Long fileAttachOne;
    private Long fileAttachTwo;
    private Long fileAttachThree;
    private String formData;
    private String fileAttachOneName;
    private String fileAttachTwoName;
    private String fileAttachThreeName;
    public ProcessDefInstanceDraftCommand(ProcessDefInstanceDraft draft) {
        super(draft);
        this.id= draft.getId();
        this.name= draft.getName();
        this.description=draft.getDescription();
        this.processDefId= draft.getProcessDefId();
        this.processDefName= draft.getProcessDefName();
        this.version= draft.getVersion();
        this.sendEmail= draft.getSendEmail();
        this.fileAttachOne= draft.getFileAttachOne();
        this.fileAttachOneName= draft.getFileAttachOneName();
        this.fileAttachTwoName= draft.getFileAttachTwoName();
        this.fileAttachThreeName= draft.getFileAttachThreeName();
        this.fileAttachTwo= draft.getFileAttachTwo();
        this.fileAttachThree= draft.getFileAttachThree();
        this.formData= draft.getFormData();
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
