package com.ozstrategy.model.flows;

/**
 * Created by lihao on 9/15/14.
 */
public enum  ProcessElementType {
    SequenceFlow("SequenceFlow"),
    StartNoneEvent("StartEvent"),
    UserTask("UserTask"),
    EndNoneEvent("EndEvent");
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
    static public String get(String name){
        ProcessElementType[] types=ProcessElementType.values();
        for(ProcessElementType type : types){
            if(type.getName().equals(name)){
                return type.name();
            }
        }
        return null;
    }
}
