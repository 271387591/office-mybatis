package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGraphModel;
import com.ozstrategy.Constants;
import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessDefVersionDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessElementFormDao;
import com.ozstrategy.dao.forms.FormFieldDao;
import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.GraphType;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefHasType;
import com.ozstrategy.model.flows.ProcessDefVersion;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessElementForm;
import com.ozstrategy.model.flows.ProcessElementType;
import com.ozstrategy.model.flows.TaskType;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.util.ActivityGraphConverter;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.MultiInstanceLoopCharacteristics;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.SubProcess;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 9/10/14.
 */
@Service("processDefManager")
public class ProcessDefManagerImpl implements ProcessDefManager {
    private ObjectMapper objectMapper=new ObjectMapper();
    @Autowired
    private ProcessDefDao processDefDao;
    @Autowired
    private ProcessElementDao processElementDao;
    @Autowired
    private FormFieldDao formFieldDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private RoleDao roleDao;
    @Autowired
    private ProcessElementFormDao processElementFormDao;
    @Autowired
    private ProcessDefVersionDao processDefVersionDao;
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    private RuntimeService runtimeService;
    
    
    public List<ProcessDef> listProcessDefs(Map<String, Object> map, Integer start, Integer limit) {
        return processDefDao.listProcessDefs(map,new RowBounds(start,limit));
    }

    public List<ProcessDef> listAllProcessDefs() {
        return processDefDao.listProcessDefs(new HashMap<String, Object>(),RowBounds.DEFAULT);
    }

    public Integer listProcessDefsCount(Map<String, Object> map) {
        return processDefDao.listProcessDefsCount(map);
    }

    public void saveOrUpdate(ProcessDef processDef) {

    }

    public void delete(Long id) {
        processDefDao.deleteProcessDef(id);
    }

    public ProcessDef getProcessDefByName(String name, Long typeId) {
        return processDefDao.getProcessDefByName(name,typeId);
    }

    public Long checkNameExist(String name, Long typeId) {
        return processDefDao.checkNameExist(name,typeId);
    }

    public ProcessDef getProcessDefById(Long id) {
        return processDefDao.getProcessDefById(id);
    }

    public ProcessDef getProcessDefByActDefId(String actDefId) {
        return processDefDao.getProcessDefByActId(actDefId);
    }

    @Transactional(rollbackFor = {Throwable.class})
    public void save(ProcessDef processDef) {
        processDefDao.saveProcessDef(processDef);
    }

