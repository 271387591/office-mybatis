package com.ozstrategy.model;

import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.ozstrategy.model.userrole.User;


@MappedSuperclass
public abstract class CreatorEntity extends BaseEntity {

    private static final long serialVersionUID = 579757832122255158L;

    @JoinColumn(
            name = "creatorId",
            insertable = true,
            updatable = false
    )
    @ManyToOne(fetch = FetchType.LAZY)
    protected User creator;

    @JoinColumn(
            name = "lastUpdaterId",
            insertable = true,
            updatable = true
    )
    @ManyToOne(fetch = FetchType.LAZY)
    protected User lastUpdater;

    public User getCreator() {
        return creator;
    }

    public User getLastUpdater() {
        return lastUpdater;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public void setLastUpdater(User lastUpdater) {
        this.lastUpdater = lastUpdater;
    }
} 
