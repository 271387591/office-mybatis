package com.ozstrategy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessElementFormDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.util.ActivityGraphConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.ExtensionAttribute;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/15/14.
 */
public class ProcessDefManagerTest extends BaseManagerTestCase  {
    @Autowired
    ProcessDefManager processDefManager;
    @Autowired
    ProcessElementFormDao processElementFormDao;
    @Autowired
    ProcessElementDao processElementDao;
    @Autowired
    ProcessDefDao processDefDao;

    @Autowired
    RuntimeService runtimeService;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    TaskService taskService;
    @Autowired
    private IdentityService identityService;
    @Autowired
    HistoryService historyService;
    
    
    
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
    @Rollback(value = false)
    public void testDeploy() throws Exception {
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("bpmn.xml").getPath();
        String value= FileUtils.readFileToString(new File(path));
        
        
        Deployment deployment = repositoryService.createDeployment()
                .addString("huiqian-model.bpmn", value).name("会签流程").category("行政").enableDuplicateFiltering()
                .deploy();
//
//        // 4. Start a process instance
        Map<String,Object> map=new HashMap<String, Object>();
//        map.put("signAssignee", Arrays.asList("hr", "dep", "user"));
        identityService.setAuthenticatedUserId("dynamic");
        ProcessDefinition definition=repositoryService.createProcessDefinitionQuery().deploymentId(deployment.getId()).singleResult();
        
        
        ProcessInstance processInstance = runtimeService.startProcessInstanceById(definition.getId(), map);
        int i=0;
        System.out.println(processInstance.getId());
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
    @Rollback(value = true)
    public void testCreateBpmnModel() throws Exception{
        String path=ProcessDefManagerTest.class.getClassLoader().getResource("graph.xml").getPath();
        String value= FileUtils.readFileToString(new File(path));
        mxGraphModel graphModel=getMxGraphModel(value);

        mxCell cell = (mxCell)graphModel.getCell("11");

        String pre=getPreNextTask(cell,false);
        String next=getPreNextTask(cell,true);
        System.out.println("任务5pre===="+pre);
        System.out.println("任务5next===="+next);
        
        cell = (mxCell)graphModel.getCell("2");

        pre=getPreNextTask(cell,false);
        next=getPreNextTask(cell,true);
        System.out.println("开始pre===="+pre);
        System.out.println("开始next===="+next);
        
        cell = (mxCell)graphModel.getCell("4");

        pre=getPreNextTask(cell,false);
        next=getPreNextTask(cell,true);
        System.out.println("任务2pre===="+pre);
        System.out.println("任务2next===="+next);
        
        cell = (mxCell)graphModel.getCell("6");

        pre=getPreNextTask(cell,false);
        next=getPreNextTask(cell,true);
        System.out.println("结束pre===="+pre);
        System.out.println("结束next===="+next);
        
        
        
        

        
        
//        ProcessDef processDef=processDefManager.getProcessDefById(2L);
//        BpmnModel model = ActivityGraphConverter.createBpmnModel(graphModel, processDef);
//        
//        
//        BpmnJsonConverter jsonConverter=new BpmnJsonConverter();
//        System.out.println(jsonConverter.convertToJson(model).toString());
//
//        BpmnXMLConverter bpmnXMLConverter =new BpmnXMLConverter();
//        byte[] data=bpmnXMLConverter.convertToXML(model,"UTF-8");
//        String xml=new String(data);
//        System.out.println(xml);

//        Deployment deployment = repositoryService
//                .createDeployment()
//                .addBpmnModel(processDef.getActRes(), model)
//                .category(processDef.getCategory())
//                .name(processDef.getName())
//                .deploy();
        int i=0;
        
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
            if(StringUtils.equals(preNext.getAttribute("type"),"gateway")){
                getPreNextTask(preNext, task, next);
            }else{
                task.add(ActivityGraphConverter.EDITOR_SHAPE_ID_PREFIX+preNext.getId());
            }
            
        }
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
