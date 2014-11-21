package com.ozstrategy.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxICell;
import com.mxgraph.util.mxUtils;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.Constants;
import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.TaskType;
import com.sun.org.apache.xerces.internal.dom.ParentNode;
import org.activiti.bpmn.BpmnAutoLayout;
import org.activiti.bpmn.model.ActivitiListener;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.EndEvent;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.ImplementationType;
import org.activiti.bpmn.model.MultiInstanceLoopCharacteristics;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.UserTask;
import org.activiti.editor.constants.EditorJsonConstants;
import org.activiti.editor.constants.StencilConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverterUtil;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 9/18/14.
 */
public class ActivityGraphConverter implements EditorJsonConstants, StencilConstants {
    private static ObjectMapper objectMapper = new ObjectMapper();
    public static final String PROPERTY_IS_FOR_COMPENSATION ="isforcompensation";
    public static final String TOTAL_COUNT ="totalCount";
    public static final String DEFAULT_FLOW ="defaultflow";
    public static final String CONDITIONAL_FLOW ="conditionalflow";
    public static final String TARGET ="target";
    public static final String CANDIDATE_ROLES ="candidateRoles";
    public final static String INITIATOR_EXPRESSION="starter";
    public final static String EDITOR_SHAPE_ID_PREFIX="T_";
    public final static String EDITOR_SHAPE_SUB_ID_PREFIX="SUP_";
    public final static String PROCESS_PREFIX="P_";
    public final static String TASK_TYPE="tasktype";
    public final static String TASK_ATTR="taskAttr";
    public final static String GRAPH_TYPE="type";
    public final static String GRAPH_GATEWAY="gateway";
    public final static String GRAPH_SUBPROCESS="subProcess";
    public final static String GRAPH_END="endEvent";
    public final static String TASK_COUNTERSIGN="countersign";
    public final static String TASK_COUNTERSIGN_CONDITION="${multiInstanceLoopService.canComplete(execution,nrOfInstances, nrOfActiveInstances, nrOfCompletedInstances, loopCounter)}";

    public final static String LISTENER_EVENTNAME_CREATE = "create";
    public final static String LISTENER_EVENTNAME_ASSIGNMENT = "assignment";
    public final static String LISTENER_EVENTNAME_COMPLETE = "complete";
    public final static String LISTENER_EVENTNAME_DELETE = "delete";
    public final static String LISTENER_CREATE_DELEGATEEXPRESSION = "${taskCreateService}";
    public final static String LISTENER_COMPLETE_DELEGATEEXPRESSION = "${taskCompleteService}";
    public final static String LISTENER_ENDEVENT_DELEGATEEXPRESSION = "${endEventEndService}";
    public final static String LISTENER_ENDEVENT_START = "start";
    public final static String LISTENER_ENDEVENT_END = "end";
    public final static String LISTENER_ENDEVENT_TAKE = "take";
    
    
    
    
    
