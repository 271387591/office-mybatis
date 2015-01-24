package com.ozstrategy.webapp.controller.forms;

import com.ozstrategy.model.system.SystemMessage;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.system.SystemMessageManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.system.SystemMessageCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 12/1/14.
 */
@Controller
@RequestMapping("systemMessageController.do")
public class SystemMessageController extends BaseController {
    @Autowired
    private SystemMessageManager systemMessageManager;
    @Autowired
    private UserManager userManager;
    
    @RequestMapping(params = "method=listSystemMessages")
    @ResponseBody
    public JsonReaderResponse<SystemMessageCommand> listSystemMessages(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        String username=request.getRemoteUser();
        Map<String,Object> map=requestMap(request);
        List<SystemMessageCommand> commands=new ArrayList<SystemMessageCommand>();
        if(StringUtils.isEmpty(username)){
            return new JsonReaderResponse<SystemMessageCommand>(commands,Boolean.FALSE,getMessage("message.error.login.timeout",request));
        }
        User user= userManager.getUserByUsername(username);
        map.put("receiver",user);
        List<SystemMessage> messages=systemMessageManager.listSystemMessages(map,parseInteger(start),parseInteger(limit));
        if(messages!=null && messages.size()>0){
            for(SystemMessage message : messages){
                SystemMessageCommand command=new SystemMessageCommand(message);
                commands.add(command);
            }
        }
        Integer count=systemMessageManager.listSystemMessagesCount(map);
        return new JsonReaderResponse<SystemMessageCommand>(commands,count);
    }
    @RequestMapping(params = "method=multiRemove")
    @ResponseBody
    public BaseResultCommand multiRemove(HttpServletRequest request){
        String ids=request.getParameter("ids");
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(ids)){
            try{
                String[] idsa=ids.split(",");
                Set<Long> idset=new HashSet<Long>();
                if(idsa!=null && idsa.length>0){
                    for(String id:idsa){
                        idset.add(parseLong(id));
                    }
                }
                systemMessageManager.multiRemove(idset);
            }catch (Exception e){
                logger.error("multiRemove",e);
                return new BaseResultCommand(getMessage("systemRes.systemMessage.delMsgFail",request),false);
            }
            return new BaseResultCommand("",true);
        }
        return new BaseResultCommand("",false);
    }
}
