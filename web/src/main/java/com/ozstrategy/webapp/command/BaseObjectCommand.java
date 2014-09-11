package com.ozstrategy.webapp.command;

import com.ozstrategy.model.BaseObject;

import java.util.Date;

/**
 * Created by lihao on 8/8/14.
 */
public class BaseObjectCommand {
    private Date createDate;
    private Date lastUpdateDate;
    public BaseObjectCommand(BaseObject baseObject){
        this.createDate=baseObject.getCreateDate();
        this.lastUpdateDate=baseObject.getLastUpdateDate();
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
}
