package com.ozstrategy.model.flows;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 10/22/14.
 */
public class ProcessInstanceHistory implements Serializable{
    private String id;
    private String processName;
    private String title;
    private Long processDefId;
    private String processDefinitionId;
    private String actInstanceId;
    private Long instanceId;
    private Date startTime;
    private Date endTime;
    private String startUserId;
    private Set<Task> runTasks=new HashSet<Task>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
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

    public String getProcessDefinitionId() {
        return processDefinitionId;
    }

    public void setProcessDefinitionId(String processDefinitionId) {
        this.processDefinitionId = processDefinitionId;
    }

    public String getActInstanceId() {
        return actInstanceId;
    }

    public void setActInstanceId(String actInstanceId) {
        this.actInstanceId = actInstanceId;
    }

    public Long getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(Long instanceId) {
        this.instanceId = instanceId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getStartUserId() {
        return startUserId;
    }

    public void setStartUserId(String startUserId) {
        this.startUserId = startUserId;
    }

    public Set<Task> getRunTasks() {
        return runTasks;
    }

    public void setRunTasks(Set<Task> runTasks) {
        this.runTasks = runTasks;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProcessInstanceHistory that = (ProcessInstanceHistory) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(processName, that.processName)
                .append(processDefId, that.processDefId)
                .append(startTime, that.startTime)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(processName)
                .append(processDefId)
                .append(startTime)
                .hashCode();
    }
}
