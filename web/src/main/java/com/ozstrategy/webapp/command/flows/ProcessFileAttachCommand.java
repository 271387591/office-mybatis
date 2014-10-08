package com.ozstrategy.webapp.command.flows;

import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.webapp.command.CreatorObjcetCommand;

/**
 * Created by lihao on 9/28/14.
 */
public class ProcessFileAttachCommand extends CreatorObjcetCommand {
    private Long id;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private Long instanceId;
    private Integer fileIndex;

    public ProcessFileAttachCommand(ProcessFileAttach attach) {
        super(attach);
        this.id=attach.getId();
        this.fileName=attach.getFileName();
        this.filePath= attach.getFilePath();
        this.fileSize= attach.getFileSize();
        this.instanceId=attach.getInstance()!=null?attach.getInstance().getId():null;
        this.fileIndex=attach.getFileIndex();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Long getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(Long instanceId) {
        this.instanceId = instanceId;
    }

    public Integer getFileIndex() {
        return fileIndex;
    }

    public void setFileIndex(Integer fileIndex) {
        this.fileIndex = fileIndex;
    }
}
