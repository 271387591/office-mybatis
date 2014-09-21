package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefVersion;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessElementForm;
import com.ozstrategy.model.flows.ProcessElementType;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.util.ActivityJsonConverUtil;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.UserTask;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
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
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 9/10/14.
 */
@Service("processDefManager")
public class ProcessDefManagerImpl implements ProcessDefManager {
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

    @Transactional(rollbackFor = {Throwable.class})
    public void save(ProcessDef processDef) {
        processDefDao.saveProcessDef(processDef);
    }

    @Transactional(rollbackFor = {Throwable.class})
    public void update(ProcessDef processDef,String graRes) throws IOException,OzException {
        if(StringUtils.isNotEmpty(graRes)){
            mxGraphModel graphModel= ActivityJsonConverUtil.getMxGraphModel(graRes);
            ObjectNode objectNode = ActivityJsonConverUtil.createProcess(graphModel, processDef);
            BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
            BpmnModel model = jsonConverter.convertToBpmnModel(objectNode);
            List<Process> processes=model.getProcesses();
            if(processes!=null && processes.size()>0){
                Process process = processes.get(0);
                processElementFormDao.deleteProcessElementFormByDefId(processDef.getId());
                Set<ProcessElement> processElements=processDef.getElements();
                if(processElements!=null && processElements.size()>0){
                    for(ProcessElement processElement : processElements){
                        processElementDao.deleteProcessElementRoleById(processElement.getId());
                        processElementDao.deleteProcessElementUserById(processElement.getId());
                    }
                }
                processElementDao.deleteProcessElementByDefId(processDef.getId());
                Collection<FlowElement> elements = process.getFlowElements();
                if(elements!=null && elements.size()>0){
                    for(FlowElement element : elements){
                        String name=element.getName();
                        String id=element.getId();
                        String type=element.getClass().getSimpleName();
                        ProcessElement processElement=new ProcessElement();
                        processElement.setLabel(name);
                        processElement.setTaskKey(id);
                        processElement.setActClass(type);
                        processElement.setProcessDef(processDef);
                        processElement.setType(ProcessElementType.get(type));
                        try{
                            mxCell cell = (mxCell)graphModel.getCell(id.substring(2));
                            if(cell!=null){
                                ObjectNode node= ActivityJsonConverUtil.createFlowElements(cell, ProcessElementType.get(type), false);
                                if(node!=null){
                                    processElement.setActResource(new ObjectMapper().writeValueAsBytes(node));
                                }
                            }
                        }catch (Exception e){
                        }
                        processElementDao.saveProcessElement(processElement);
                        if(StringUtils.equals(ProcessElementType.StartNoneEvent.getName(),type)){
                            StartEvent startEvent=(StartEvent)element;
                            List<FormProperty> properties = startEvent.getFormProperties();
                            insertProcessElementForm(processDef, processElement, properties);
                        }else if(StringUtils.equals(ProcessElementType.UserTask.getName(),type)){
                            UserTask userTask=(UserTask)element;
                            List<FormProperty> properties = userTask.getFormProperties();
                            insertProcessElementForm(processDef, processElement, properties);
                            mxCell cell = (mxCell)graphModel.getCell(id.substring(2));
                            if(cell!=null){
                                try{
                                    Set<String> users=saveElementRole(processElement,cell);
                                    if(users!=null && users.size()>0){
                                        saveElementUser(users,processElement);
                                    }
                                }catch (Exception e){
                                    e.printStackTrace();
                                    throw new OzException(Constants.MESSAGE_PROCESS_SAVE_USER);
                                }
                            }
                        }
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
    private void saveElementUser(Set<String> usernames,ProcessElement processElement){
        for(String username : usernames){
            User user=userDao.getUserByUsername(username);
            if(user!=null){
                processElementDao.saveProcessElementUser(user.getId(),processElement.getId());
            }
        }
    }
    private Set<String> saveElementRole(ProcessElement processElement,mxCell cell) throws IOException,OzException {
        String candidateRoles = cell.getAttribute(ActivityJsonConverUtil.CANDIDATE_ROLES,"");
        ObjectMapper objectMapper=new ObjectMapper();
        Set<String> users=new HashSet<String>();
        if(StringUtils.isNotEmpty(candidateRoles)){
            JsonNode jsonNode = objectMapper.readTree(candidateRoles);
            JsonNode   expressionNode=jsonNode.get(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNMENT_EXPRESSION);
            if(expressionNode!=null){
                String expression = expressionNode.asText();
                if(StringUtils.isNotEmpty(expression)){
                    String[] roleIds=expression.split(",");
                    for(String roleId:roleIds){
                        Role role=roleDao.getRoleById(Long.parseLong(roleId));
                        if(role!=null){
                            processElementDao.saveProcessElementRole(role.getId(),processElement.getId());
                            try{
                                List<User> userList=userDao.getUserByRoleId(Long.parseLong(roleId));
                                if(userList!=null && userList.size()>0){
                                    for(User user : userList){
                                        users.add(user.getUsername());
                                    }
                                }
                            }catch (Exception e){
                                throw new OzException(Constants.MESSAGE_PROCESS_SAVE_USER);
                            }
                        }
                    }
                }
            }
        }
        String candidateUsers = cell.getAttribute(ActivityJsonConverUtil.PROPERTY_USERTASK_CANDIDATE_USERS,"");
        if(StringUtils.isNotEmpty(candidateUsers)){
            JsonNode jsonNode= objectMapper.readTree(candidateUsers);
            JsonNode resourceassignmentexprNode=jsonNode.get(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNMENT_EXPRESSION);
            if(resourceassignmentexprNode!=null){
                String resourceassignmentexpr = resourceassignmentexprNode.asText();
                String[] usernames=resourceassignmentexpr.split(",");
                for(String username : usernames){
                    users.add(username);
                }
            }
        }
        String resourceassignmentexpr = StringUtils.join(users.iterator(),",");
        ObjectNode objectNode=objectMapper.createObjectNode();
        objectNode.put(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNMENT_TYPE, ActivityJsonConverUtil.PROPERTY_USERTASK_CANDIDATE_USERS);
        objectNode.put(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNMENT_EXPRESSION,resourceassignmentexpr);
        cell.setAttribute(ActivityJsonConverUtil.PROPERTY_USERTASK_CANDIDATE_USERS,objectNode.toString());
        ObjectNode userTask= ActivityJsonConverUtil.UserTask(cell);
        if(userTask!=null){
            processElement.setActResource(objectMapper.writeValueAsBytes(userTask));
            processElementDao.updateActResource(processElement);
        }
        String assignee = cell.getAttribute(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNEE,"");
        if(StringUtils.isNotEmpty(assignee)){
            JsonNode jsonNode= objectMapper.readTree(assignee);
            JsonNode assigneeNode=jsonNode.get(ActivityJsonConverUtil.PROPERTY_USERTASK_ASSIGNMENT_EXPRESSION);
            if(assigneeNode!=null){
                String username = assigneeNode.asText();
                if(!StringUtils.equals(username,ActivityJsonConverUtil.INITIATOR_EXPRESSION)){
                    users.add(username);
                }
            }
        }
        return users;
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
        }else {
            Long formId=processDef.getFlowForm().getId();
            List<FormField> formFields=formFieldDao.getDefFormFieldByFormId(formId);
            if(formFields!=null && formFields.size()>0){
                for(FormField formField : formFields){
                    ProcessElementForm instance=new ProcessElementForm();
                    instance.setProcessDef(processDef);
                    instance.setName(formField.getLabel());
                    instance.setVariable(formField.getName());
                    instance.setType(formField.getDataType());
                    instance.setProcessElement(processElement);
                    instance.setChmod(1);
                    processElementFormDao.saveProcessElementForm(instance);
                }
            }
        }
    }


    public String getRes(String resId,String resName) {
        InputStream inputStream = repositoryService.getResourceAsStream(resId,resName);
        if(inputStream!=null){
            try {
                return IOUtils.toString(inputStream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public ProcessElement getProcessElementByTaskKeyAndDefId(Long defId, String taskKey) {
        return processElementDao.getProcessElementByTaskKeyAndDefId(defId,taskKey);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void deployed(ProcessDef processDef) throws IOException, OzException {
        ObjectMapper objectMapper=new ObjectMapper();
        Set<ProcessElement> elements=processDef.getElements();
        ObjectNode objectNode= ActivityJsonConverUtil.createProcess(processDef);
        ArrayNode arrayNode=objectMapper.createArrayNode();
        if(elements!=null && elements.size()>0){
            for(ProcessElement element : elements){
                Long eId=element.getId();
                String resource=processElementDao.loadElementActResource(eId);
                if(StringUtils.isNotEmpty(resource)){
                    JsonNode jsonNode = objectMapper.readTree(resource);
                    if(jsonNode!=null){
                        arrayNode.add(jsonNode);
                    }
                }
            }
        }
        objectNode.put(ActivityJsonConverUtil.EDITOR_CHILD_SHAPES,arrayNode);
        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
        BpmnModel model = jsonConverter.convertToBpmnModel(objectNode);
        BpmnXMLConverter bpmnXMLConverter=new BpmnXMLConverter();
        byte[] xml=bpmnXMLConverter.convertToXML(model,"UTF-8");
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
        processDefDao.updateProcessDef(processDef);
        ProcessDefVersion version=new ProcessDefVersion();
        version = version.copy(processDef);
        processDefVersionDao.saveProcessDefVersion(version);
    }
}
