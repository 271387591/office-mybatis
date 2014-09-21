package com.ozstrategy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessElementFormDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.util.ActivityJsonConverUtil;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.io.InputStream;
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
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("graph.xml").getPath();
        String value= FileUtils.readFileToString(new File(path));
//        value.replaceAll("&quot;","\"");
//        System.out.println(value);
        ProcessDef processDef = processDefManager.getProcessDefById(1L);
        processDefManager.update(processDef,value);
//        mxGraphModel model=getMxGraphModel(value);
        
//        ObjectNode node = ActivityJsonConverUtil.createProcess(model, processDef);
//        System.out.println(node.toString());
        
        
//        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
//        JsonNode jsonNode=new ObjectMapper().readTree(value);
//        BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(node);
//        InputStream inputStream = new DefaultProcessDiagramGenerator().generatePngDiagram(bpmnModel);
//        FileUtils.copyInputStreamToFile(inputStream,new File("/Users/lihao/Downloads/graphtest.png"));
//        int i=0;
        
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
