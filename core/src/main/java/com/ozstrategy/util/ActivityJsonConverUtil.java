package com.ozstrategy.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxICell;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.model.flows.ProcessDef;
import com.sun.org.apache.xerces.internal.dom.ParentNode;
import org.activiti.editor.constants.EditorJsonConstants;
import org.activiti.editor.constants.StencilConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverterUtil;
import org.apache.commons.lang.StringUtils;
import org.w3c.dom.Document;

import java.io.IOException;
import java.util.Map;

/**
 * Created by lihao on 9/18/14.
 */
public class ActivityJsonConverUtil implements EditorJsonConstants, StencilConstants {
    private static ObjectMapper objectMapper = new ObjectMapper();
    public static final String PROPERTY_IS_FOR_COMPENSATION ="isforcompensation";
    public static final String TOTAL_COUNT ="totalCount";
    public static final String DEFAULT_FLOW ="defaultflow";
    public static final String CONDITIONAL_FLOW ="conditionalflow";
    public static final String TARGET ="target";
    public static final String CANDIDATE_ROLES ="candidateRoles";
    public final static String INITIATOR_EXPRESSION="${initiator}";
    public final static String EDITOR_SHAPE_ID_PREFIX="T_";
    public static ObjectNode createProcess(mxGraphModel graphModel,ProcessDef def){
        ObjectNode modelNode=createProcess(def);
        ArrayNode shapesArrayNode = objectMapper.createArrayNode();
        Map<String,Object> map = graphModel.getCells();
        if(map!=null && map.size()>0){
            for(String key : map.keySet()){
                Object obj = map.get(key);
                mxCell cell = (mxCell)obj;
                Object value=cell.getValue();
                if(value instanceof ParentNode){
                    ParentNode parentNode=(ParentNode)value;
                    String stencil=parentNode.getNodeName();
                    if(!cell.isEdge()){
                        ObjectNode node= createStencil(cell,stencil,false);
                        if(node!=null){
                            shapesArrayNode.add(node);
                        }
                    }else{
                        ObjectNode node= SequenceFlow(cell);
                        if(node!=null){
                            shapesArrayNode.add(node);
                        }
                    }
                }
            }
        }
        modelNode.put(EDITOR_CHILD_SHAPES,shapesArrayNode);
        return modelNode;
    }
    public static ObjectNode createProcess(ProcessDef def){
        ObjectNode modelNode = objectMapper.createObjectNode();
        modelNode.put("bounds", BpmnJsonConverterUtil.createBoundsNode(1485, 1050, 0, 0));
        modelNode.put("resourceId", "canvas");
        ObjectNode stencilNode = objectMapper.createObjectNode();
        stencilNode.put("id", "BPMNDiagram");
        modelNode.put("stencil", stencilNode);
        ObjectNode stencilsetNode = objectMapper.createObjectNode();
        stencilsetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
        stencilsetNode.put("url", "../editor/stencilsets/bpmn2.0/bpmn2.0.json");
        modelNode.put("stencilset", stencilsetNode);

        ObjectNode propertiesNode = objectMapper.createObjectNode();
        if (def.getId()!=null) {
            propertiesNode.put(PROPERTY_PROCESS_ID, "process_"+def.getId());
        }
        if (StringUtils.isNotEmpty(def.getName())) {
            propertiesNode.put(PROPERTY_NAME, def.getName());
        }
        propertiesNode.put(PROPERTY_PROCESS_EXECUTABLE, PROPERTY_VALUE_YES);

        propertiesNode.put(PROPERTY_PROCESS_NAMESPACE, "");

        if (StringUtils.isNotEmpty(def.getDocumentation())) {
            propertiesNode.put(PROPERTY_DOCUMENTATION, def.getDocumentation());
        }
        modelNode.put(EDITOR_SHAPE_PROPERTIES, propertiesNode);
        ArrayNode shapesArrayNode = objectMapper.createArrayNode();
        modelNode.put(EDITOR_CHILD_SHAPES,shapesArrayNode);
        return modelNode;
    }
    public static ObjectNode createFlowElements(mxCell cell,String stencil,boolean subProcess){
        ObjectNode objectNode=null;
        if(cell.isEdge()){
            objectNode=SequenceFlow(cell);
        }else {
            objectNode=createStencil(cell,stencil,subProcess);
        }
        return objectNode;
    }
    private static ObjectNode createStencil(mxCell cell,String stencil,boolean subProcess){
        ObjectNode objectNode=null;
        mxICell parent = cell.getParent();
        if(cell.isEdge()){
            return objectNode;
        }
        if(subProcess && parent!=null && !(parent.getValue() instanceof ParentNode)){
            return objectNode;
        }
        if(!subProcess && parent!=null && (parent.getValue() instanceof ParentNode)){
            return objectNode;
        }
        
        if(StringUtils.equals(stencil, STENCIL_EVENT_START_NONE)){
            objectNode=StartNoneEvent(cell);
        }else if(StringUtils.equals(stencil,STENCIL_TASK_USER)){
            objectNode=UserTask(cell);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_THROW_NONE)){
            objectNode=ThrowNoneEvent(cell, stencil);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_END_NONE)){
            objectNode=ThrowNoneEvent(cell,stencil);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_BOUNDARY_ERROR)){
            objectNode=BoundaryErrorEvent(cell, stencil);
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_EXCLUSIVE)){
            objectNode=Gateway(cell, stencil);
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_PARALLEL)){
            objectNode=Gateway(cell,stencil);
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_INCLUSIVE)){
            objectNode=Gateway(cell,stencil);
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_EVENT)){
            objectNode=Gateway(cell,stencil);
        }else if(StringUtils.equals(stencil,STENCIL_SUB_PROCESS)){
            objectNode=SubProcess(cell);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_SUB_PROCESS)){
            objectNode=SubProcess(cell);
        }
        return objectNode;
    }
    public static ObjectNode SubProcess(mxCell cell){
        ObjectNode node=Activity(cell, STENCIL_SUB_PROCESS);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_ASYNCHRONOUS, cell.getAttribute(PROPERTY_ASYNCHRONOUS, "No"))
                .put(PROPERTY_EXCLUSIVE, cell.getAttribute(PROPERTY_EXCLUSIVE, "Yes"))
                .put(PROPERTY_MULTIINSTANCE_LOOP_TYPE, cell.getAttribute(PROPERTY_MULTIINSTANCE_LOOP_TYPE, "None"))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""));
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        
        ArrayNode children=objectMapper.createArrayNode();
        int count=cell.getChildCount();
        for(int i=0;i<count;i++){
            mxCell child = (mxCell)cell.getChildAt(i);
            Object value=child.getValue();
            if(value instanceof ParentNode){
                ParentNode parentNode=(ParentNode)value;
                String cStencil=parentNode.getNodeName();
                ObjectNode cNode=createStencil(child,cStencil,true);
                if(cNode!=null){
                    children.add(cNode);
                }
            }
        }
        node.put(EDITOR_CHILD_SHAPES,children);    
        return node;
    }
    public static ObjectNode Gateway(mxCell cell,String stencil){
        ObjectNode node=Activity(cell, stencil);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""));
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
    
    public static ObjectNode SequenceFlow(mxCell cell){
        ObjectNode node=Activity(cell, STENCIL_SEQUENCE_FLOW);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""))
                .put(DEFAULT_FLOW, cell.getAttribute(DEFAULT_FLOW, "None"))
                .put(CONDITIONAL_FLOW, cell.getAttribute(CONDITIONAL_FLOW, "None"))
                .put(PROPERTY_SEQUENCEFLOW_CONDITION, cell.getAttribute(PROPERTY_SEQUENCEFLOW_CONDITION, ""));
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
    
    public static ObjectNode BoundaryErrorEvent(mxCell cell,String stencil){
        ObjectNode node=Activity(cell, stencil);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""))
                .put(PROPERTY_ERRORREF, cell.getAttribute(PROPERTY_ERRORREF, ""));
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
    
    public static ObjectNode ThrowNoneEvent(mxCell cell,String stencil){
        ObjectNode node=Activity(cell, stencil);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""))
                .put(PROPERTY_EXECUTION_LISTENERS, cell.getAttribute(PROPERTY_EXECUTION_LISTENERS, ""));
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
    
    public static ObjectNode UserTask(mxCell cell){
        ObjectNode node=Activity(cell, STENCIL_TASK_USER);
        ObjectNode properties=objectMapper.createObjectNode();
        properties
                .put(PROPERTY_OVERRIDE_ID,cell.getAttribute(PROPERTY_OVERRIDE_ID,""))
                .put(PROPERTY_NAME, cell.getAttribute(PROPERTY_NAME, ""))
                .put(PROPERTY_DOCUMENTATION, cell.getAttribute(PROPERTY_DOCUMENTATION, ""))
                .put(PROPERTY_FORM_PROPERTIES, cell.getAttribute(PROPERTY_FORM_PROPERTIES, ""))
                .put(PROPERTY_FORMKEY, cell.getAttribute(PROPERTY_FORMKEY, ""))
                .put(PROPERTY_EXECUTION_LISTENERS, cell.getAttribute(PROPERTY_EXECUTION_LISTENERS, ""))
                .put(PROPERTY_DUEDATE, cell.getAttribute(PROPERTY_DUEDATE, ""))
                .put(PROPERTY_TASK_LISTENERS, cell.getAttribute(PROPERTY_TASK_LISTENERS, ""))
                .put(PROPERTY_ASYNCHRONOUS, cell.getAttribute(PROPERTY_ASYNCHRONOUS, "No"))
                .put(PROPERTY_EXCLUSIVE, cell.getAttribute(PROPERTY_EXCLUSIVE, "Yes"))
                .put(PROPERTY_MULTIINSTANCE_LOOP_TYPE, cell.getAttribute(PROPERTY_MULTIINSTANCE_LOOP_TYPE, "None"))
                .put(PROPERTY_MULTIINSTANCE_SEQUENTIAL, cell.getAttribute(PROPERTY_MULTIINSTANCE_SEQUENTIAL, "Yes"))
                .put(PROPERTY_MULTIINSTANCE_CARDINALITY, cell.getAttribute(PROPERTY_MULTIINSTANCE_CARDINALITY, ""))
                .put(PROPERTY_MULTIINSTANCE_CONDITION,cell.getAttribute(PROPERTY_MULTIINSTANCE_CONDITION,""))
                .put(PROPERTY_MULTIINSTANCE_COLLECTION,cell.getAttribute(PROPERTY_MULTIINSTANCE_COLLECTION,""))
                .put(PROPERTY_MULTIINSTANCE_VARIABLE,cell.getAttribute(PROPERTY_MULTIINSTANCE_VARIABLE,""))
                .put(PROPERTY_IS_FOR_COMPENSATION,cell.getAttribute(PROPERTY_IS_FOR_COMPENSATION,"false"));
        ObjectNode usertaskassignment=objectMapper.createObjectNode();
        ArrayNode items = objectMapper.createArrayNode();
        String assignee= cell.getAttribute(PROPERTY_USERTASK_ASSIGNEE,"");
        if(StringUtils.isNotEmpty(assignee)){
            try {
                JsonNode assigneeNode = objectMapper.readTree(assignee);
                items.add(assigneeNode);
            } catch (IOException e) {
            }
        }
        String candidateUsers= cell.getAttribute(PROPERTY_USERTASK_CANDIDATE_USERS,"");
        if(StringUtils.isNotEmpty(assignee)){
            try {
                JsonNode candidateUsersNode = objectMapper.readTree(candidateUsers);
                items.add(candidateUsersNode);
            } catch (IOException e) {
            }
        }
        String candidateGroups= cell.getAttribute(PROPERTY_USERTASK_CANDIDATE_GROUPS,"");
        if(StringUtils.isNotEmpty(assignee)){
            try {
                JsonNode candidateGroupsNode = objectMapper.readTree(candidateGroups);
                items.add(candidateGroupsNode);
            } catch (IOException e) {
            }
        }
        usertaskassignment.put(TOTAL_COUNT,items.size()).put(EDITOR_PROPERTIES_GENERAL_ITEMS,items);
        properties.put(PROPERTY_USERTASK_ASSIGNMENT,usertaskassignment);
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
   
    public static ObjectNode StartNoneEvent(mxCell cell){
        ObjectNode node=Activity(cell,STENCIL_EVENT_START_NONE);
        ObjectNode properties=objectMapper.createObjectNode();
        String initiator = cell.getAttribute(PROPERTY_NONE_STARTEVENT_INITIATOR,INITIATOR_EXPRESSION);
        properties.put(PROPERTY_NONE_STARTEVENT_INITIATOR,initiator);
        String overrideid = cell.getAttribute(PROPERTY_OVERRIDE_ID,"");
        properties.put(PROPERTY_OVERRIDE_ID,overrideid);
        String name = cell.getAttribute(PROPERTY_NAME,"");
        properties.put(PROPERTY_NAME,name);
        String documentation = cell.getAttribute(PROPERTY_DOCUMENTATION,"");
        properties.put(PROPERTY_DOCUMENTATION,documentation);
        String formproperties = cell.getAttribute(PROPERTY_FORM_PROPERTIES,"");
        properties.put(PROPERTY_FORM_PROPERTIES,formproperties);
        String formkeydefinition = cell.getAttribute(PROPERTY_FORMKEY,"");
        properties.put(PROPERTY_FORMKEY,formkeydefinition);
        String executionlisteners = cell.getAttribute(PROPERTY_EXECUTION_LISTENERS,"");
        properties.put(PROPERTY_EXECUTION_LISTENERS,executionlisteners);
        node.put(EDITOR_SHAPE_PROPERTIES,properties);
        return node;
    }
    public static ObjectNode Activity(mxCell cell,String stencil){
        ObjectNode node = objectMapper.createObjectNode();
        node.put(EDITOR_SHAPE_ID,EDITOR_SHAPE_ID_PREFIX+cell.getId());
        ObjectNode stencilNode = objectMapper.createObjectNode();
        stencilNode.put(EDITOR_STENCIL_ID,stencil);
        node.put(EDITOR_STENCIL,stencilNode);
        node.put(EDITOR_DOCKERS,objectMapper.createArrayNode());
        if(cell.isVertex()){
            int edgeCount = cell.getEdgeCount();
            ArrayNode outgoing=objectMapper.createArrayNode();
            for(int i=0;i<edgeCount;i++){
                mxCell edge=(mxCell)cell.getEdgeAt(i);
                mxCell target = (mxCell)edge.getTarget();
                if(target!=null && target.getId().equals(cell.getId()) ){
                    continue;
                }
                ObjectNode edgeObj=objectMapper.createObjectNode();
                edgeObj.put(EDITOR_SHAPE_ID,EDITOR_SHAPE_ID_PREFIX+edge.getId());
                outgoing.add(edgeObj);
//                
            }
            node.put(EDITOR_OUTGOING,outgoing);
        }else if(cell.isEdge()){
            ArrayNode outgoing=objectMapper.createArrayNode();
            mxCell target=(mxCell)cell.getTarget();
            if(target!=null){
                ObjectNode edgeObj=objectMapper.createObjectNode();
                edgeObj.put(EDITOR_SHAPE_ID,EDITOR_SHAPE_ID_PREFIX+target.getId());
                outgoing.add(edgeObj);
                node.put(TARGET,edgeObj);
            }
            node.put(EDITOR_OUTGOING,outgoing);
            ArrayNode dockers=objectMapper.createArrayNode();
            ObjectNode item1=objectMapper.createObjectNode();
            item1.put("x",50.0);
            item1.put("y",30.0);
            dockers.add(item1);
            ObjectNode item2=objectMapper.createObjectNode();
            item2.put("x",192.0);
            item2.put("y",30.0);
            dockers.add(item2);
            node.put(EDITOR_DOCKERS,dockers);
        }
        double upperLeftX=cell.getGeometry().getX();
        double upperLeftY=cell.getGeometry().getY();
        double lowerRightX=upperLeftX+cell.getGeometry().getWidth();
        double lowerRightY=upperLeftY+cell.getGeometry().getHeight();
        node.put(EDITOR_BOUNDS, BpmnJsonConverterUtil.createBoundsNode(lowerRightX,lowerRightY,upperLeftX,upperLeftY));
        node.put(EDITOR_CHILD_SHAPES,objectMapper.createArrayNode());
        node.put(EDITOR_SHAPE_PROPERTIES,objectMapper.createObjectNode());
        return node;
    }
    public static mxGraphModel getMxGraphModel(String gxml){
        mxCodec codec = new mxCodec();
        Document doc = mxXmlUtils.parseXml(gxml);
        codec = new mxCodec(doc);
        mxGraphModel model = (mxGraphModel) codec.decode(doc.getDocumentElement());
        return model;
    }
    
}
