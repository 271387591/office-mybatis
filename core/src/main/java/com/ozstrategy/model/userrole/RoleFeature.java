package com.ozstrategy.model.userrole;

import com.ozstrategy.model.BaseEntity;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.hibernate.annotations.Where;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
public class RoleFeature extends BaseEntity implements Serializable {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;
    @JoinColumn(
            name = "featureId",
            insertable = true,
            updatable = true,
            nullable = false
    )
    @ManyToOne(fetch = FetchType.LAZY)
    @Where(clause = "enabled = 1")
    private Feature feature;
    @JoinColumn(
            name = "roleId",
            insertable = true,
            updatable = true,
            nullable = false

    )
    @ManyToOne(fetch = FetchType.LAZY)
    private Role role;

    public RoleFeature() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Feature getFeature() {
        return feature;
    }

    public void setFeature(Feature feature) {
        this.feature = feature;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        RoleFeature that = (RoleFeature) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(feature, that.feature)
                .append(role, that.role)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(feature)
                .append(role)
                .hashCode();
    }
} 
