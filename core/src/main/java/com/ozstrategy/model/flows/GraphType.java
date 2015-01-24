package com.ozstrategy.model.flows;

/**
 * Created by lihao on 10/23/14.
 */
public enum GraphType {
    SequenceFlow("SequenceFlow"),
    StartNoneEvent("StartEvent"),
    UserTask("UserTask"),
    EndNoneEvent("EndEvent"),
    SubProcess("SubProcess");
    private String name;
    private GraphType(String name){
        this.name=name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    static public String get(String name){
        GraphType[] types=GraphType.values();
        for(GraphType type : types){
            if(type.getName().equals(name)){
                return type.name();
            }
        }
        return null;
    }
}
