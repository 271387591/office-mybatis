package com.ozstrategy.webapp.command.userrole;

import com.ozstrategy.model.userrole.SystemView;

/**
 * Created by lihao on 7/24/14.
 */
public class SystemViewCommand {
    private String name;
    private Long id;
    private String context;
    public SystemViewCommand(SystemView systemView){
        this.id=systemView.getId();
        this.name= systemView.getName();
        this.context= systemView.getContext();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
