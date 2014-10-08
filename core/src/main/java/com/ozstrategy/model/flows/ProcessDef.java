package com.ozstrategy.model.flows;

import com.ozstrategy.model.BaseObject;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.system.GlobalType;
import com.ozstrategy.model.userrole.Role;
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
public class ProcessDef extends BaseObject {
    public static final String ACT_RES="ACT_RES_"; 
    public static final String GRA_RES="GRA_RES_"; 
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @Transient
    private GlobalType globalType;
    @Column
    private Long globalTypeId;
    @Transient
    private String category;
    @Column
    private Integer version;
    @Column
    private String actDefId;
    @Column
    private String actResId;
    @Column
    private String graphResId;
    @Column
    private String modelId;
    @Column
    private String depId;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date deployDate;
    @Column
    private Boolean suspended;
    
    @ManyToOne
    @JoinColumn(name = "flowFormId")
    private FlowForm flowForm;
    @Column(columnDefinition = "TEXT")
    private String documentation;
    @Column
    private Boolean enabled=Boolean.TRUE;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "processDef")
    private Set<ProcessElement> elements=new HashSet<ProcessElement>();

    @JoinTable(
            name               = "ProcessDefUser",
            joinColumns        = { @JoinColumn(name = "userId",referencedColumnName = "id") },
            inverseJoinColumns = @JoinColumn(name = "processDefId",referencedColumnName = "id")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<User> users=new HashSet<User>();

    @JoinTable(
            name               = "ProcessDefRole",
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

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public Set<ProcessElement> getElements() {
        return elements;
    }

    public void setElements(Set<ProcessElement> elements) {
        this.elements = elements;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getDepId() {
        return depId;
    }

    public void setDepId(String depId) {
        this.depId = depId;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
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

    public FlowForm getFlowForm() {
        return flowForm;
    }

    public void setFlowForm(FlowForm flowForm) {
        this.flowForm = flowForm;
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

    public String getActRes(){
        return ACT_RES+this.id+".bpmn20.xml";
    }
    public String getGraRes(){
        return GRA_RES+this.id;
    }
}
