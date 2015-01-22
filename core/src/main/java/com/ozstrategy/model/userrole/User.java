package com.ozstrategy.model.userrole;

import com.ozstrategy.Constants;
import com.ozstrategy.model.BaseEntity;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
@Entity
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long     id;
    @Column
    private Boolean  accountExpired=Boolean.FALSE;
    @Column
    private Boolean  accountLocked=Boolean.FALSE;
    @Column
    private Boolean  credentialsExpired=Boolean.FALSE;
    @Column
    private Boolean  enabled=Boolean.TRUE;
    @Embedded
    private Address  address            = new Address();
    @Column(unique = true)
    private String   email;
    @Column
    private String   firstName;
    @Column
    private String   lastName;
    @Column
    private String   password;
    @Column
    private String   passwordHint;
    @Column
    private String   phoneNumber;
    @Column(unique = true)
    private String   username;
    @Column
    private Integer   version;
    @Column
    private String   website;
    @Column
    private String   gender;
    @Column(unique = true)
    private String   mobile;
    @JoinTable(
            name               = "UserRole",
            joinColumns        = { @JoinColumn(name = "userId") },
            inverseJoinColumns = @JoinColumn(name = "roleId")
    )
    @ManyToMany(
            fetch   = FetchType.LAZY,
            cascade = {CascadeType.REFRESH}
    )
    private Set<Role> roles              = new HashSet<Role>();
    
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "defaultRoleId")
    private Role defaultRole;
    
    @Transient
    private String fullName;

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    public void addRole(Role role) {
        getRoles().add(role);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAccountExpired() {
        return accountExpired;
    }

    public void setAccountExpired(Boolean accountExpired) {
        this.accountExpired = accountExpired;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(Boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public Boolean getCredentialsExpired() {
        return credentialsExpired;
    }

    public void setCredentialsExpired(Boolean credentialsExpired) {
        this.credentialsExpired = credentialsExpired;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    @Transient 
    public Set<GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new LinkedHashSet<GrantedAuthority>();
        authorities.addAll(roles);

        return authorities;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordHint() {
        return passwordHint;
    }

    public void setPasswordHint(String passwordHint) {
        this.passwordHint = passwordHint;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    @Transient 
    public boolean isAccountNonExpired() {
        return !getAccountExpired();
    }
    @Transient 
    public boolean isAccountNonLocked() {
        return !getAccountLocked();
    }
    @Transient 
    public boolean isCredentialsNonExpired() {
        return !getCredentialsExpired();
    }
    @Transient
    public boolean isEnabled() {
        return enabled;
    }
    @Transient
    public boolean isAdmin() {
        for (Object obj : getRoles()) {
            Role role = (Role) obj;

            if (Constants.ADMIN_ROLE.equals(role.getName())) {
                return true;
            }
        }
        return false;
    }

    public String getFullName() {
        return firstName+lastName;
    }

    public Role getDefaultRole() {
        return defaultRole;
    }

    public void setDefaultRole(Role defaultRole) {
        this.defaultRole = defaultRole;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        User user = (User) o;
        return new EqualsBuilder()
                .append(id,user.id)
                .append(username,user.username)
                .append(mobile,user.mobile)
                .append(email,user.email)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(id)
                .append(username)
                .append(mobile)
                .append(email)
                .hashCode();
        
    }
} 
