package com.ozstrategy.model.flows;

/**
 * Created by lihao on 9/15/14.
 */
public enum  ProcessElementType {
    StartNoneEvent("StartEvent"),UserTask("UserTask");
    private String name;
    private ProcessElementType(String name){
        this.name=name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
