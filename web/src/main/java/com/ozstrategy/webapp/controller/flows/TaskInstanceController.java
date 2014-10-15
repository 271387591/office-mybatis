package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.service.flows.TaskInstanceManager;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.TaskInstanceCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
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
    @RequestMapping(params = "method=listTaskInstances")
    @ResponseBody
    public JsonReaderResponse<TaskInstanceCommand> listTaskInstances(HttpServletRequest request) {
        Map<String,Object> map=requestMap(request);
        List<TaskInstanceCommand> commands=new ArrayList<TaskInstanceCommand>();
        List<TaskInstance> items=taskInstanceManager.listTaskInstances(map);
        if(items!=null && items.size()>0){
            for(TaskInstance item:items){
                commands.add(new TaskInstanceCommand(item));
            }
        }
        return new JsonReaderResponse<TaskInstanceCommand>(commands);
    }
}
