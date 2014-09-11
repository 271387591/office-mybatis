package com.ozstrategy.webapp.command.userrole;

import com.ozstrategy.model.userrole.Role;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: wangym
 * Date: 1/30/13
 * Time: 11:54 AM
 * To change this template use File | Settings | File Templates.
 */
public class RoleCommand {
	
	private Long id;

	
	private String name;

  
    private String displayName;


	private String description;


	private Date createDate;


	private Date lastUpdateDate;

    private String context;
    private Long systemViewId;
    
    private List<FeatureCommand> simpleFeatures=new ArrayList<FeatureCommand>();

	public RoleCommand(){}

	public RoleCommand(Role role){
		this.id = role.getId();
		this.name = role.getName();
		this.displayName = role.getDisplayName();
		this.description = role.getDescription();
		this.createDate = role.getCreateDate();
		this.lastUpdateDate = role.getLastUpdateDate();
        this.context=role.getSystemView().getContext();
        this.systemViewId=role.getSystemView().getId();
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

    public String getDisplayName() {
    return displayName;
  }

    public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public List<FeatureCommand> getSimpleFeatures() {
        return simpleFeatures;
    }

    public void setSimpleFeatures(List<FeatureCommand> simpleFeatures) {
        this.simpleFeatures = simpleFeatures;
    }

    public Long getSystemViewId() {
        return systemViewId;
    }

    public void setSystemViewId(Long systemViewId) {
        this.systemViewId = systemViewId;
    }
}
