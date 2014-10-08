package com.ozstrategy.model.flows;

import com.ozstrategy.model.CreatorObject;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Created by lihao on 9/27/14.
 */
@Entity
public class ProcessFileAttach extends CreatorObject{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;             
    @Column
    private String fileName;
    @Column
    private String filePath;
    @Column
    private Long fileSize;
    @ManyToOne
    @JoinColumn(name = "instanceId")
    private TaskInstance instance;
    @Column
    private Integer fileIndex;

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

    public TaskInstance getInstance() {
        return instance;
    }

    public void setInstance(TaskInstance instance) {
        this.instance = instance;
    }

    public Integer getFileIndex() {
        return fileIndex;
    }

    public void setFileIndex(Integer fileIndex) {
        this.fileIndex = fileIndex;
    }
}