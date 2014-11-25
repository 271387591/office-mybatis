package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessFileAttach;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/10/14.
 */
public class ProcessDefinitionHeaderCommand {
    private Long fileAttachOne;
    private String fileAttachOneName;
    private Long fileAttachTwo;
    private String fileAttachTwoName;
    private Long fileAttachThree;
    private String fileAttachThreeName;
    private String formHtml;
    private Map<String,Object> formValue=new HashMap<String, Object>();
    private Map<String,Object> chmods=new HashMap<String, Object>();
    public ProcessDefinitionHeaderCommand(List<ProcessFileAttach> attaches){
        if(attaches!=null && attaches.size()>0){
            for(ProcessFileAttach attach : attaches){
                Integer index=attach.getFileIndex();
                if(index==1){
                    this.fileAttachOne=attach.getId();
                    this.fileAttachOneName=attach.getFileName();
                }else if(index==2){
                    this.fileAttachTwo=attach.getId();
                    this.fileAttachTwoName=attach.getFileName();
                }else if(index==3){
                    this.fileAttachThree=attach.getId();
                    this.fileAttachThreeName= attach.getFileName();
                }
            }
        }
    }

    public Long getFileAttachOne() {
        return fileAttachOne;
    }

    public void setFileAttachOne(Long fileAttachOne) {
        this.fileAttachOne = fileAttachOne;
    }

    public String getFileAttachOneName() {
        return fileAttachOneName;
    }

    public void setFileAttachOneName(String fileAttachOneName) {
        this.fileAttachOneName = fileAttachOneName;
    }

    public Long getFileAttachTwo() {
        return fileAttachTwo;
    }

    public void setFileAttachTwo(Long fileAttachTwo) {
        this.fileAttachTwo = fileAttachTwo;
    }

    public String getFileAttachTwoName() {
        return fileAttachTwoName;
    }

    public void setFileAttachTwoName(String fileAttachTwoName) {
        this.fileAttachTwoName = fileAttachTwoName;
    }

    public Long getFileAttachThree() {
        return fileAttachThree;
    }

    public void setFileAttachThree(Long fileAttachThree) {
        this.fileAttachThree = fileAttachThree;
    }

    public String getFileAttachThreeName() {
        return fileAttachThreeName;
    }

    public void setFileAttachThreeName(String fileAttachThreeName) {
        this.fileAttachThreeName = fileAttachThreeName;
    }

    public Map<String, Object> getFormValue() {
        return formValue;
    }

    public void setFormValue(Map<String, Object> formValue) {
        this.formValue = formValue;
    }

    public String getFormHtml() {
        return formHtml;
    }

    public void setFormHtml(String formHtml) {
        this.formHtml = formHtml;
    }

    public Map<String, Object> getChmods() {
        return chmods;
    }

    public void setChmods(Map<String, Object> chmods) {
        this.chmods = chmods;
    }
}
