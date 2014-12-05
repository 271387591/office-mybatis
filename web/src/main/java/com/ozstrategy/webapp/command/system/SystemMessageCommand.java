package com.ozstrategy.webapp.command.system;

import com.ozstrategy.model.system.SystemMessage;
import com.ozstrategy.webapp.command.BaseObjectCommand;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by lihao on 12/1/14.
 */
public class SystemMessageCommand extends BaseObjectCommand {
    private Long id;
    private Long receiverId;
    private String receiverUsername;
    private String receiverFullName;
    private String content;
    private Boolean readFlag;
    private Map<String,Object> contentMap=new HashMap<String, Object>();
    private String type;
    

    public SystemMessageCommand(SystemMessage message) {
        super(message);
        this.id= message.getId();
        this.receiverId=message.getReceiver()!=null?message.getReceiver().getId():null;
        this.receiverUsername=message.getReceiver()!=null?message.getReceiver().getUsername():null;
        this.receiverFullName=message.getReceiver()!=null?message.getReceiver().getFullName():null;
        this.readFlag=message.getReadFlag();
        this.contentMap= message.getContentMap();
        this.type=message.getType().name();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverUsername() {
        return receiverUsername;
    }

    public void setReceiverUsername(String receiverUsername) {
        this.receiverUsername = receiverUsername;
    }

    public String getReceiverFullName() {
        return receiverFullName;
    }

    public void setReceiverFullName(String receiverFullName) {
        this.receiverFullName = receiverFullName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getReadFlag() {
        return readFlag;
    }

    public void setReadFlag(Boolean readFlag) {
        this.readFlag = readFlag;
    }

    public Map<String, Object> getContentMap() {
        return contentMap;
    }

    public void setContentMap(Map<String, Object> contentMap) {
        this.contentMap = contentMap;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
