package com.ozstrategy.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;

@MappedSuperclass
public abstract class BaseEntity implements Serializable {
    private static final long serialVersionUID = -5137348947151932448L;

    @Column(
            name = "createDate",
            nullable = false,
            updatable = false
    )
    @Temporal(TemporalType.TIMESTAMP)
    protected Date createDate;

    @Column(name = "lastUpdateDate")
    @Temporal(TemporalType.TIMESTAMP)
    protected Date lastUpdateDate;

    public BaseEntity() {
        this.createDate = new Date();
        this.lastUpdateDate = createDate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public Date getLastUpdateDate() {
        return lastUpdateDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public void setLastUpdateDate(Date lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(getClass());
    }
}
