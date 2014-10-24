package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.webapp.command.CreatorObjcetCommand;

import java.util.Date;

/**
 * Created by lihao on 10/10/14.
 */
public class TaskInstanceCommand extends CreatorObjcetCommand{
    private Long id;
    private String taskKey;
    private String name;
    private Date startDate;
    private Date endDate;
    private Date overdueDate;
    private Long elementId;
    private Long assigneeId;
    private String assigneeFullName;
    private String assigneeUsername;
    private Long instanceId;
    private String remarks;
    private String actTaskId;
    private Boolean sendEmail;
    private String status;
    private Long durationIn;
    private String title;
    private Long processDefId;
    private String processName;
    private Integer processVersion;
    public TaskInstanceCommand(TaskInstance instance) {
        super(instance);
        this.id= instance.getId();
        this.taskKey= instance.getTaskKey();
        this.name= instance.getName();
        this.startDate= instance.getStartDate();
        this.endDate= instance.getEndDate();
        this.overdueDate= instance.getOverdueDate();
        this.elementId= instance.getElement()!=null? instance.getElement().getId():null;
        this.assigneeId= instance.getAssignee()!=null? instance.getAssignee().getId():null;
        this.assigneeFullName= instance.getAssignee()!=null? instance.getAssignee().getFullName():null;
        this.assigneeUsername= instance.getAssignee()!=null? instance.getAssignee().getUsername():null;
        this.instanceId= instance.getInstance()!=null?instance.getInstance().getId():null;
        this.title= instance.getInstance()!=null?instance.getInstance().getTitle():null;
        this.remarks=instance.getRemarks();
        this.actTaskId= instance.getActTaskId();
        this.sendEmail= instance.getSendEmail();
        this.status= instance.getStatus().name();
        this.durationIn=endDate.getTime()-startDate.getTime();
        this.processDefId=instance.getProcessDef()!=null?instance.getProcessDef().getId():null;
        this.processName=instance.getProcessDef()!=null?instance.getProcessDef().getName():null;
        this.processVersion=instance.getProcessDef()!=null?instance.getProcessDef().getVersion():null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskKey() {
        return taskKey;
    }

    public void setTaskKey(String taskKey) {
        this.taskKey = taskKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getOverdueDate() {
        return overdueDate;
    }

    public void setOverdueDate(Date overdueDate) {
        this.overdueDate = overdueDate;
    }

    public Long getElementId() {
        return elementId;
    }

    public void setElementId(Long elementId) {
        this.elementId = elementId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getAssigneeFullName() {
        return assigneeFullName;
    }

    public void setAssigneeFullName(String assigneeFullName) {
        this.assigneeFullName = assigneeFullName;
    }

    public String getAssigneeUsername() {
        return assigneeUsername;
    }

    public void setAssigneeUsername(String assigneeUsername) {
        this.assigneeUsername = assigneeUsername;
    }

    public Long getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(Long instanceId) {
        this.instanceId = instanceId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getActTaskId() {
        return actTaskId;
    }

    public void setActTaskId(String actTaskId) {
        this.actTaskId = actTaskId;
    }

    public Boolean getSendEmail() {
        return sendEmail;
    }

    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getDurationIn() {
        return durationIn;
    }

    public void setDurationIn(Long durationIn) {
        this.durationIn = durationIn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(Long processDefId) {
        this.processDefId = processDefId;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }

    public Integer getProcessVersion() {
        return processVersion;
    }

    public void setProcessVersion(Integer processVersion) {
        this.processVersion = processVersion;
    }
}
