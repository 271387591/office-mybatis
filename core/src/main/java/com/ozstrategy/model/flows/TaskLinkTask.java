package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * Created by lihao on 10/28/14.
 */
@Entity
@Table(name = "TASKLINKTASK",indexes = {
        @Index(columnList = "actInstanceId"),
        @Index(columnList = "currentTaskId"),
        @Index(columnList = "fromTaskType"),
        @Index(columnList = "fromTaskId"),
        @Index(columnList = "currentTaskKey")
})
public class TaskLinkTask extends BaseObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 32,nullable = false)
    private String actInstanceId;
    @Column(length = 32,nullable = false)
    private String currentTaskId;
    @Column(length = 32,nullable = false)
    private String fromTaskId;
    @Column(length = 16,nullable = false)
    private String fromTaskKey;
    @Column(length = 16,nullable = false)
    private String currentTaskKey;
    @Column(length = 32,nullable = false)
    private String fromTaskAssignee;
    @Column(length = 32,nullable = false)
    @Enumerated(value = EnumType.STRING)
    private TaskType fromTaskType=TaskType.CommonUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActInstanceId() {
        return actInstanceId;
    }

    public void setActInstanceId(String actInstanceId) {
        this.actInstanceId = actInstanceId;
    }

    public String getCurrentTaskId() {
        return currentTaskId;
    }

    public void setCurrentTaskId(String currentTaskId) {
        this.currentTaskId = currentTaskId;
    }

    public String getFromTaskKey() {
        return fromTaskKey;
    }

    public void setFromTaskKey(String fromTaskKey) {
        this.fromTaskKey = fromTaskKey;
    }

    public String getCurrentTaskKey() {
        return currentTaskKey;
    }

    public void setCurrentTaskKey(String currentTaskKey) {
        this.currentTaskKey = currentTaskKey;
    }

    public String getFromTaskAssignee() {
        return fromTaskAssignee;
    }

    public void setFromTaskAssignee(String fromTaskAssignee) {
        this.fromTaskAssignee = fromTaskAssignee;
    }

    public TaskType getFromTaskType() {
        return fromTaskType;
    }

    public void setFromTaskType(TaskType fromTaskType) {
        this.fromTaskType = fromTaskType;
    }

    public String getFromTaskId() {
        return fromTaskId;
    }

    public void setFromTaskId(String fromTaskId) {
        this.fromTaskId = fromTaskId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        TaskLinkTask that = (TaskLinkTask) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(actInstanceId, that.actInstanceId)
                .append(fromTaskId, that.fromTaskId)
                .append(currentTaskId, that.currentTaskId)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(actInstanceId)
                .append(fromTaskId)
                .append(currentTaskId)
                .hashCode();
    }
}
