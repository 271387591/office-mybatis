package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.TaskInstanceManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.TaskInstanceCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/10/14.
 */
@Controller
@RequestMapping("taskInstanceController.do")
public class TaskInstanceController extends BaseController{
    @Autowired
    private TaskInstanceManager taskInstanceManager;
    @Autowired
    private UserManager userManager;
    
    @RequestMapping(params = "method=listTaskInstances")
    @ResponseBody
    public JsonReaderResponse<TaskInstanceCommand> listTaskInstances(HttpServletRequest request) {
        try{
            Map<String,Object> map=requestMap(request);
            List<TaskInstanceCommand> commands=new ArrayList<TaskInstanceCommand>();
            List<TaskInstance> items=taskInstanceManager.listTaskInstances(map);
            if(items!=null && items.size()>0){
                for(TaskInstance item:items){
                    commands.add(new TaskInstanceCommand(item));
                }
            }
            return new JsonReaderResponse<TaskInstanceCommand>(commands);
            
        }catch (Exception e){
            logger.error("TaskInstance",e);
        }
        return new JsonReaderResponse<TaskInstanceCommand>(Collections.<TaskInstanceCommand>emptyList(),true,getMessage("message.error.getRes.fail",request));
    }
    @RequestMapping(params = "method=listTaskInstanceRecords")
    @ResponseBody
    public JsonReaderResponse<TaskInstanceCommand> listTaskInstanceRecord(HttpServletRequest request) {
        try{
            String username=request.getRemoteUser();
            if(StringUtils.isEmpty(username)){
                return  new JsonReaderResponse<TaskInstanceCommand>(Collections.<TaskInstanceCommand>emptyList(),true,getMessage("message.error.login.timeout",request));
            }
            User user=userManager.getUserByUsername(username);
            Map<String,Object> map=requestMap(request);
            map.put("userId",user.getId());
            List<TaskInstanceCommand> commands=new ArrayList<TaskInstanceCommand>();
            List<TaskInstance> items=taskInstanceManager.listTaskInstanceRecord(map,parseInteger(request.getParameter("start")),parseInteger(request.getParameter("limit")));
            if(items!=null && items.size()>0){
                for(TaskInstance item:items){
                    commands.add(new TaskInstanceCommand(item));
                }
            }
            Integer count=taskInstanceManager.listTaskInstanceRecordCount(map);
            return new JsonReaderResponse<TaskInstanceCommand>(commands,Boolean.TRUE,count,"");

        }catch (Exception e){
            logger.error("TaskInstance",e);
        }
        return new JsonReaderResponse<TaskInstanceCommand>(Collections.<TaskInstanceCommand>emptyList(),true,getMessage("message.error.getRes.fail",request));
    }
}
