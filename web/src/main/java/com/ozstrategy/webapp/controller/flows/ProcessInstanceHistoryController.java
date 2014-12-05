package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessInstanceHistory;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.flows.ProcessInstanceHistoryManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
@Controller
@RequestMapping("processInstanceHistoryController.do")
public class ProcessInstanceHistoryController extends BaseController {
    @Autowired
    private ProcessInstanceHistoryManager processInstanceHistoryManager;
    @Autowired
    private ProcessDefManager processDefManager;
    
    
    @RequestMapping(params = "method=listProcessInstanceHistories")
    @ResponseBody
    public JsonReaderResponse<ProcessInstanceHistory> listProcessInstanceHistory(HttpServletRequest request) {
        try{
            String start=request.getParameter("start");
            String limit=request.getParameter("limit");
            String username=request.getRemoteUser();
            Map<String,Object> map=requestMap(request);
            map.put("userId",username);
            if(StringUtils.isEmpty(username)){
                return new JsonReaderResponse<ProcessInstanceHistory>(Collections.<ProcessInstanceHistory>emptyList(),Boolean.FALSE,getMessage("message.error.login.timeout",request));
            }
            List<ProcessInstanceHistory> items= processInstanceHistoryManager.listProcessInstanceHistories(map, parseInteger(start), parseInteger(limit));
            Integer count=processInstanceHistoryManager.listProcessInstanceHistoriesCount(map);
            return new JsonReaderResponse<ProcessInstanceHistory>(items,count);
        }catch (Exception e){
            e.printStackTrace();
            logger.error("listProcessInstanceHistory",e);
        }
        return new JsonReaderResponse<ProcessInstanceHistory>(Collections.<ProcessInstanceHistory>emptyList(),Boolean.FALSE,getMessage("message.error.getRes.fail",request));
    }
    @RequestMapping(params = "method=getFormHtml")
    @ResponseBody
    public BaseResultCommand getFormHtml(HttpServletRequest request){
        String actInstanceId=request.getParameter("actInstanceId");
        String processDefId=request.getParameter("processDefId");
        Map<String,Object> map=new HashMap<String, Object>();
        try{
            Long defId=parseLong(processDefId);
            if(defId!=null){
                ProcessDef processDef=processDefManager.getProcessDefById(defId);
                if(processDef!=null){
                    String content=processDef.getFlowForm()!=null?processDef.getFlowForm().getContent():null;
                    map.put("formHtml",content);
                }
            }
            if(StringUtils.isNotEmpty(actInstanceId)){
                map.put("formValue",processInstanceHistoryManager.getHisVariables(actInstanceId));
            }
            return new BaseResultCommand(map);
        }catch (Exception e){
            e.printStackTrace();
            logger.error("getFormHtml",e);
        }
        
        return new BaseResultCommand(getMessage("message.error.getRes.fail",request),Boolean.FALSE);
    }
    
}
