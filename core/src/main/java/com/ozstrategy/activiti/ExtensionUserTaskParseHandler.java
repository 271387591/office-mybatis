package com.ozstrategy.activiti;

import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.impl.bpmn.parser.BpmnParse;
import org.activiti.engine.impl.bpmn.parser.handler.UserTaskParseHandler;
import org.activiti.engine.impl.pvm.process.ActivityImpl;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/15/14.
 */
public class ExtensionUserTaskParseHandler extends UserTaskParseHandler {
    @Override

    protected void executeParse(BpmnParse bpmnParse, UserTask userTask) {
        super.executeParse(bpmnParse, userTask);

        ActivityImpl activity = bpmnParse.getCurrentScope().findActivity(userTask.getId());
        
        Map<String,List<ExtensionAttribute>> map= userTask.getAttributes();
        
        if(map!=null && map.size()>0){
            for(String key : map.keySet()){
                List<ExtensionAttribute> extensionAttributes=map.get(key);
                if(extensionAttributes!=null && extensionAttributes.size()>0){
                    for(ExtensionAttribute extensionAttribute : extensionAttributes){
                        activity.setProperty(extensionAttribute.getName(),extensionAttribute.getValue());
                    }
                }
            }
        }
    }
//    public Map<String,List<ExtensionAttribute>> parseUserTaskOperations(BpmnParse bpmnParse, UserTask userTask) {
//
//        Map<String,List<ExtensionAttribute>> operationMap = new HashMap<String,List<ExtensionAttribute>>();
//
//        //获取扩展属性标签元素
//
//        ExtensionElement operationsElement = userTask.getExtensionElements()
//
//                .get(ExtensionBpmnConstants.EXTENSION_ELEMENT_OPERATIONS);
//
//
//
//        if (operationsElement != null) {
//
//            for (ExtensionElement operationElement : operationsElement.getChildElements().values()) {
//
//                ExtensionOperation userTaskOperation = new ExtensionOperation(operationElement.getName());
//
//
//
//                if (operationElement != null && !operationElement.getAttributes().isEmpty()) {
//
//                    for (ExtensionAttribute attributeElement : operationElement.getAttributes().values()) {
//
//                        userTaskOperation.addProperty(attributeElement.getName(), attributeElement.getValue());
//
//                    }
//
//                }
//
//                operationMap.put(operationElement.getName(), userTaskOperation);
//
//            }
//
//        }
//
//
//
//        return operationMap;
//
//    }
}
