package com.ozstrategy.webapp.command.login;

import com.ozstrategy.model.userrole.User;

/**
 * Created by lihao on 7/4/14.
 */
public class LoginCommand {
    private Long id;
    private String username;
    private String email;
    private String mobile;

    public LoginCommand() {
    }

    public LoginCommand(User user){
        this.id= user.getId();
        this.username= user.getUsername();
        this.email= user.getEmail();
        this.mobile= user.getMobile();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
