package com.ozstrategy.model.flows;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import java.util.Date;

/**
 * Created by lihao on 10/9/14.
 */
public class Task {
    private String id;
    private String name;
    private String assignee;
    private String actInstanceId;
    private String executionId;
    private String processDefinitionId;
    private Date createDate;
    private Date dueDate;
    private String taskDefinitionKey;
    private String parentTaskId;
    private Boolean suspended;
    private String processDefinitionName;
    private Integer priority;
    private String description;
    private String owner;
    private String deploymentId;
    private String delegationState;
    private String category;
    private String tenantId;
    private String formKey;
    private Long processDefId;
    private String graphResId;
    private Long instanceId;
    private String title;
    private String taskType;
    private String fromTaskKey;
    private String fromTaskType;
    private String fromTaskAssignee;
    private String fromTaskId;
    private Boolean endTask;
    private Long processElementId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getProcessDefinitionId() {
        return processDefinitionId;
    }

    public void setProcessDefinitionId(String processDefinitionId) {
        this.processDefinitionId = processDefinitionId;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getTaskDefinitionKey() {
        return taskDefinitionKey;
    }

    public void setTaskDefinitionKey(String taskDefinitionKey) {
        this.taskDefinitionKey = taskDefinitionKey;
    }

    public String getParentTaskId() {
        return parentTaskId;
    }

    public void setParentTaskId(String parentTaskId) {
        this.parentTaskId = parentTaskId;
    }

    public Boolean getSuspended() {
        return suspended;
    }

    public void setSuspended(Boolean suspended) {
        this.suspended = suspended;
    }

    public String getProcessDefinitionName() {
        return processDefinitionName;
    }

    public void setProcessDefinitionName(String processDefinitionName) {
        this.processDefinitionName = processDefinitionName;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getDelegationState() {
        return delegationState;
    }

    public void setDelegationState(String delegationState) {
        this.delegationState = delegationState;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getFormKey() {
        return formKey;
    }

    public void setFormKey(String formKey) {
        this.formKey = formKey;
    }

    public Long getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(Long processDefId) {
        this.processDefId = processDefId;
    }

    public String getGraphResId() {
        return graphResId;
    }

    public void setGraphResId(String graphResId) {
        this.graphResId = graphResId;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getFromTaskKey() {
        return fromTaskKey;
    }

    public void setFromTaskKey(String fromTaskKey) {
        this.fromTaskKey = fromTaskKey;
    }

    public String getFromTaskType() {
        return fromTaskType;
    }

    public void setFromTaskType(String fromTaskType) {
        this.fromTaskType = fromTaskType;
    }

    public String getFromTaskAssignee() {
        return fromTaskAssignee;
    }

    public void setFromTaskAssignee(String fromTaskAssignee) {
        this.fromTaskAssignee = fromTaskAssignee;
    }

    public String getFromTaskId() {
        return fromTaskId;
    }

    public void setFromTaskId(String fromTaskId) {
        this.fromTaskId = fromTaskId;
    }

    public Boolean getEndTask() {
        return endTask;
    }

    public void setEndTask(Boolean endTask) {
        this.endTask = endTask;
    }

    public Long getProcessElementId() {
        return processElementId;
    }

    public void setProcessElementId(Long processElementId) {
        this.processElementId = processElementId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Task that = (Task) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(name, that.name)
                .append(processDefId, that.processDefId)
                .append(processElementId, that.processElementId)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .append(processDefId)
                .append(processElementId)
                .hashCode();
    }
}
