package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FlowFormStatus;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.forms.FlowFormManager;
import com.ozstrategy.service.userrole.RoleManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessDefCommand;
import com.ozstrategy.webapp.command.flows.ProcessElementFormCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    @Autowired
    UserManager userManager;
    @Autowired
    RoleManager roleManager;
    
    
    
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
                ProcessDefCommand command=new ProcessDefCommand(item,false);
                commands.add(command);
            }
        }
        Integer count=processDefManager.listProcessDefsCount(map);
        return new JsonReaderResponse<ProcessDefCommand>(commands,count);
    }
    @RequestMapping(params = "method=getProcessDefinitions")
    @ResponseBody
    public JsonReaderResponse<ProcessDefCommand> getProcessDefinitions(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        Map<String,Object> map=requestMap(request);
        String username=request.getRemoteUser();
        if(StringUtils.isNotEmpty(username)){
            User user = userManager.getUserByUsername(username);
            if(user!=null){
                map.put("userId",user.getId());
                List<Role> roles = roleManager.getRoleByUserId(user.getId());
                String roleIds="";
                if(roles!=null && roles.size()>0){
                    for(Role role : roles){
                        roleIds+=","+role.getId();
                    }
                }
                if(StringUtils.isNotEmpty(roleIds)){
                    map.put("roleIds",roleIds.substring(1));
                }
            }
        }
        List<ProcessDefCommand> commands=new ArrayList<ProcessDefCommand>();
        List<ProcessDef> items= processDefManager.getProcessDefinition(map, parseInteger(start), parseInteger(limit));
        if(items!=null && items.size()>0){
            for(ProcessDef item : items){
                ProcessDefCommand command=new ProcessDefCommand(item,true);
                commands.add(command);
            }
        }
        Integer count=processDefManager.getProcessDefinitionCount(map);
        return new JsonReaderResponse<ProcessDefCommand>(commands,count);
    }
    
    @RequestMapping(params = "method=listDefFormField")
    @ResponseBody
    public JsonReaderResponse<ProcessElementFormCommand> listDefFormField(HttpServletRequest request) {
        Long formId=parseLong(request.getParameter("formId"));
        List<ProcessElementFormCommand> commands=new ArrayList<ProcessElementFormCommand>();
        if(formId!=null){
            FlowForm flowForm=flowFormManager.getFlowFormById(formId);
            if(flowForm == null || StringUtils.equals(flowForm.getStatus(), FlowFormStatus.Draft.name())){
                return new JsonReaderResponse<ProcessElementFormCommand>(commands);
            }
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
    @RequestMapping(params = "method=delete")
    @ResponseBody
    public BaseResultCommand delete(HttpServletRequest request){
        try {

            Long id=parseLong(request.getParameter("id"));
            if(id==null){
                return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
            }
            ProcessDef def=processDefManager.getProcessDefById(id);
            if(def==null){
                return new BaseResultCommand(getMessage("message.processDefController.processNotExist",request),Boolean.FALSE);
            }
            processDefManager.delete(def);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("delete:",e);
            return new BaseResultCommand(getMessage("message.processDefController.delProcessFail",request),Boolean.FALSE);
        }
        return new BaseResultCommand("",Boolean.TRUE);
    }
    @RequestMapping(params = "method=save")
    @ResponseBody
    public BaseResultCommand save(HttpServletRequest request){
        try {
            Map<String,Object> map=requestMap(request);
            ProcessDef def=new ProcessDef();
            BeanUtils.populate(def, map);
            def.setCreateDate(new Date());
            def.setLastUpdateDate(new Date());
            String formId=request.getParameter("flowFormId");
            if(StringUtils.isNotEmpty(formId)){
                def.setFlowForm(flowFormManager.getNoCascadeFlowFormById(parseLong(formId)));
                if(def.getFlowForm()==null){
                    return new BaseResultCommand(getMessage(getMessage("message.processDefController.delProcessForm",request),request),Boolean.FALSE);
                }
            }
            processDefManager.save(def);
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            logger.error("save:",e);
            return new BaseResultCommand(getMessage(getMessage("message.processDefController.saveProcessFail",request),request),Boolean.FALSE);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            logger.error("save:",e);
            return new BaseResultCommand(getMessage(getMessage("message.processDefController.saveProcessFail",request),request),Boolean.FALSE);
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("save:",e);
            return new BaseResultCommand(getMessage(getMessage("message.processDefController.saveProcessFail",request),request),Boolean.FALSE);
        }
        return new BaseResultCommand(getMessage("",request),Boolean.TRUE);
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
                return new BaseResultCommand(getMessage("message.processDefController.processNotExist",request),Boolean.FALSE); 
            }
            ProcessDef def = processDefManager.getProcessDefById(id);
            if(StringUtils.isNotEmpty(name) && globalTypeId!=null){
                Long checkId= processDefManager.checkNameExist(name,globalTypeId);
                if(checkId!=null && checkId!=id && globalTypeId==def.getGlobalTypeId()){
                    return new BaseResultCommand(getMessage("message.processDefController.processExist",request),Boolean.FALSE);
                }
            }
            BeanUtils.populate(def, map);
            Long formId=parseLong(request.getParameter("flowFormId"));
            if(formId!=null){
                def.setFlowForm(flowFormManager.getNoCascadeFlowFormById(formId));
                if(def.getFlowForm()==null){
                    return new BaseResultCommand(getMessage(getMessage("message.processDefController.delProcessForm",request),request),Boolean.FALSE);
                }
            }
            
            processDefManager.update(def, graRes);
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("update:",e);
            return new BaseResultCommand(getMessage("message.error.resolving.fail",request),Boolean.FALSE);
        } catch (OzException e) {
            e.printStackTrace();
            return new BaseResultCommand(getMessage(e.getKey(),request),Boolean.FALSE);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("update",e);
            return new BaseResultCommand(getMessage("message.processDefController.saveProcessFail",request),Boolean.FALSE);
        } 
        return new BaseResultCommand("",Boolean.TRUE);
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
                        String graRes = processDefManager.getRes(def.getGraphResId(),def.getGraRes(),request.getParameter("taskKey"));
                        
                        
                        if(StringUtils.isNotEmpty(graRes)){
                            map.put("graRes",graRes);
                        }
                    }
                }
            }
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("getRes", e);
            return new BaseResultCommand(getMessage("message.error.resource.fail",request),Boolean.FALSE);
        }
        return new BaseResultCommand(map);
    }
    @RequestMapping(params = "method=deploy")
    @ResponseBody
    public BaseResultCommand deploy(HttpServletRequest request){
        Map<String,String> map=new HashMap<String, String>();
        try {
            Long id = parseLong(request.getParameter("id"));
            if(id!=null){
                ProcessDef def=processDefManager.getProcessDefById(id);
                if(def!=null){
                    processDefManager.deployed(def);
                }
            }
        }catch (OzException e) {
            e.printStackTrace();
            logger.error(getMessage(e.getKey(),request),e);
            return new BaseResultCommand(getMessage(e.getKey(),request),Boolean.FALSE);
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("deploy",e);
            return new BaseResultCommand(getMessage("message.error.resource.fail",request),Boolean.FALSE);
        } 
        return new BaseResultCommand(map);
    }
    @RequestMapping(params = "method=checkProcessRunning")
    @ResponseBody
    public BaseResultCommand checkProcessRunning(HttpServletRequest request){
        try {
            String actDefId=request.getParameter("actDefId");
            Boolean check=processDefManager.checkProcessRunning(actDefId);
            return new BaseResultCommand("",check);
            
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("checkProcessRunning fail",e);
            return new BaseResultCommand(getMessage("message.error.query.fail",request),Boolean.TRUE);
        } 
    }
    @RequestMapping(params = "method=checkProcessUsing")
    @ResponseBody
    public BaseResultCommand checkProcessUsing(HttpServletRequest request){
        try {
            String actDefId=request.getParameter("actDefId");
            String defId=request.getParameter("defId");
            Long dId=parseLong(defId);
            if(dId!=null){
                Boolean author=processDefManager.checkProcessAuthorization(dId);
                if(author){
                    return new BaseResultCommand(getMessage("message.processDefController.checkProcessUsing",request),author);
                }
            }
            Boolean running=processDefManager.checkProcessRunning(actDefId);
            if(running){
                return new BaseResultCommand(getMessage("message.processDefController.checkProcessRunning",request),running);
            }
            return new BaseResultCommand("",Boolean.FALSE);
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("checkProcessUsing fail",e);
            return new BaseResultCommand(getMessage("message.error.query.fail",request),Boolean.TRUE);
        } 
    }
    
    
    @RequestMapping(params = "method=authorization")
    @ResponseBody
    public BaseResultCommand authorization(HttpServletRequest request){
        Map<String,String> map=new HashMap<String, String>();
        try {
            Long id = parseLong(request.getParameter("id"));
            if(id!=null){
                ProcessDef def=processDefManager.getProcessDefById(id);
                if(def!=null){
                    String userIds=request.getParameter("userIds");
                    Set<User> userSet=new HashSet<User>();
                    if(StringUtils.isNotEmpty(userIds)){
                        String[] users=userIds.split(",");
                        for(String userId : users){
                            User user=userManager.getUserById(parseLong(userId));
                            if(user!=null){
                                userSet.add(user);
                            }
                        }
                    }
                    String roleIds=request.getParameter("roleIds");
                    Set<Role> roleSet=new HashSet<Role>();
                    if(StringUtils.isNotEmpty(roleIds)){
                        String[] roles=roleIds.split(",");
                        for(String roleId : roles){
                            Role role=roleManager.getRoleById(parseLong(roleId));
                            if(role!=null){
                                roleSet.add(role);
                            }
                        }
                    }
                    def.getUsers().clear();
                    def.getUsers().addAll(userSet);
                    def.getRoles().clear();
                    def.getRoles().addAll(roleSet);
                    processDefManager.authorizationProcessDef(def);
                }
            }
        }catch (Exception e) {
            logger.error("authorization",e);
            return new BaseResultCommand(getMessage("message.processDefController.authorization",request),Boolean.FALSE);
        } 
        return new BaseResultCommand(map);
    }
    @RequestMapping(params = "method=disAuthorization")
    @ResponseBody
    public BaseResultCommand disAuthorization(HttpServletRequest request){
        Map<String,String> map=new HashMap<String, String>();
        try {
            Long id = parseLong(request.getParameter("id"));
            if(id!=null){
                ProcessDef def=processDefManager.getProcessDefById(id);
                if(def!=null){
                    processDefManager.disAuthorization(def);
                }
            }
        }catch (Exception e) {
            logger.error("disAuthorization",e);
            return new BaseResultCommand(getMessage("message.processDefController.disAuthorization",request),Boolean.FALSE);
        } 
        return new BaseResultCommand(map);
    }
    
    
    
    
}
