package com.ozstrategy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.dao.flows.ProcessFormFiledInstanceDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessFormFiledInstance;
import com.ozstrategy.service.flows.ProcessDefManager;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/15/14.
 */
public class ProcessDefManagerTest extends BaseManagerTestCase  {
    @Autowired
    ProcessDefManager processDefManager;
    @Autowired
    private RepositoryService repositoryService;
    @Autowired
    ProcessFormFiledInstanceDao processFormFiledInstanceDao;
    
    @Test
    public void testAct() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("act1.json").getPath();
        String value= FileUtils.readFileToString(new File(path));
        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
        JsonNode jsonNode=new ObjectMapper().readTree(value);
        BpmnModel model = jsonConverter.convertToBpmnModel(jsonNode);
        Map<String,List<ExtensionAttribute>> map = model.getProcesses().get(0).getAttributes();
        int i=0;
        
    }
    @Test
    public void testUpdate() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("act.json").getPath();
        String value= FileUtils.readFileToString(new File(path));
        ProcessDef processDef = processDefManager.getProcessDefById(4L);
        processDefManager.update(processDef,value,null);
//        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
//        JsonNode jsonNode=new ObjectMapper().readTree(value);
//        BpmnModel model = jsonConverter.convertToBpmnModel(jsonNode);
//        int i=0;
        
    }
    @Test
    public void testgetDefFormFieldByFormId() throws Exception{
        List<ProcessFormFiledInstance> instances = processFormFiledInstanceDao.getDefFormFieldByFormId(4L, 16L);
        ProcessFormFiledInstance instance=instances.get(0);
        System.out.println(instance.getFormField().getName());
        int i=0;
    }
    @Test
    @Rollback(value = false)
    public void testDeleteDeployed() throws Exception{
        int i=0;
    }
    
    
}
