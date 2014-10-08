package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.webapp.command.BaseObjectCommand;
import org.apache.commons.lang.StringUtils;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by lihao on 9/10/14.
 */
public class ProcessDefCommand extends BaseObjectCommand {
    private Long id;
    private String name;
    private Integer version;
    private String actDefId;
    private String actResId;
    private String graphResId;
    private String modelId;
    private String depId;
    private String documentation;
    private Long parentId;
    private String category;
    private Long flowFormId;
    private String flowFormName;
    private Long globalTypeId;
    private Set<ProcessDefCommand> children=new HashSet<ProcessDefCommand>();
    private String userIds="";
    private String userFullNames="";
    private String roleIds="";
    private String roleNames="";
    private Date deployDate;
    private Boolean suspended;
    private String formHtml;
    public ProcessDefCommand(ProcessDef processDef,boolean html) {
        super(processDef);
        this.id= processDef.getId();
        this.name= processDef.getName();
        this.version= processDef.getVersion();
        this.actDefId= processDef.getActDefId();
        this.actResId= processDef.getActResId();
        this.graphResId= processDef.getGraphResId();
        this.modelId= processDef.getModelId();
        this.depId= processDef.getDepId();
        this.documentation= processDef.getDocumentation();
        this.category=processDef.getCategory();
        this.flowFormId= processDef.getFlowForm()!=null? processDef.getFlowForm().getId():null;
        this.flowFormName= processDef.getFlowForm()!=null? processDef.getFlowForm().getName():null;
        this.globalTypeId=processDef.getGlobalTypeId();
        this.deployDate=processDef.getDeployDate();
        this.suspended=processDef.getSuspended();
        if(html){
            this.formHtml=processDef.getFlowForm()!=null? processDef.getFlowForm().getContent():null;
        }
        Set<User> users=processDef.getUsers();
        if(users!=null && users.size()>0){
            for(User user : users){
                this.userIds+=","+user.getId();
                this.userFullNames+=","+user.getFullName();
            }
        }
        Set<Role> roles=processDef.getRoles();
        if(roles!=null && roles.size()>0){
            for(Role role : roles){
                this.roleIds+=","+role.getId();
                this.roleNames+=","+role.getDisplayName();
            }
        }
        this.userIds= StringUtils.isNotEmpty(this.userIds)?this.userIds.substring(1):null;
        this.userFullNames= StringUtils.isNotEmpty(this.userFullNames)?this.userFullNames.substring(1):null;
        this.roleIds= StringUtils.isNotEmpty(this.roleIds)?this.roleIds.substring(1):null;
        this.roleNames= StringUtils.isNotEmpty(this.roleNames)?this.roleNames.substring(1):null;
        
    }
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

    public String getDepId() {
        return depId;
    }

    public void setDepId(String depId) {
        this.depId = depId;
    }


    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Set<ProcessDefCommand> getChildren() {
        return children;
    }

    public void setChildren(Set<ProcessDefCommand> children) {
        this.children = children;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public Long getFlowFormId() {
        return flowFormId;
    }

    public void setFlowFormId(Long flowFormId) {
        this.flowFormId = flowFormId;
    }

    public String getFlowFormName() {
        return flowFormName;
    }

    public void setFlowFormName(String flowFormName) {
        this.flowFormName = flowFormName;
    }

    public Long getGlobalTypeId() {
        return globalTypeId;
    }

    public void setGlobalTypeId(Long globalTypeId) {
        this.globalTypeId = globalTypeId;
    }

    public String getUserIds() {
        return userIds;
    }

    public void setUserIds(String userIds) {
        this.userIds = userIds;
    }

    public String getUserFullNames() {
        return userFullNames;
    }

    public void setUserFullNames(String userFullNames) {
        this.userFullNames = userFullNames;
    }

    public String getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(String roleIds) {
        this.roleIds = roleIds;
    }

    public String getRoleNames() {
        return roleNames;
    }

    public void setRoleNames(String roleNames) {
        this.roleNames = roleNames;
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

    public String getFormHtml() {
        return formHtml;
    }

    public void setFormHtml(String formHtml) {
        this.formHtml = formHtml;
    }
}
