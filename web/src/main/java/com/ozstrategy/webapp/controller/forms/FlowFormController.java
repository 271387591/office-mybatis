package com.ozstrategy.webapp.controller.forms;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FlowFormStatus;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.forms.FlowFormManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.forms.FlowFormCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 8/8/14.
 */
@Controller
@RequestMapping("flowFormController.do")
public class FlowFormController extends BaseController{
    @Autowired
    private FlowFormManager flowFormManager;
    @Autowired
    private ProcessDefManager processDefManager;
    
    @RequestMapping(params = "method=listFlowForms")
    @ResponseBody
    public JsonReaderResponse<FlowFormCommand> listFlowForms(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        Map<String,Object> map=requestMap(request);
        List<FlowFormCommand> commands=new ArrayList<FlowFormCommand>();
        List<FlowForm> flowForms= flowFormManager.listFlowForms(map, Integer.parseInt(start),Integer.parseInt(limit));
        if(flowForms!=null && flowForms.size()>0){
            for(FlowForm flowForm : flowForms){
                FlowFormCommand command=new FlowFormCommand(flowForm);
                commands.add(command);
            }
        }
        Integer count=flowFormManager.listFlowFormsCount(map);
        return new JsonReaderResponse<FlowFormCommand>(commands,count);
    }
    @RequestMapping(params = "method=checkNameExist")
    @ResponseBody
    public BaseResultCommand checkNameExist(HttpServletRequest request){
        String name=request.getParameter("name");
        if(StringUtils.isNotEmpty(name)){
            FlowForm flowForm=flowFormManager.getFlowFormByName(name);
            if(flowForm!=null){
                return new BaseResultCommand("",false);
            }
        }
        return new BaseResultCommand("",true);
    }
    @RequestMapping(params = "method=checkFormInUse")
    @ResponseBody
    public BaseResultCommand checkFormInUse(HttpServletRequest request){
        String id=request.getParameter("id");
        Long fId=parseLong(id);
        if(fId!=null){
            List<ProcessDef> processDefs=processDefManager.getProcessDefByFormId(fId);
            Boolean use= processDefs!=null && processDefs.size()>0;
            return new BaseResultCommand("",use); 
        }
        return new BaseResultCommand("",true);
    }
    
    @RequestMapping(params = "method=save")
    @ResponseBody
    public BaseResultCommand save(HttpServletRequest request){
        return  saveOrUpdate(request,true);
    }
    @RequestMapping(params = "method=update")
    @ResponseBody
    public BaseResultCommand update(HttpServletRequest request){
        return  saveOrUpdate(request,false);
    }
    @RequestMapping(params = "method=multiRemove")
    @ResponseBody
    public BaseResultCommand multiRemove(HttpServletRequest request){
        String ids=request.getParameter("ids");
        if(StringUtils.isNotEmpty(ids)){
            try{
                flowFormManager.multiRemove(ids.split(","));
            }catch (Exception e){
                logger.error("multiRemove",e);
                return new BaseResultCommand(getMessage("message.processDefController.delFormFail",request),false);
            }
            return new BaseResultCommand("",true);
        }
        return new BaseResultCommand("",false);
    }
    @RequestMapping(params = "method=publish")
    @ResponseBody
    public BaseResultCommand publish(HttpServletRequest request){
        String ids=request.getParameter("ids");
        if(StringUtils.isNotEmpty(ids)){
            try{
                flowFormManager.publish(ids.split(","));
            }catch (Exception e){
                logger.error("publish",e);
                return new BaseResultCommand(getMessage("message.processDefController.publish",request),false);
            }
            ;
            return new BaseResultCommand("",true);
        }
        return new BaseResultCommand("",false);
    }
    
    
    private BaseResultCommand saveOrUpdate(HttpServletRequest request,boolean save){
        FlowForm        flowForm        = null;
        String id=request.getParameter("id");
        String name=request.getParameter("name");
        String description=request.getParameter("description");
        String content=request.getParameter("content");
        String displayName=request.getParameter("displayName");
        String jsonHtml=request.getParameter("jsonHtml");
        try{
            if(StringUtils.isNotEmpty(id)){
                flowForm=flowFormManager.getFlowFormByName(name);
                if(flowForm!=null && StringUtils.equals(name,flowForm.getName()) && parseLong(id)!=flowForm.getId()){
                    return new BaseResultCommand(getMessage("message.error.name.exist",request),Boolean.FALSE);
                }
                flowForm=flowFormManager.getFlowFormById(parseLong(id));
            }else{
                flowForm=flowFormManager.getFlowFormByName(name);
                if(flowForm!=null){
                    return new BaseResultCommand(getMessage("message.error.name.exist",request),Boolean.FALSE);
                }
                flowForm=new FlowForm();
                flowForm.setCreateDate(new Date());
            }
            flowForm.setLastUpdateDate(new Date());
            flowForm.setName(name);
            flowForm.setDisplayName(displayName);
            flowForm.setContent(content);
            flowForm.setDescription(description);
            flowForm.setStatus(FlowFormStatus.Draft.name());
            flowFormManager.saveOrUpdate(flowForm,jsonHtml);
            return new BaseResultCommand("",true);
        }catch (Exception e){
            logger.error(e.getMessage(), e);
        } 
        return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
    }
}