    @Transactional(rollbackFor = {Throwable.class})
    public void update(ProcessDef processDef,String graRes) throws IOException,Exception {
        if(StringUtils.isNotEmpty(graRes)){
            mxGraphModel graphModel= ActivityGraphConverter.getMxGraphModel(graRes);
            BpmnModel model = ActivityGraphConverter.createBpmnModel(graphModel);
            List<Process> processes=model.getProcesses();
            if(processes!=null && processes.size()>0){
                Process process = processes.get(0);
                processElementFormDao.deleteProcessElementFormByDefId(processDef.getId());
                Set<ProcessElement> processElements=processDef.getElements();
                if(processElements!=null && processElements.size()>0){
                    for(ProcessElement processElement : processElements){
                        processElementDao.deleteProcessElementUserById(processElement.getId());
                    }
                }
                processElementDao.deleteProcessElementByDefId(processDef.getId());
                processDef.setHasType(ProcessDefHasType.Common);
                Collection<FlowElement> elements = process.getFlowElements();
                if(elements!=null && elements.size()>0){
                    for(FlowElement element : elements){
                        parseElements(processDef,graphModel,element);
                    }
                }
            }
            if(StringUtils.isNotEmpty(processDef.getGraphResId())){
                repositoryService.deleteDeployment(processDef.getGraphResId());
            }
            Deployment deployment=repositoryService.createDeployment().addString(processDef.getGraRes(),graRes).deploy();
            processDef.setGraphResId(deployment.getId());
        }
        processDef.setActResId(null);
        processDef.setActDefId(null);
        processDefDao.updateProcessDef(processDef);
    }
    private void parseElements(ProcessDef processDef,mxGraphModel graphModel,FlowElement element) throws Exception{
        String name=element.getName();
        String id=element.getId();
        String type=element.getClass().getSimpleName();
        ProcessElement processElement=new ProcessElement();
        processElement.setLabel(name);
        processElement.setTaskKey(id);
        processElement.setActClass(type);
        processElement.setProcessDef(processDef);
        processElement.setGraphType(GraphType.get(type));
        mxCell cell = (mxCell)graphModel.getCell(id.substring(2));
//        processElement.setPreTaskKeys(getPreNextTask(cell,false));
//        processElement.setNextTaskKeys(getPreNextTask(cell,true));
        processElementDao.saveProcessElement(processElement);
        if(StringUtils.equals(ProcessElementType.StartNoneEvent.getName(),type)){
            StartEvent startEvent=(StartEvent)element;
            List<FormProperty> properties = startEvent.getFormProperties();
            insertProcessElementForm(processDef, processElement, properties);
        }else if(StringUtils.equals(ProcessElementType.SubProcess.getName(),type)){
            SubProcess subProcess=(SubProcess)element;
            Collection<FlowElement> flowElements=subProcess.getFlowElements();
            processDef.setHasType(ProcessDefHasType.HasSub);
            if(flowElements!=null && flowElements.size()>0){
                for(FlowElement flowElement : flowElements){
                    parseElements(processDef,graphModel,flowElement);
                }
            }
        }else if(StringUtils.equals(ProcessElementType.UserTask.getName(),type)){
            UserTask userTask=(UserTask)element;
            List<FormProperty> properties = userTask.getFormProperties();
            insertProcessElementForm(processDef, processElement, properties);
            
            List<String> usernames=userTask.getCandidateUsers();
            if(usernames==null){
                usernames=new ArrayList<String>();
            }
            String assignee=userTask.getAssignee();
            if(StringUtils.isNotEmpty(assignee) && assignee.contains("$")){
                usernames.add(assignee);
            }
            saveElementUser(usernames,processElement);
            String taskType=StringUtils.defaultIfEmpty(cell.getAttribute(ActivityGraphConverter.TASK_TYPE), TaskType.CommonUser.name());
            if(StringUtils.equals(taskType,TaskType.Countersign.name())){
                String countersign=cell.getAttribute(ActivityGraphConverter.TASK_COUNTERSIGN);
                try{
                    Map<String,Object> newMap=new HashMap<String, Object>();
                    Map<String,Object> map = objectMapper.readValue(countersign,Map.class);
                    for(String key:map.keySet()){
                        String newKey=key+"_"+userTask.getId();
                        newMap.put(newKey,map.get(key));
                    }
                    MultiInstanceLoopCharacteristics characteristics = userTask.getLoopCharacteristics();
                    if(characteristics!=null){
                        String elementVariable = characteristics.getElementVariable();
                        List<String> candidateUsers=userTask.getCandidateUsers();
                        newMap.put(elementVariable,candidateUsers);
                    }
                    String str=objectMapper.writeValueAsString(newMap);
                    processElement.setCountersign(str);
                }catch (Exception e){
                }
                processDef.setHasType(ProcessDefHasType.HasSign);
            }
            processElement.setTaskType(TaskType.valueOf(taskType));
            
            int count=cell.getEdgeCount();
            for(int i=0;i<count;i++){
                mxCell edge=(mxCell)cell.getEdgeAt(i);
                mxCell source=(mxCell)edge.getSource();
                mxCell target=(mxCell)edge.getTarget();
                mxCell parent=(mxCell)edge.getParent();
                if(source.getId().equals(cell.getId()) && StringUtils.equals(target.getAttribute(ActivityGraphConverter.GRAPH_TYPE),ActivityGraphConverter.GRAPH_END) && !StringUtils.equals(parent.getAttribute(ActivityGraphConverter.GRAPH_TYPE,""),ActivityGraphConverter.GRAPH_SUBPROCESS)){
                    processElement.setEndTask(Boolean.TRUE);
                }
            }
            processElementDao.updateProcessElement(processElement);
        }
        
    }
    private void saveElementUser(List<String> usernames,ProcessElement processElement){
        if(usernames!=null && usernames.size()>0){
            for(String username : usernames){
                User user=userDao.getUserByUsername(username);
                if(user!=null){
                    processElementDao.saveProcessElementUser(user.getId(),processElement.getId());
                }
            }
        }
    }
    private String getPreNextTask(mxCell cell,boolean next){
        List<String> task=new ArrayList<String>();
        getPreNextTask(cell,task,next);
        Iterator<String> iterator = task.iterator();
        return StringUtils.join(iterator, ",");
    }
    private void getPreNextTask(mxCell cell,List<String> task,boolean next){
        if(cell==null || cell.isEdge())return;
        int count = cell.getEdgeCount();
        for(int i=0;i<count;i++){
            mxCell edge=(mxCell)cell.getEdgeAt(i);
            mxCell source=(mxCell)edge.getSource();
            mxCell target=(mxCell)edge.getTarget();
            mxCell preNext=null;
            if(next){
                if(target!=null && target.getId().equals(cell.getId())){
                    continue;
                }
                preNext=target;
            }else{
                if(source!=null && source.getId().equals(cell.getId())){
                    continue;
                }
                preNext=source;
            }
            if(preNext==null)return;
            
//            if(StringUtils.equals(preNext.getAttribute(ActivityGraphConverter.GRAPH_TYPE),ActivityGraphConverter.GRAPH_SUBPROCESS)){
//                int childCount=cell.getChildCount();
//                for(int j=0;j<childCount;j++){
//                    mxCell child=(mxCell)cell.getChildAt(j);
//                    getPreNextTask(child,task,next);
//                }
//            }
            
            if(StringUtils.equals(preNext.getAttribute(ActivityGraphConverter.GRAPH_TYPE),ActivityGraphConverter.GRAPH_GATEWAY) 
                    || StringUtils.equals(preNext.getAttribute(ActivityGraphConverter.GRAPH_TYPE),ActivityGraphConverter.GRAPH_SUBPROCESS)){
                getPreNextTask(preNext, task, next);
            }else{
                task.add(ActivityGraphConverter.EDITOR_SHAPE_ID_PREFIX+preNext.getId());
            }
        }
    }

