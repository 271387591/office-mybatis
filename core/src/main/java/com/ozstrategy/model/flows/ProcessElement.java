package com.ozstrategy.model.flows;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import org.apache.commons.lang.StringUtils;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 9/9/14.
 */
@Entity
@Table(name = "PROCESSELEMENT")
public class ProcessElement implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 16,nullable = false)
    private String graphType;
    @Column(length = 16,nullable = true)
    @Enumerated(EnumType.STRING)
    private TaskType taskType;
    @Column(length = 16,nullable = false)
    private String actClass;
    @Column(length = 128,nullable = true)
    private String label;
    @Column(length = 8,nullable = false)
    private String taskKey;
    @Column(length = 400,nullable = true)
    private String preTaskKeys;
    @Column(length = 400,nullable = true)
    private String nextTaskKeys;
    @Column(nullable = true)
    private Long parentId;
    @Column(nullable = true,length = 255)
    private String countersign;
    @Transient
    private Map<String,Object> countersignMap=new HashMap<String, Object>();
    @OneToMany(fetch = FetchType.LAZY)
    private Set<ProcessElement> children=new HashSet<ProcessElement>();
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processElement")
    private Set<ProcessElementForm> elementForms=new HashSet<ProcessElementForm>();
    @JoinTable(
            name               = "PROCESSELEMENT_USER",
            joinColumns        = { @JoinColumn(name = "userId",referencedColumnName = "id",nullable = false) },
            inverseJoinColumns = @JoinColumn(name = "elementId",referencedColumnName = "id",nullable = false)
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.ALL}
    )
    private Set<User> users=new HashSet<User>();
    @ManyToOne
    @JoinColumn(name = "processDefId",nullable = true,referencedColumnName = "id")
    private ProcessDef processDef;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGraphType() {
        return graphType;
    }

    public void setGraphType(String graphType) {
        this.graphType = graphType;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public String getActClass() {
        return actClass;
    }

    public void setActClass(String actClass) {
        this.actClass = actClass;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTaskKey() {
        return taskKey;
    }

    public void setTaskKey(String taskKey) {
        this.taskKey = taskKey;
    }

    public String getPreTaskKeys() {
        return preTaskKeys;
    }

    public void setPreTaskKeys(String preTaskKeys) {
        this.preTaskKeys = preTaskKeys;
    }

    public String getNextTaskKeys() {
        return nextTaskKeys;
    }

    public void setNextTaskKeys(String nextTaskKeys) {
        this.nextTaskKeys = nextTaskKeys;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Set<ProcessElement> getChildren() {
        return children;
    }

    public void setChildren(Set<ProcessElement> children) {
        this.children = children;
    }

    public Set<ProcessElementForm> getElementForms() {
        return elementForms;
    }

    public void setElementForms(Set<ProcessElementForm> elementForms) {
        this.elementForms = elementForms;
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

    public String getCountersign() {
        return countersign;
    }

    public void setCountersign(String countersign) {
        this.countersign = countersign;
    }

    public Map<String, Object> getCountersignMap() {
        if(StringUtils.isNotEmpty(countersign)){
            try {
                countersignMap=(Map<String, Object>)new ObjectMapper().readValue(countersign,Map.class);
            } catch (IOException e) {
            }
        }
        return countersignMap;
    }

    public void setCountersignMap(Map<String, Object> countersignMap) {
        this.countersignMap = countersignMap;
    }
}
