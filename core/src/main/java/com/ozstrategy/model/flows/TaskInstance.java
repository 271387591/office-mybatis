package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import com.ozstrategy.model.userrole.User;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/27/14.
 */
@Entity
public class TaskInstance extends BaseObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String taskKey;
    @Column
    private String name;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date overdueDate;
    @ManyToOne
    @JoinColumn(name = "elementId")
    private ProcessElement element;
    @ManyToOne
    @JoinColumn(name = "assigneeId")
    private User assignee;
    @ManyToOne
    @JoinColumn(name = "elementId")
    private ProcessDefInstance instance;
    @Column(columnDefinition = "TEXT")
    private String remarks;
    @Column
    private String actTaskId;
    @OneToMany(mappedBy = "instance",fetch = FetchType.LAZY)
    private Set<ProcessFileAttach> fileAttaches=new HashSet<ProcessFileAttach>();
    @Column
    private Boolean sendEmail;
    @Column
    private String status;

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

    public ProcessElement getElement() {
        return element;
    }

    public void setElement(ProcessElement element) {
        this.element = element;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public ProcessDefInstance getInstance() {
        return instance;
    }

    public void setInstance(ProcessDefInstance instance) {
        this.instance = instance;
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

    public Set<ProcessFileAttach> getFileAttaches() {
        return fileAttaches;
    }

    public void setFileAttaches(Set<ProcessFileAttach> fileAttaches) {
        this.fileAttaches = fileAttaches;
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
}