    private void insertProcessElementForm(ProcessDef processDef,ProcessElement processElement,List<FormProperty> properties){
        
        if(properties!=null && properties.size()>0){
            for(FormProperty property : properties){
                ProcessElementForm instance=new ProcessElementForm();
                instance.setProcessDef(processDef);
                instance.setProcessElement(processElement);
                instance.setExpression(property.getExpression());
                instance.setName(property.getName());
                instance.setVariable(property.getVariable());
                instance.setType(property.getType());
                Integer chmod=null;
                if(property.isReadable()){
                    chmod=0;
                }else if(property.isWriteable()){
                    chmod=1;
                }else{
                    chmod=2;
                }
                instance.setChmod(chmod);
                processElementFormDao.saveProcessElementForm(instance);
            }
        }
//        else {
//            Long formId=processDef.getFlowForm().getId();
//            List<FormField> formFields=formFieldDao.getFormFieldByFormId(formId);
//            if(formFields!=null && formFields.size()>0){
//                for(FormField formField : formFields){
//                    ProcessElementForm instance=new ProcessElementForm();
//                    instance.setProcessDef(processDef);
//                    instance.setName(formField.getLabel());
//                    instance.setVariable(formField.getName());
//                    instance.setType(formField.getDataType());
//                    instance.setProcessElement(processElement);
//                    instance.setChmod(1);
//                    processElementFormDao.saveProcessElementForm(instance);
//                }
//            }
//        }
    }


