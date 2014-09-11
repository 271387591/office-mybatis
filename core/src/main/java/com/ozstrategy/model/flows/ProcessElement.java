package com.ozstrategy.model.flows;

import com.ozstrategy.model.userrole.User;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/9/14.
 */
@Entity
public class ProcessElement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String type;
    @Column
    private String label;
    @Column
    private String taskKey;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processElement")
    private Set<ProcessFormFiledInstance> instances=new HashSet<ProcessFormFiledInstance>();
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
    @ManyToOne
    @JoinColumn(name = "processDefId")
    private ProcessDef processDef;

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

    public Set<ProcessFormFiledInstance> getInstances() {
        return instances;
    }

    public void setInstances(Set<ProcessFormFiledInstance> instances) {
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
}
