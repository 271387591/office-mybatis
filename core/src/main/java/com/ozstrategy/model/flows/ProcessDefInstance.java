package com.ozstrategy.model.flows;

import com.ozstrategy.model.CreatorObject;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

/**
 * Created by lihao on 9/21/14.
 */
@Entity
@Table(name="PROCESSDEFINSTANCE",indexes = {
        @Index(columnList = "actInstanceId")
})
public class ProcessDefInstance extends CreatorObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "processDefId")
    private ProcessDef processDef;
    @Column(length = 5)
    private Integer version;
    @Column(length = 32,nullable = true)
    private String actInstanceId;
    @Column(length = 1,columnDefinition = "char")
    private Boolean suspended;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;
    @Column(length = 128,nullable = true)
    private String name;
    @Column(length = 255,nullable = false)
    private String title;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessDef getProcessDef() {
        return processDef;
    }

    public void setProcessDef(ProcessDef processDef) {
        this.processDef = processDef;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getActInstanceId() {
        return actInstanceId;
    }

    public void setActInstanceId(String actInstanceId) {
        this.actInstanceId = actInstanceId;
    }

    public Boolean getSuspended() {
        return suspended;
    }

    public void setSuspended(Boolean suspended) {
        this.suspended = suspended;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        ProcessDefInstance that = (ProcessDefInstance) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(name, that.name)
                .append(actInstanceId,that.actInstanceId)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(name)
                .append(actInstanceId)
                .hashCode();
    }
}