    public String getRes(String resId,String resName,String taskKey) throws IOException,ActivitiObjectNotFoundException {
        InputStream inputStream = repositoryService.getResourceAsStream(resId,resName);
        if(inputStream!=null){
            String str=IOUtils.toString(inputStream);
            if(StringUtils.isNotEmpty(taskKey)){
                mxGraphModel model= ActivityGraphConverter.getMxGraphModel(str);
                model.beginUpdate();
                mxCell cell = (mxCell)model.getCell(taskKey.substring(2));
                String style = cell.getStyle();
                style+=";strokeColor=red";
                cell.setStyle(style);
                model.endUpdate();
                str = ActivityGraphConverter.toMxGraphModelXml(model);
            }
            return str;
        }
        return null;
    }

    public ProcessElement getProcessElementByTaskKeyAndDefId(Long defId, String taskKey) {
        return processElementDao.getProcessElementByTaskKeyAndDefId(defId,taskKey);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void deployed(ProcessDef processDef) throws Exception {
        
        String graphResId=processDef.getGraphResId();
        String graphResName=processDef.getGraRes();
        InputStream inputStream = repositoryService.getResourceAsStream(graphResId,graphResName);
        if(inputStream==null){
            throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_NULL);
        }
        String str=IOUtils.toString(inputStream);
        if(StringUtils.isEmpty(str)){
            throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_NULL);
        }
        mxGraphModel graphModel= ActivityGraphConverter.getMxGraphModel(str);
        
        BpmnModel model = ActivityGraphConverter.createBpmnModel(graphModel);
        
        BpmnXMLConverter bpmnXMLConverter=new BpmnXMLConverter();
        byte[] xml=bpmnXMLConverter.convertToXML(model);
        System.out.println(new String(xml));
        
        
        
        Deployment deployment = repositoryService
                .createDeployment()
                .addBpmnModel(processDef.getActRes(), model)
                .category(processDef.getCategory())
                .name(processDef.getName())
                .deploy();
        if(deployment==null){
            throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_NULL);
        }
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().deploymentId(deployment.getId()).singleResult();
        if(processDefinition==null){
            throw new OzException(Constants.MESSAGE_PROCESS_DEPLOYED_PROCESS_NOT_FOUND);
        }
        processDef.setActResId(deployment.getId());
        processDef.setActDefId(processDefinition.getId());
        processDef.setVersion(processDefinition.getVersion());
        processDef.setDeployDate(new Date());
        processDefDao.updateProcessDef(processDef);
        ProcessDefVersion version=new ProcessDefVersion();
        version = version.copy(processDef);
        processDefVersionDao.saveProcessDefVersion(version);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void authorizationProcessDef(ProcessDef def) throws Exception{
        Set<User> users=def.getUsers();
        if(users!=null && users.size()>0){
            processDefDao.deleteProcessDefUser(def.getId());
            for(User user : users){
                processDefDao.saveProcessDefUser(user.getId(),def.getId());
            }
        }
        Set<Role> roles=def.getRoles();
        if(roles!=null && roles.size()>0){
            processDefDao.deleteProcessDefRole(def.getId());
            for(Role role : roles){
                processDefDao.saveProcessDefRole(role.getId(),def.getId());
            }
        }
    }
    @Transactional(rollbackFor = Throwable.class)
    public void disAuthorization(ProcessDef def) throws Exception {
        Set<User> users=def.getUsers();
        if(users!=null && users.size()>0){
            processDefDao.deleteProcessDefUser(def.getId());
        }
        Set<Role> roles=def.getRoles();
        if(roles!=null && roles.size()>0){
            processDefDao.deleteProcessDefRole(def.getId());
        }
    }

    public List<ProcessDef> getProcessDefinition(Map<String, Object> map,Integer start,Integer limit) {
        return processDefDao.getProcessDefinition(map,new RowBounds(start,limit));
    }

    public Integer getProcessDefinitionCount(Map<String, Object> map) {
        return processDefDao.getProcessDefinitionCount(map);
    }

    public Boolean checkProcessUseRole(Long roleId) {
        List<ProcessDef> processDefs=processDefDao.getProcessDefByRoleId(roleId);
        if(processDefs!=null && processDefs.size()>0){
            return true;
        }
        return false;
    }

    public Boolean checkProcessRunning(String actDefId) {
        long count = runtimeService.createProcessInstanceQuery().processDefinitionId(actDefId).count();
        return count!=0;
    }
}
