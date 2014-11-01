package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.system.GlobalType;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/9/14.
 */
@Entity
@Table(name = "PROCESSDEF",indexes = {
        @Index(columnList = "actDefId"),
        @Index(columnList = "actResId"),
        @Index(columnList = "graphResId"),
        @Index(columnList = "globalTypeId")
})
public class ProcessDef extends BaseObject {
    public static final String ACT_RES="ACT_RES_"; 
    public static final String GRA_RES="GRA_RES_"; 
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 128,nullable = true)
    private String name;
    @Transient
    private GlobalType globalType;
    @Column(nullable = true)
    private Long globalTypeId;
    @Column(length = 128,nullable = true)
    private String category;
    @Column(nullable = true,length = 4)
    private Integer version;
    @Column(nullable = true,length = 64)
    private String actDefId;
    @Column(nullable = true,length = 64)
    private String actResId;
    @Column(nullable = true,length = 64)
    private String graphResId;
    @Column(name = "hasType",length = 16)
    @Enumerated(EnumType.STRING)
    private ProcessDefHasType hasType;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date deployDate;
    @Column(columnDefinition = "char",length = 1)
    private Boolean suspended;
    @ManyToOne
    @JoinColumn(name = "flowFormId",nullable = true)
    private FlowForm flowForm;
    @Column(columnDefinition = "TEXT")
    private String documentation;
    @Column(columnDefinition = "char",length = 1)
    private Boolean enabled=Boolean.TRUE;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processDef")
    private Set<ProcessElement> elements=new HashSet<ProcessElement>();

    @JoinTable(
            name               = "PROCESSDEF_USER",
            joinColumns        = { @JoinColumn(name = "userId",referencedColumnName = "id") },
            inverseJoinColumns = @JoinColumn(name = "processDefId",referencedColumnName = "id")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<User> users=new HashSet<User>();

    @JoinTable(
            name               = "PROCESSDEF_ROLE",
            joinColumns        = { @JoinColumn(name = "roleId",referencedColumnName = "id") },
            inverseJoinColumns = @JoinColumn(name = "processDefId",referencedColumnName = "id")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<Role> roles=new HashSet<Role>();

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

    public GlobalType getGlobalType() {
        return globalType;
    }

    public void setGlobalType(GlobalType globalType) {
        this.globalType = globalType;
    }

    public Long getGlobalTypeId() {
        return globalTypeId;
    }

    public void setGlobalTypeId(Long globalTypeId) {
        this.globalTypeId = globalTypeId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getActDefId() {
        return actDefId;
    }

    public void setActDefId(String actDefId) {
        this.actDefId = actDefId;
    }

    public String getActResId() {
        return actResId;
    }

    public void setActResId(String actResId) {
        this.actResId = actResId;
    }

    public String getGraphResId() {
        return graphResId;
    }

    public void setGraphResId(String graphResId) {
        this.graphResId = graphResId;
    }

    public Date getDeployDate() {
        return deployDate;
    }

    public void setDeployDate(Date deployDate) {
        this.deployDate = deployDate;
    }

    public Boolean getSuspended() {
        return suspended;
    }

    public void setSuspended(Boolean suspended) {
        this.suspended = suspended;
    }

    public FlowForm getFlowForm() {
        return flowForm;
    }

    public void setFlowForm(FlowForm flowForm) {
        this.flowForm = flowForm;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<ProcessElement> getElements() {
        return elements;
    }

    public void setElements(Set<ProcessElement> elements) {
        this.elements = elements;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public ProcessDefHasType getHasType() {
        return hasType;
    }

    public void setHasType(ProcessDefHasType hasType) {
        this.hasType = hasType;
    }

    public String getActRes(){
        return ACT_RES+this.id+".bpmn20.xml";
    }
    public String getGraRes(){
        return GRA_RES+this.id;
    }
}
