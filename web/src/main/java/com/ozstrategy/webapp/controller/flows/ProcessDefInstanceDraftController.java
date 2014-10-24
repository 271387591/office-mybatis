package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.ProcessDefInstanceDraft;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefInstanceDraftManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessDefInstanceDraftCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
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
 * Created by lihao on 9/28/14.
 */
@Controller
@RequestMapping("processDefInstanceDraftController.do")
public class ProcessDefInstanceDraftController extends BaseController {
    @Autowired
    private UserManager userManager;
    @Autowired
    private ProcessDefInstanceDraftManager processDefInstanceDraftManager;
    
    @RequestMapping(params = "method=listProcessDefInstanceDraft")
    @ResponseBody
    public JsonReaderResponse<ProcessDefInstanceDraftCommand> listProcessDefInstanceDraft(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        String username=request.getRemoteUser();
        
        Map<String,Object> map=requestMap(request);
        List<ProcessDefInstanceDraftCommand> commands=new ArrayList<ProcessDefInstanceDraftCommand>();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<ProcessDefInstanceDraftCommand>(commands,Boolean.FALSE,"登陆超时");
        }
        User user=userManager.getUserByUsername(username);
        if(user!=null){
            map.put("creatorId",user.getId());
        }
        List<ProcessDefInstanceDraft> items= processDefInstanceDraftManager.listProcessDefInstanceDrafts(map, parseInteger(start), parseInteger(limit));
        if(items!=null && items.size()>0){
            for(ProcessDefInstanceDraft item : items){
                ProcessDefInstanceDraftCommand command=new ProcessDefInstanceDraftCommand(item);
                commands.add(command);
            }
        }
        Integer count=processDefInstanceDraftManager.listProcessDefInstanceDraftsCount(map);
        return new JsonReaderResponse<ProcessDefInstanceDraftCommand>(commands,count);
    }
    @RequestMapping(params = "method=save")
    @ResponseBody
    public BaseResultCommand save(HttpServletRequest request){
        try {
            Map<String,Object> map=requestMap(request);
            Long id=parseLong(request.getParameter("id"));
            User user=userManager.getUserByUsername(request.getRemoteUser());
            if(user==null){
                return new BaseResultCommand(getMessage("登陆超时",request),Boolean.FALSE);
            }
            ProcessDefInstanceDraft draft=null;
            if(id!=null){
                draft=processDefInstanceDraftManager.getProcessDefInstanceDraftById(id);
            }else{
                draft=new ProcessDefInstanceDraft();
                draft.setCreateDate(new Date());
                draft.setCreator(user);
            }
            BeanUtils.populate(draft, map);
            draft.setLastUpdateDate(new Date());
            draft.setLastUpdater(user);
            if(id==null){
                processDefInstanceDraftManager.saveProcessDefInstanceDraft(draft);
            }else{
                processDefInstanceDraftManager.updateProcessDefInstanceDraft(draft);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            logger.error("保存流程草稿失败，详细异常:",e);
            return new BaseResultCommand(getMessage("保存流程草稿失败",request),Boolean.FALSE);
        }catch (Exception e) {
            e.printStackTrace();
            logger.error("保存流程草稿失败，详细异常:",e);
            return new BaseResultCommand(getMessage("保存流程草稿失败",request),Boolean.FALSE);
        }
        return new BaseResultCommand(Boolean.TRUE);
    }
    @RequestMapping(params = "method=delete")
    @ResponseBody
    public BaseResultCommand delete(HttpServletRequest request){
        try {
            Long id=parseLong(request.getParameter("id"));
            User user=userManager.getUserByUsername(request.getRemoteUser());
            if(user==null){
                return new BaseResultCommand(getMessage("登陆超时",request),Boolean.FALSE);
            }
            ProcessDefInstanceDraft draft=null;
            if(id!=null){
                draft=processDefInstanceDraftManager.getProcessDefInstanceDraftById(id);
                User creator=draft.getCreator();
                if(creator==null && creator.getId()!=user.getId()){
                    return new BaseResultCommand(getMessage("无操作权限",request),Boolean.FALSE);
                }
                processDefInstanceDraftManager.deleteProcessDefInstanceDraft(draft.getId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("删除流程草稿错误，详细异常:",e);
            return new BaseResultCommand(getMessage("删除流程草稿错误",request),Boolean.FALSE);
        }
        return new BaseResultCommand(Boolean.TRUE);
    }
    
}
