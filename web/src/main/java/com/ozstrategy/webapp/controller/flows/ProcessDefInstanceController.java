package com.ozstrategy.webapp.controller.flows;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.flows.ProcessFileAttachManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 10/9/14.
 */
@Controller
@RequestMapping("processDefInstanceController.do")
public class ProcessDefInstanceController extends BaseController{
    @Autowired
    private ProcessDefInstanceManager processDefInstanceManager;
    @Autowired
    private UserManager userManager;
    @Autowired
    private ProcessDefManager processDefManager;
    @Autowired
    private ProcessFileAttachManager processFileAttachManager;
    @RequestMapping(params = "method=runStartNoneEvent")
    @ResponseBody
    public BaseResultCommand runStartNoneEvent(HttpServletRequest request){
        String username=request.getRemoteUser();
        User user=userManager.getUserByUsername(username);
        if(user==null){
            return new BaseResultCommand(getMessage("登陆超时",request),Boolean.FALSE);
        }
        Long defId=parseLong(request.getParameter("processDefId"));
        ProcessDef def=null;
        if(defId!=null){
            def=processDefManager.getProcessDefById(defId);
        }
        if(def==null){
            return  new BaseResultCommand(getMessage("获取流程失败",request),Boolean.FALSE);
        }
        TaskInstance taskInstance=new TaskInstance();
        taskInstance.setSendEmail(parseBoolean(request.getParameter("sendEmail")));
        taskInstance.setRemarks(request.getParameter("remarks"));
        Set<ProcessFileAttach> processFileAttaches=new HashSet<ProcessFileAttach>();
        String fileAttaches=request.getParameter("fileAttaches");
        if(StringUtils.isNotEmpty(fileAttaches)){
            String[] fileAttacheIds=fileAttaches.split(",");
            for(String fileAttacheId:fileAttacheIds){
                ProcessFileAttach processFileAttach = processFileAttachManager.getProcessFileAttachById(parseLong(fileAttacheId));
                if(processFileAttach!=null){
                    processFileAttaches.add(processFileAttach);
                }
            }
        }
        taskInstance.getFileAttaches().clear();
        taskInstance.getFileAttaches().addAll(processFileAttaches);
        String formData=request.getParameter("formData");
        Map<String,Object> map=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(formData)){
            try {
                map=new ObjectMapper().readValue(formData,Map.class);
            }catch (IOException e){
            }
        }
        try {
            processDefInstanceManager.runStartNoneEventPro(user,def,taskInstance,map);
        } catch (Exception e) {
            logger.error("启动流程失败",e);
            return new BaseResultCommand("启动流程失败",Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE);
    }
}
