package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElementForm;
import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.model.flows.Task;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.flows.ProcessFileAttachManager;
import com.ozstrategy.service.flows.TaskManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessDefinitionHeaderCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
@Controller
@RequestMapping("taskController.do")
public class TaskController extends BaseController{
    @Autowired
    private TaskManager taskManager;
    @Autowired
    private ProcessFileAttachManager processFileAttachManager;
    @Autowired
    private ProcessDefManager processDefManager;
    @Autowired
    private UserManager userManager;
    
    @RequestMapping(params = "method=listTasks")
    @ResponseBody
    public JsonReaderResponse<Task> listTasks(HttpServletRequest request) {
        String username=request.getRemoteUser();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<Task>(Collections.<Task>emptyList(),0);
        }
        Map<String,Object> map=requestMap(request);
        map.put("userId",username);
        List<Task> items1= taskManager.listAssigneeTasks(map);
        List<Task> items2= taskManager.listCandidateTasks(map);
        List<Task> items=new ArrayList<Task>();
        items.addAll(items1);
        items.addAll(items2);
        return new JsonReaderResponse<Task>(items);
    }
    @RequestMapping(params = "method=listAssigneeTasks")
    @ResponseBody
    public JsonReaderResponse<Task> listAssigneeTasks(HttpServletRequest request) {
        String username=request.getRemoteUser();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<Task>(Collections.<Task>emptyList(),0);
        }
        Map<String,Object> map=requestMap(request);
        map.put("userId",username);
        List<Task> items1= taskManager.listAssigneeTasks(map);
        Integer count=taskManager.listAssigneeTasksCount(map);
        return new JsonReaderResponse<Task>(items1,count);
    }
    @RequestMapping(params = "method=listCandidateTasks")
    @ResponseBody
    public JsonReaderResponse<Task> listCandidateTasks(HttpServletRequest request) {
        String username=request.getRemoteUser();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<Task>(Collections.<Task>emptyList(),0);
        }
        Map<String,Object> map=requestMap(request);
        map.put("userId",username);
        List<Task> items1= taskManager.listCandidateTasks(map);
        Integer count=taskManager.listCandidateTasksCount(map);
        return new JsonReaderResponse<Task>(items1,count);
    }
    
    
    @RequestMapping(params = "method=listReplevyTasks")
    @ResponseBody
    public JsonReaderResponse<Task> listReplevyTasks(HttpServletRequest request) {
        String username=request.getRemoteUser();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<Task>(Collections.<Task>emptyList(),0);
        }
        Map<String,Object> map=requestMap(request);
        map.put("userId",username);
        List<Task> tasks= taskManager.listReplevyTasks(map,parseInteger(request.getParameter("start")),parseInteger(request.getParameter("limit")));
        Integer count=taskManager.listReplevyTasksCount(map);
        return new JsonReaderResponse<Task>(tasks,count);
    }
    
    @RequestMapping(params = "method=claim")
    @ResponseBody
    public BaseResultCommand claim(HttpServletRequest request){
        String taskId=request.getParameter("taskId");
        String username=request.getRemoteUser();
        if(StringUtils.isEmpty(username)){
            return new BaseResultCommand("登陆超时",Boolean.FALSE);
        }
        taskManager.claim(taskId, username);
        return new BaseResultCommand("",Boolean.TRUE); 
    }
    @RequestMapping(params = "method=proxyTask")
    @ResponseBody
    public BaseResultCommand proxyTask(HttpServletRequest request){
        String taskId=request.getParameter("taskId");
        String username=request.getParameter("username");
        String instanceId=request.getParameter("instanceId");
        Map<String,Object> map=requestMap(request);
        try{
            String creatorname=request.getRemoteUser();
            User creator=null;
            if(StringUtils.isNotEmpty(username)){
                creator=userManager.getUserByUsername(creatorname);
            }
            taskManager.proxyTask(taskId, username,creator,map);
            
        }catch (Exception e){
            e.printStackTrace();
            logger.error("任务转办失败",e);
            return new BaseResultCommand("任务转办失败",Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE); 
    }
    @RequestMapping(params = "method=returnTask")
    @ResponseBody
    public BaseResultCommand returnTask(HttpServletRequest request){
        String taskId=request.getParameter("taskId");
        String taskKey=request.getParameter("taskKey");
        String sourceTask=request.getParameter("sourceTask");
        Map<String,Object> map=requestMap(request);
        try {
            String username=request.getRemoteUser();
            User creator=null;
            if(StringUtils.isNotEmpty(username)){
                creator=userManager.getUserByUsername(username);
            }
            taskManager.returnTask(taskId,taskKey,sourceTask,creator,map);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("任务回退失败",e);
            return new BaseResultCommand("任务回退失败",Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE); 
    }
    @RequestMapping(params = "method=replevyTask")
    @ResponseBody
    public BaseResultCommand replevyTask(HttpServletRequest request){
        String taskId=request.getParameter("taskId");
        String taskKey=request.getParameter("taskKey");
        String sourceTask=request.getParameter("sourceTask");
        Map<String,Object> map=requestMap(request);
        try {
            String username=request.getRemoteUser();
            User creator=null;
            if(StringUtils.isNotEmpty(username)){
                creator=userManager.getUserByUsername(username);
            }
            taskManager.replevyTask(taskId,taskKey,sourceTask,creator,map);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("任务追回失败",e);
            return new BaseResultCommand("任务追回失败",Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE); 
    }
    
    @RequestMapping(params = "method=completeTask")
    @ResponseBody
    public BaseResultCommand completeTask(HttpServletRequest request){
        String taskId=request.getParameter("taskId");
        String processDefId=request.getParameter("processDefId");
        String completeType=request.getParameter("completeType");
        if(StringUtils.isEmpty(taskId)){
            return new BaseResultCommand("任务ID为空",Boolean.FALSE);
        }
        ProcessDef def=processDefManager.getProcessDefById(parseLong(processDefId));
        if(def==null){
            return new BaseResultCommand("流程不存在",Boolean.FALSE);
        }
        Map<String,Object> map=requestMap(request);
        try {
            String username=request.getRemoteUser();
            User creator=null;
            if(StringUtils.isNotEmpty(username)){
                creator=userManager.getUserByUsername(username);
            }
            if(StringUtils.isNotEmpty(completeType)){
                taskManager.sign(creator,def,taskId,map);
            }else{
                taskManager.complete(creator,def,taskId,map);
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("任务完成失败",e);
            return new BaseResultCommand("任务完成失败",Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE); 
    }
    @RequestMapping(params = "method=assignee")
    @ResponseBody
    public BaseResultCommand assignee(HttpServletRequest request){
        String executionId=request.getParameter("executionId");
        String instanceId=request.getParameter("instanceId");
        String processDefId=request.getParameter("processDefId");
        String processElementId=request.getParameter("processElementId");
        Long inId=parseLong(instanceId);
        if(inId!=null){
            List<ProcessFileAttach> processFileAttaches=processFileAttachManager.getProcessFileAttachByInstanceId(inId);
            ProcessDefinitionHeaderCommand command=new ProcessDefinitionHeaderCommand(processFileAttaches);
            Map<String,Object> variables=null;
            try {
                variables=taskManager.getVariables(executionId);
            } catch (Exception e) {
                logger.error("获取variables失败",e);
            }
            if(variables!=null){
                command.setFormValue(variables);
            }
            try{
                Long elementId=parseLong(processElementId);
                if(elementId!=null){
                    List<ProcessElementForm> forms=taskManager.listProcessElementFormByElementId(elementId);
                    Map<String,Object> chmods=new HashMap<String, Object>();
                    if(forms!=null && forms.size()>0){
                        for(ProcessElementForm form:forms){
                            chmods.put(form.getVariable(),form.getChmod());
                        }
                    }
                    command.setChmods(chmods);
                }
            }catch (Exception e){
                e.printStackTrace();
                logger.error("get ProcessElementForm",e);
                return new BaseResultCommand("获取数据失败",Boolean.FALSE);
            }
            
            Long pId=parseLong(processDefId);
            if(pId!=null){
                ProcessDef processDef=processDefManager.getProcessDefById(pId);
                if(processDef!=null){
                    String content=processDef.getFlowForm()!=null?processDef.getFlowForm().getContent():null;
                    command.setFormHtml(content);
                }
            }
            return new BaseResultCommand(command);
        }
        return new BaseResultCommand("获取数据失败",Boolean.FALSE); 
    }
    
    
    
}