    public static BpmnModel createBpmnModel(mxGraphModel graphModel) throws Exception{
        BpmnModel model = new BpmnModel();
        org.activiti.bpmn.model.Process process = new org.activiti.bpmn.model.Process();
        mxCell root=(mxCell)graphModel.getRoot();
        if(root==null) return null;
        process.setDocumentation(root.getAttribute("documentation"));
        process.setName(root.getAttribute("name"));
        process.setId(PROCESS_PREFIX+root.getAttribute("pid"));
        Map<String,Object> map = graphModel.getCells();
        if(map!=null && map.size()>0){
            for(String key : map.keySet()){
                Object obj = map.get(key);
                mxCell cell = (mxCell)obj;
                Object value=cell.getValue();
                if(value instanceof ParentNode){
                    ParentNode parentNode=(ParentNode)value;
                    String stencil=parentNode.getNodeName();
                    int edgeCount=cell.getEdgeCount();
                    if(StringUtils.equals(STENCIL_EVENT_START_NONE,stencil) && edgeCount>1){
                        throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_PROCESS_START_NODE_HAS_ONE_MORE_TASK);
                    }
                    mxCell parent=(mxCell)cell.getParent();
                    if(parent!=null && StringUtils.equals(parent.getAttribute(GRAPH_TYPE),GRAPH_SUBPROCESS)){
                        continue;
                    }
                    FlowElement element=createFlowElement(cell,stencil);
                    if(element!=null){
                        process.addFlowElement(element);
                    }
                }
            }
        }
        model.addProcess(process);
        BpmnAutoLayout bpmnAutoLayout=new BpmnAutoLayout(model);
        bpmnAutoLayout.execute();
        return model;
    }
    public static FlowElement createFlowElement(mxCell cell,String stencil){
        FlowElement element=null;
        if(StringUtils.equals(stencil, STENCIL_EVENT_START_NONE)){
            element=createStartEvent(cell);
        }else if(StringUtils.equals(stencil,STENCIL_TASK_USER)){
            element=createUserTask(cell);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_THROW_NONE)){
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_END_NONE)){
            element=createEndEvent(cell);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_BOUNDARY_ERROR)){
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_EXCLUSIVE)){
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_PARALLEL)){
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_INCLUSIVE)){
        }else if(StringUtils.equals(stencil,STENCIL_GATEWAY_EVENT)){
        }else if(StringUtils.equals(stencil,STENCIL_SUB_PROCESS)){
            element=createSubProcess(cell);
        }else if(StringUtils.equals(stencil,STENCIL_EVENT_SUB_PROCESS)){
            element=createSubProcess(cell);
        }else if(StringUtils.equals(stencil,STENCIL_SEQUENCE_FLOW)){
            element=createSequenceFlow(cell);
        }
        return element;
    }

    public static StartEvent createStartEvent(mxCell cell){
        StartEvent startEvent = new StartEvent();
        String initiator = cell.getAttribute(PROPERTY_NONE_STARTEVENT_INITIATOR);
        initiator=StringUtils.defaultIfEmpty(initiator,INITIATOR_EXPRESSION);
        startEvent.setInitiator(initiator);
        startEvent.setName(cell.getAttribute(PROPERTY_NAME));
        startEvent.setId(EDITOR_SHAPE_ID_PREFIX+cell.getId());
        startEvent.setDocumentation(cell.getAttribute(PROPERTY_DOCUMENTATION,""));
        return startEvent;
    }
    public static EndEvent createEndEvent(mxCell cell){
        EndEvent endEvent = new EndEvent();
        endEvent.setId(EDITOR_SHAPE_ID_PREFIX + cell.getId());
        endEvent.setName(cell.getAttribute(PROPERTY_NAME));
        endEvent.setDocumentation(cell.getAttribute(PROPERTY_DOCUMENTATION,""));
        mxCell parent=(mxCell)cell.getParent();
        if(!StringUtils.equals(parent.getAttribute(GRAPH_TYPE),GRAPH_SUBPROCESS)){
            List<ActivitiListener> listeners=new ArrayList<ActivitiListener>();
            ActivitiListener activitiListener=new ActivitiListener();
            activitiListener.setEvent(LISTENER_ENDEVENT_END);
            activitiListener.setImplementationType(ImplementationType.IMPLEMENTATION_TYPE_DELEGATEEXPRESSION);
            activitiListener.setImplementation(LISTENER_ENDEVENT_DELEGATEEXPRESSION);
            listeners.add(activitiListener);
            endEvent.setExecutionListeners(listeners);
        }
        return endEvent;
    }
    public static UserTask createUserTask(mxCell cell){
        UserTask userTask = new UserTask();
        userTask.setName(cell.getAttribute(PROPERTY_NAME, ""));
        userTask.setId(EDITOR_SHAPE_ID_PREFIX + cell.getId());
        userTask.setDocumentation(cell.getAttribute(PROPERTY_DOCUMENTATION,""));
        userTask.setAsynchronous(BooleanUtils.toBooleanObject(StringUtils.defaultIfEmpty(cell.getAttribute(PROPERTY_ASYNCHRONOUS),"No")));
        
        String usertaskassignment=cell.getAttribute(PROPERTY_USERTASK_ASSIGNMENT);
        Set<String> userSet=new HashSet<String>();
        if(StringUtils.isNotEmpty(usertaskassignment)){
            try {
                JsonNode jsonNode=objectMapper.readTree(usertaskassignment);
                Iterator<JsonNode> iterator=jsonNode.iterator();
                while (iterator.hasNext()){
                    JsonNode next=iterator.next();
                    if(next.size()>0){
                        String assignment_type = next.get(PROPERTY_USERTASK_ASSIGNMENT_TYPE).asText();
                        String resourceassignmentexpr=next.get(PROPERTY_USERTASK_ASSIGNMENT_EXPRESSION).asText();
                        if(StringUtils.equals(assignment_type,PROPERTY_USERTASK_ASSIGNEE)){
                            userTask.setAssignee(resourceassignmentexpr);
                        }else if(StringUtils.equals(assignment_type,PROPERTY_USERTASK_CANDIDATE_USERS) || StringUtils.equals(assignment_type,CANDIDATE_ROLES)){
                            String[] strings=resourceassignmentexpr.split(",");
                            List<String> users = Arrays.asList(strings);
                            userSet.addAll(users);
                        }
                    }
                }
            } catch (IOException e) {
            }
        }
        List<String> userList=new ArrayList<String>();
        userList.addAll(userSet);
        userTask.setCandidateUsers(userList);
        
        String countersign=cell.getAttribute(TASK_TYPE);
        if(StringUtils.isNotEmpty(countersign) && StringUtils.equals(countersign, TaskType.Countersign.name())){
            MultiInstanceLoopCharacteristics multiInstanceLoopCharacteristics=new MultiInstanceLoopCharacteristics();
            multiInstanceLoopCharacteristics.setCompletionCondition(TASK_COUNTERSIGN_CONDITION);
            multiInstanceLoopCharacteristics.setInputDataItem("${signAssignee_"+userTask.getId()+"}");
            multiInstanceLoopCharacteristics.setElementVariable("signAssignee_"+userTask.getId());
            userTask.setLoopCharacteristics(multiInstanceLoopCharacteristics);
            String preAssignee=userTask.getAssignee();
            if(StringUtils.isNotEmpty(preAssignee)){
                userList.add(preAssignee);
                userTask.setCandidateUsers(userList);
            }
            userTask.setAssignee("${signAssignee_"+userTask.getId()+"}");
        }else if(!StringUtils.equals(countersign,TaskType.Starter.name())){
            List<ActivitiListener> listeners=new ArrayList<ActivitiListener>();
            //add create listener
            ActivitiListener activitiListener=new ActivitiListener();
            activitiListener.setEvent(LISTENER_EVENTNAME_CREATE);
            activitiListener.setImplementationType(ImplementationType.IMPLEMENTATION_TYPE_DELEGATEEXPRESSION);
            activitiListener.setImplementation(LISTENER_CREATE_DELEGATEEXPRESSION);
            listeners.add(activitiListener);
            userTask.setTaskListeners(listeners);
        }
        
        
        String forms=cell.getAttribute(PROPERTY_FORM_PROPERTIES, "");
        if(StringUtils.isNotEmpty(forms)){
            try {
                JsonNode jsonNode = objectMapper.readTree(forms);
                if(jsonNode!=null && jsonNode.size()>0){
                    JsonNode items = jsonNode.get("items");
                    if(items!=null){
                        List<Map<String,Object>> list = objectMapper.readValue(items.toString(),List.class);
                        List<FormProperty> formProperties=new ArrayList<FormProperty>();
                        if(list!=null && list.size()>0){
                            for(Map<String,Object> map : list){
                                FormProperty formProperty=new FormProperty();
                                formProperty.setName(ObjectUtils.toString(map.get("formproperty_name")));
                                formProperty.setId(ObjectUtils.toString(map.get("formproperty_id")));
                                formProperty.setType(ObjectUtils.toString(map.get("formproperty_type")));
                                formProperty.setExpression(ObjectUtils.toString(map.get("formproperty_expression")));
                                formProperty.setVariable(ObjectUtils.toString(map.get("formproperty_variable")));
                                formProperty.setRequired(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("formproperty_required"))));
                                formProperty.setReadable(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("formproperty_readable"))));
                                formProperty.setWriteable(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("formproperty_writeable"))));
                                formProperties.add(formProperty);
                            }
                        }
                        userTask.setFormProperties(formProperties);
                    }
                }
            } catch (IOException e) {

            }
        }
        return userTask;
    }
    public static SequenceFlow createSequenceFlow(mxCell cell){
        SequenceFlow flow = new SequenceFlow();
        flow.setName(cell.getAttribute(PROPERTY_NAME, ""));
        flow.setId(EDITOR_SHAPE_ID_PREFIX + cell.getId());
        flow.setDocumentation(cell.getAttribute(PROPERTY_DOCUMENTATION,""));
        flow.setConditionExpression(cell.getAttribute(PROPERTY_SEQUENCEFLOW_CONDITION, ""));
        mxCell source = (mxCell)cell.getSource();
        if(source!=null){
            if(StringUtils.equals(source.getAttribute(GRAPH_TYPE),GRAPH_SUBPROCESS)){
                flow.setSourceRef(EDITOR_SHAPE_SUB_ID_PREFIX+source.getId());
            }else{
                flow.setSourceRef(EDITOR_SHAPE_ID_PREFIX+source.getId());
            }
            
        }
        mxCell target=(mxCell)cell.getTarget();
        if(target!=null){
            if(StringUtils.equals(target.getAttribute(GRAPH_TYPE),GRAPH_SUBPROCESS)){
                flow.setTargetRef(EDITOR_SHAPE_SUB_ID_PREFIX+target.getId());
            }else{
                flow.setTargetRef(EDITOR_SHAPE_ID_PREFIX+target.getId());
            }
        }
        return flow;
    }
    public static SubProcess createSubProcess(mxCell cell){
        SubProcess subProcess=new SubProcess();
        subProcess.setName(cell.getAttribute(PROPERTY_NAME));
        subProcess.setDocumentation(cell.getAttribute(PROPERTY_DOCUMENTATION));
        subProcess.setId(EDITOR_SHAPE_SUB_ID_PREFIX+cell.getId());
        int count=cell.getChildCount();
        for(int i=0;i<count;i++){
            mxCell child=(mxCell)cell.getChildAt(i);
            Object value=child.getValue();
            if(value instanceof ParentNode) {
                ParentNode parentNode = (ParentNode) value;
                String stencil=parentNode.getNodeName();
                FlowElement element=createFlowElement(child,stencil);
                if(element!=null){
                    subProcess.addFlowElement(element);
                }
            }
        }
        return subProcess;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    public static ObjectNode createProcess(mxGraphModel graphModel,ProcessDef def) throws Exception{
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
                    int edgeCount=cell.getEdgeCount();
                    if(StringUtils.equals(STENCIL_EVENT_START_NONE,stencil) && edgeCount>1){
                        throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_PROCESS_START_NODE_HAS_ONE_MORE_TASK);
                    }
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
        String initiator = cell.getAttribute(PROPERTY_NONE_STARTEVENT_INITIATOR);
        initiator=StringUtils.defaultIfEmpty(initiator,INITIATOR_EXPRESSION);
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
    public static String toMxGraphModelXml(mxGraphModel model){
        mxCodec codec = new mxCodec();
        Node node = codec.encode(model);
        String xml = mxUtils.getPrettyXml(node);
        return xml;
    }
    
    
}
