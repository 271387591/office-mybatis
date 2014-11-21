package com.ozstrategy.model.system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.model.BaseObject;
import com.ozstrategy.model.userrole.User;
import org.apache.commons.lang.StringUtils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lihao on 11/6/14.
 */
@Entity
@Table(name = "SYSTEMMESSAGE")
public class SystemMessage extends BaseObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "receiverId",nullable = false)
    private User receiver;
    @Column(nullable = false,columnDefinition = "char",length = 1)
    private Boolean readFlag=Boolean.FALSE;
    @Column(nullable = false,length = 4000)
    private String content;
    @Transient
    private Map<String,Object> contentMap=new HashMap<String, Object>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public Boolean getReadFlag() {
        return readFlag;
    }

    public void setReadFlag(Boolean readFlag) {
        this.readFlag = readFlag;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Map<String, Object> getContentMap() {
        if(StringUtils.isNotEmpty(content)){
            try {
                contentMap=(Map<String, Object>)new ObjectMapper().readValue(content,Map.class);
            } catch (IOException e) {
            }
        }
        return contentMap;
    }
    
}
