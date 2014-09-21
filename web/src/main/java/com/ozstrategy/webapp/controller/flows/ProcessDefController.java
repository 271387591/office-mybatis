package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.forms.FlowFormManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessDefCommand;
import com.ozstrategy.webapp.command.flows.ProcessElementFormCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
    @Autowired
    FlowFormManager flowFormManager;
    
    private Log logger= LogFactory.getLog(ProcessDefController.class);
    
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
    @RequestMapping(params = "method=listDefFormField")
    @ResponseBody
    public JsonReaderResponse<ProcessElementFormCommand> listDefFormField(HttpServletRequest request) {
        Long formId=parseLong(request.getParameter("formId"));
        List<ProcessElementFormCommand> commands=new ArrayList<ProcessElementFormCommand>();
        if(formId!=null){
            List<FormField> formFields=flowFormManager.getDefFormFieldByFormId(formId);
            if(formFields!=null && formFields.size()>0){
                for(FormField formField : formFields){
                    ProcessElementFormCommand command=new ProcessElementFormCommand(formField);
                    commands.add(command);
                }
            }
        }
        return new JsonReaderResponse<ProcessElementFormCommand>(commands);
    }
    @RequestMapping(params = "method=save")
    @ResponseBody
    public BaseResultCommand save(HttpServletRequest request){
        try {
            Map<String,Object> map=requestMap(request);
            String name=request.getParameter("name");
            Long globalTypeId=parseLong(request.getParameter("globalTypeId"));
            if(StringUtils.isNotEmpty(name) && globalTypeId!=null){
                if(processDefManager.checkNameExist(name,globalTypeId)!=null){
                    return new BaseResultCommand("流程名称已经存在",Boolean.FALSE);
                }
            }
            ProcessDef def=new ProcessDef();
            BeanUtils.populate(def, map);
            def.setCreateDate(new Date());
            def.setLastUpdateDate(new Date());
            def.setVersion(1);
            String formId=request.getParameter("flowFormId");
            if(StringUtils.isNotEmpty(formId)){
                def.setFlowForm(flowFormManager.getNoCascadeFlowFormById(parseLong(formId)));
            }
            processDefManager.save(def);
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            logger.error("保存流程失败，详细异常:",e);
            return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            logger.error("保存流程失败，详细异常:",e);
            return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("保存流程失败，详细异常:",e);
            return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
        }
        return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.TRUE);
    }
    @RequestMapping(params = "method=update")
    @ResponseBody
    public BaseResultCommand update(HttpServletRequest request){
        try {
            Map<String,Object> map=requestMap(request);
            String graRes=request.getParameter("graRes");
            Long id=parseLong(request.getParameter("id"));
            String name=request.getParameter("name");
            Long globalTypeId=parseLong(request.getParameter("globalTypeId"));
            if(id==null){
                return new BaseResultCommand("流程不存在",Boolean.FALSE); 
            }
            ProcessDef def = processDefManager.getProcessDefById(id);
            if(StringUtils.isNotEmpty(name) && globalTypeId!=null){
                Long checkId= processDefManager.checkNameExist(name,globalTypeId);
                if(checkId!=null && checkId!=id && globalTypeId==def.getGlobalTypeId()){
                    return new BaseResultCommand("流程名称已经存在",Boolean.FALSE);
                }
            }
            BeanUtils.populate(def, map);
            Long formId=parseLong(request.getParameter("flowFormId"));
            if(formId!=null){
                def.setFlowForm(flowFormManager.getNoCascadeFlowFormById(formId));
            }
            
            processDefManager.update(def, graRes);
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("解析流程数据错误",e);
            return new BaseResultCommand("解析流程数据错误",Boolean.FALSE);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("保存流程失败，详细异常:",e);
            return new BaseResultCommand("保存流程失败",Boolean.FALSE);
        } catch (OzException e) {
            e.printStackTrace();
            return new BaseResultCommand(getMessage(e.getKey(),request),Boolean.FALSE);
        }
        return new BaseResultCommand("保存流程失败",Boolean.TRUE);
    }
    @RequestMapping(params = "method=getRes")
    @ResponseBody
    public BaseResultCommand getRes(HttpServletRequest request){
        Map<String,String> map=new HashMap<String, String>();
        try {
            Long id = parseLong(request.getParameter("id"));
            if(id!=null){
                ProcessDef def=processDefManager.getProcessDefById(id);
                if(def!=null){
                    if(StringUtils.isNotEmpty(def.getGraphResId())){
                        String graRes = processDefManager.getRes(def.getGraphResId(),def.getGraRes());
                        if(StringUtils.isNotEmpty(graRes)){
                            map.put("graRes",graRes);
                        }
                    }
                }
            }
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("获取流程资源失败",e);
            return new BaseResultCommand("获取流程资源失败",Boolean.FALSE);
        }
        return new BaseResultCommand(map);
    }
    
}
