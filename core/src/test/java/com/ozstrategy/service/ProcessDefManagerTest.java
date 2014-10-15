package com.ozstrategy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessElementFormDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.util.ActivityJsonConverUtil;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
import org.apache.commons.io.FileUtils;
import org.apache.ibatis.session.RowBounds;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.util.HashMap;
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
    ProcessElementFormDao processElementFormDao;
    @Autowired
    ProcessElementDao processElementDao;
    @Autowired
    ProcessDefDao processDefDao;
    
    
    
    @Test
    public void testAct() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("act.json").getPath();
        String value= FileUtils.readFileToString(new File(path));
        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
        JsonNode jsonNode=new ObjectMapper().readTree(value);
        BpmnModel model = jsonConverter.convertToBpmnModel(jsonNode);
        Map<String,List<ExtensionAttribute>> map = model.getProcesses().get(0).getAttributes();
        int i=0;
        
    }
    @Test
    @Rollback(value = false)
    public void testUpdate() throws Exception,Throwable {
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("userId",2);
        map.put("roleIds","-1,-2");
        List<ProcessDef> processDefs = processDefDao.getProcessDefinition(map,new RowBounds(0,5));
        int count=processDefDao.getProcessDefinitionCount(map);
        int i=0;
        
        
        

        
    }
    @Test
    public void testJSON() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("act.json").getPath();
        String value= FileUtils.readFileToString(new File(path));
        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
        JsonNode jsonNode=new ObjectMapper().readTree(value);
        BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(jsonNode);
        int i=0;
    }
    @Test
    public void testCreateBpmnModel() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("graph.xml").getPath();
        String value= FileUtils.readFileToString(new File(path));
        mxGraphModel graphModel=getMxGraphModel(value);
        ProcessDef def=processDefManager.getProcessDefById(2L);
        BpmnModel model = ActivityJsonConverUtil.createBpmnModel(graphModel,def);
        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
        System.out.println(jsonConverter.convertToJson(model).toString());

        BpmnXMLConverter bpmnXMLConverter =new BpmnXMLConverter();
        byte[] data=bpmnXMLConverter.convertToXML(model,"UTF-8");
        String xml=new String(data);
        System.out.println(xml);
        
    }
    
    @Test
    @Rollback(value = true)
    public void testDeployed() throws Exception,Throwable{
        ProcessDef processDef = processDefManager.getProcessDefById(1L);
        processDefManager.deployed(processDef);
    }
    
    @Test
    @Rollback(value = true)
    public void testgetDefFormFieldByFormId() throws Exception{
        int i=0;
    }
    @Test
    @Rollback(value = false)
    public void testDeleteDeployed() throws Exception{
        int i=0;
    }
    private static mxGraphModel getMxGraphModel(String gxml){
        mxCodec codec = new mxCodec();
        org.w3c.dom.Document doc = mxXmlUtils.parseXml(gxml);
        codec = new mxCodec(doc);
        mxGraphModel model = (mxGraphModel) codec.decode(doc.getDocumentElement());
        return model;
    }
    
}
