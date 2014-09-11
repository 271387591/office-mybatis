package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessDefCommand;
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
 * Created by lihao on 9/10/14.
 */
@Controller
@RequestMapping("processDefController.do")
public class ProcessDefController extends BaseController {
    @Autowired
    ProcessDefManager processDefManager;
    @RequestMapping(params = "method=listProcessDefs")
    @ResponseBody
    public JsonReaderResponse<ProcessDefCommand> listProcessDefs(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        Map<String,Object> map=requestMap(request);
        List<ProcessDefCommand> commands=new ArrayList<ProcessDefCommand>();
        List<ProcessDef> items= processDefManager.listProcessDefs(map, parseInteger(start), parseInteger(limit));
        if(items!=null && items.size()>0){
            for(ProcessDef item : items){
                ProcessDefCommand command=new ProcessDefCommand(item);
                commands.add(command);
            }
        }
        Integer count=processDefManager.listProcessDefsCount(map);
        return new JsonReaderResponse<ProcessDefCommand>(commands,count);
    }
    @RequestMapping(params = "method=save")
    @ResponseBody
    public BaseResultCommand save(HttpServletRequest request){
        return  saveOrUpdate(request,true);
    }
    private BaseResultCommand saveOrUpdate(HttpServletRequest request,boolean save){
        ProcessDef        processDef        = null;
        String id=request.getParameter("id");
        String name=request.getParameter("name");
        String description=request.getParameter("description");
        String content=request.getParameter("content");
//        try{
//            if(StringUtils.isNotEmpty(id)){
//                processDef=processDefManager.getProcessDefByName(name);
//                if(flowForm!=null && StringUtils.equals(name,flowForm.getName()) && parseLong(id)!=flowForm.getId()){
//                    return new BaseResultCommand(getMessage("message.error.getMobileUser.exist",request),Boolean.FALSE);
//                }
//                flowForm=flowFormManager.getFlowFormById(parseLong(id));
//            }else{
//                flowForm=flowFormManager.getFlowFormByName(name);
//                if(flowForm!=null){
//                    return new BaseResultCommand(getMessage("message.error.getMobileUser.exist",request),Boolean.FALSE);
//                }
//                flowForm=new FlowForm();
//                flowForm.setCreateDate(new Date());
//            }
//            flowForm.setLastUpdateDate(new Date());
//            flowForm.setName(name);
//            flowForm.setDisplayName(displayName);
//            flowForm.setContent(content);
//            flowForm.setDescription(description);
//            flowFormManager.saveOrUpdate(flowForm);
//            return new BaseResultCommand("",true);
//        }catch (Exception e){
//            log.error(e.getMessage(),e);
//        }
        return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
    }
}
