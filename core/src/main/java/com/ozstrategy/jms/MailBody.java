package com.ozstrategy.jms;

import java.io.File;
import java.io.Serializable;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 11/4/13
 * Time: 5:26 PM
 * To change this template use File | Settings | File Templates.
 */
public class MailBody implements Serializable{
    private String senderEmail;
    private String senderEmailPsw;
    private String senderEmailSmtpPort;
    private String senderEmailSmtpHost;
    private String senderEmailPopPort;
    private String senderEmailPopHost;
    private String[] receiverEmail;
    private String[] copyToEmail;
    private String subject;
    private String content;
    private String sendType;
    private File[] fileAttach;
    private Date sendDate;
    private String messageId;

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderEmailPsw() {
        return senderEmailPsw;
    }

    public void setSenderEmailPsw(String senderEmailPsw) {
        this.senderEmailPsw = senderEmailPsw;
    }

    public String getSenderEmailSmtpPort() {
        return senderEmailSmtpPort;
    }

    public void setSenderEmailSmtpPort(String senderEmailSmtpPort) {
        this.senderEmailSmtpPort = senderEmailSmtpPort;
    }

    public String getSenderEmailSmtpHost() {
        return senderEmailSmtpHost;
    }

    public void setSenderEmailSmtpHost(String senderEmailSmtpHost) {
        this.senderEmailSmtpHost = senderEmailSmtpHost;
    }

    public String getSenderEmailPopPort() {
        return senderEmailPopPort;
    }

    public void setSenderEmailPopPort(String senderEmailPopPort) {
        this.senderEmailPopPort = senderEmailPopPort;
    }

    public String getSenderEmailPopHost() {
        return senderEmailPopHost;
    }

    public void setSenderEmailPopHost(String senderEmailPopHost) {
        this.senderEmailPopHost = senderEmailPopHost;
    }

    public String[] getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String[] receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String[] getCopyToEmail() {
        return copyToEmail;
    }

    public void setCopyToEmail(String[] copyToEmail) {
        this.copyToEmail = copyToEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public File[] getFileAttach() {
        return fileAttach;
    }

    public void setFileAttach(File[] fileAttach) {
        this.fileAttach = fileAttach;
    }

    public String getSendType() {
        return sendType;
    }

    public void setSendType(String sendType) {
        this.sendType = sendType;
    }

    public Date getSendDate() {
        return sendDate;
    }

    public void setSendDate(Date sendDate) {
        this.sendDate = sendDate;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
}
