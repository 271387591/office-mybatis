package com.ozstrategy.model.userrole;

import com.ozstrategy.model.BaseObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created with IntelliJ IDEA.
 * User: liuqian
 * Date: 13-7-3
 * Time: PM3:49
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class SystemView extends BaseObject {
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
    @Column(columnDefinition = "char",length = 1)
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        SystemView that = (SystemView) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(name,that.name)
                .isEquals();

    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .hashCode();
    }
}
