package com.ozstrategy.model.userrole;

import com.ozstrategy.model.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
@Entity
public class SystemView extends BaseEntity {
    public static final String CONTEXT_MANAGER="manager";
    public static final String CONTEXT_USER="user";
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long      id;
    @Column
    private String    name;
    @Column
    private String    url ;
    @Column
    private String context;
    @Column
    private Boolean   enabled;

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
