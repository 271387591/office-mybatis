package com.ozstrategy.model.flows;

import com.ozstrategy.model.userrole.User;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/9/14.
 */
@Entity
public class ProcessElement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String type;
    @Column
    private String actClass;
    @Column
    private String label;
    @Column
    private String taskKey;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processElement")
    private Set<ProcessElementForm> instances=new HashSet<ProcessElementForm>();
    @JoinTable(
            name               = "ProcessElementUser",
            joinColumns        = { @JoinColumn(name = "userId") },
            inverseJoinColumns = @JoinColumn(name = "elementId")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<User> users=new HashSet<User>();
    @JoinTable(
            name               = "ProcessElementRole",
            joinColumns        = { @JoinColumn(name = "roleId") },
            inverseJoinColumns = @JoinColumn(name = "elementId")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<User> roles=new HashSet<User>();
    
    @ManyToOne
    @JoinColumn(name = "processDefId")
    private ProcessDef processDef;
    @Column(length = 32)
    private String taskType;
    
    @Column
    @Lob
    @Basic(fetch=FetchType.LAZY)
    private byte[] actResource;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Set<ProcessElementForm> getInstances() {
        return instances;
    }

    public void setInstances(Set<ProcessElementForm> instances) {
        this.instances = instances;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public ProcessDef getProcessDef() {
        return processDef;
    }

    public void setProcessDef(ProcessDef processDef) {
        this.processDef = processDef;
    }

    public String getTaskKey() {
        return taskKey;
    }

    public void setTaskKey(String taskKey) {
        this.taskKey = taskKey;
    }

    public String getActClass() {
        return actClass;
    }

    public void setActClass(String actClass) {
        this.actClass = actClass;
    }

    public byte[] getActResource() {
        return actResource;
    }

    public void setActResource(byte[] actResource) {
        this.actResource = actResource;
    }

    public Set<User> getRoles() {
        return roles;
    }

    public void setRoles(Set<User> roles) {
        this.roles = roles;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }
}
