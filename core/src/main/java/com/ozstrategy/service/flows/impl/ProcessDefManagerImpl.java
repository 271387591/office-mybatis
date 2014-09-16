package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessFormFiledInstanceDao;
import com.ozstrategy.dao.forms.FormFieldDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessElementType;
import com.ozstrategy.model.flows.ProcessFormFiledInstance;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.service.flows.ProcessDefManager;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.UserTask;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private ProcessFormFiledInstanceDao processFormFiledInstanceDao;
    
    
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

    @Transactional
    public void save(ProcessDef processDef) {
        processDefDao.saveProcessDef(processDef);
    }

    @Transactional
    public void update(ProcessDef processDef, String actRes,String graRes) throws IOException,Exception {
        if(StringUtils.isNotEmpty(actRes)){
            BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
            JsonNode jsonNode=new ObjectMapper().readTree(actRes);
            BpmnModel model = jsonConverter.convertToBpmnModel(jsonNode);
            List<Process> processes=model.getProcesses();
            if(processes!=null && processes.size()>0){
                Process process = processes.get(0);
                processFormFiledInstanceDao.deleteProcessFormFiledInstanceByDefId(processDef.getId());
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
                        processElementDao.saveProcessElement(processElement);
                        if(StringUtils.equals(ProcessElementType.StartNoneEvent.getName(),type)){
                            StartEvent startEvent=(StartEvent)element;
                            List<FormProperty> properties = startEvent.getFormProperties();
                            insertProcessFormFiledInstance(processDef,processElement,properties);
                        }else if(StringUtils.equals(ProcessElementType.UserTask.getName(),type)){
                            UserTask userTask=(UserTask)element;
                            List<FormProperty> properties = userTask.getFormProperties();
                            insertProcessFormFiledInstance(processDef,processElement,properties);
                        }
                    }
                }
            }
            if(StringUtils.isNotEmpty(processDef.getActDefId())){
                repositoryService.deleteDeployment(processDef.getActDefId());
            }
            Deployment deployment = repositoryService.createDeployment().addString(processDef.getActRes(),actRes).deploy();
            processDef.setActDefId(deployment.getId());
        }
        if(StringUtils.isNotEmpty(processDef.getGraphResId())){
            repositoryService.deleteDeployment(processDef.getGraphResId());
        }
        if(StringUtils.isNotEmpty(graRes)){
            Deployment deployment=repositoryService.createDeployment().addString(processDef.getGraRes(),graRes).deploy();
            processDef.setGraphResId(deployment.getId());
            processDefDao.updateProcessDef(processDef);
        }
        
    }
    private void insertProcessFormFiledInstance(ProcessDef processDef,ProcessElement processElement,List<FormProperty> properties){
        Long formId=processDef.getFlowForm().getId();
        List<FormField> formFields=null;
        if(formId!=null){
            formFields = formFieldDao.getDefFormFieldByFormId(formId);
        }
        if(properties!=null && properties.size()>0){
            for(FormProperty property : properties){
                String variable=property.getVariable();
                FormField formField=formFieldDao.getFormFieldByNameAndFlowFormId(variable,formId);
                ProcessFormFiledInstance instance=new ProcessFormFiledInstance();
                instance.setProcessDef(processDef);
                instance.setFormField(formField);
                instance.setProcessElement(processElement);
                instance.setExpression(property.getExpression());
                instance.setChmod(property.isReadable()?0:property.isWriteable()?1:property.isRequired()?2:null);
                processFormFiledInstanceDao.saveProcessFormFiledInstance(instance);
            }
        }else {
            if(formFields!=null && formFields.size()>0){
                for(FormField formField : formFields){
                    ProcessFormFiledInstance instance=new ProcessFormFiledInstance();
                    instance.setProcessDef(processDef);
                    instance.setFormField(formField);
                    instance.setProcessElement(processElement);
                    processFormFiledInstanceDao.saveProcessFormFiledInstance(instance);
                }
            }
        }
    }

    public List<ProcessFormFiledInstance> getDefFormFieldByFormId(Long formId) {
        return processFormFiledInstanceDao.getDefFormFieldByFormId(formId);
    }
}
