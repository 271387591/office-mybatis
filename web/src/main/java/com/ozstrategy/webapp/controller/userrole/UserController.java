package com.ozstrategy.webapp.controller.userrole;

import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.userrole.RoleManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.Constants;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.userrole.UserCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 7/4/14.
 */
@Controller
@RequestMapping("userController.do")
public class UserController extends BaseController {
    @Autowired
    private UserManager userManager = null;
    @Autowired 
    private RoleManager roleManager = null;
    protected final transient Log log = LogFactory.getLog(getClass());
    @RequestMapping(params = "method=listUsers")
    @ResponseBody
    public JsonReaderResponse<UserCommand> listUsers(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        String processAssignee=request.getParameter("processAssignee");
        Map<String,Object> map=requestMap(request);
        if(checkIsNotNumber(start)){
            return new JsonReaderResponse<UserCommand>(emptyData, Boolean.FALSE,getMessage("message.error.start",request));
        }
        List<User> users        = userManager.listUsers(map, parseInteger(start), initLimit(limit));
        List<UserCommand> userCommands = new ArrayList<UserCommand>();
        
        if(StringUtils.isNotEmpty(processAssignee)){
            UserCommand userCommand=new UserCommand();
            userCommand.setUsername(Constants.processAssigneeExpression);
            userCommand.setFullName("发起人");
            userCommands.add(userCommand);
        }

        if ((users != null) && (users.size() > 0)) {
            for (User user : users) {
                UserCommand cmd = new UserCommand(user);
                userCommands.add(cmd);
            }
        }
        int count = userManager.listUsersCount(map);
        if(StringUtils.isNotEmpty(processAssignee)){
            count=count+1;
        }
        return new JsonReaderResponse<UserCommand>(userCommands,count);
    }
    @RequestMapping(params = "method=listAllUsers")
    @ResponseBody
    public JsonReaderResponse<UserCommand> listAllUsers(HttpServletRequest request) {
        Map<String,Object> map=requestMap(request);
        List<User> users        = userManager.listAllUsers(map);
        List<UserCommand> userCommands = new ArrayList<UserCommand>();
        if ((users != null) && (users.size() > 0)) {
            for (User user : users) {
                UserCommand cmd = new UserCommand(user);
                userCommands.add(cmd);
            }
        }
        int count = userManager.listUsersCount(map);
        return new JsonReaderResponse<UserCommand>(userCommands,count);
    }
    
    
    @RequestMapping(params = "method=saveUser")
    @ResponseBody
    public BaseResultCommand saveUser(HttpServletRequest request){
        return saveOrUpdate(request,true);
    }
    
    @RequestMapping(params = "method=updateUser")
    @ResponseBody
    public BaseResultCommand updateUser(HttpServletRequest request){
        return saveOrUpdate(request,false);
    }
    @RequestMapping(params = "method=deleteUser")
    @ResponseBody
    public BaseResultCommand deleteUser(HttpServletRequest request){
        String id=request.getParameter("id");
        if(checkIsNotNumber(id)){
            return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
        }
        try{     
            userManager.deleteUser(parseLong(id));
            return new BaseResultCommand(Boolean.TRUE);
        }catch (Exception e){
            logger.error("delete user fail",e);
        }
        return new BaseResultCommand(getMessage("message.error.deleteUser.error",request),Boolean.FALSE);
    }
    @RequestMapping(params = "method=updatePassword")
    @ResponseBody 
    public BaseResultCommand updatePassword(HttpServletRequest request) {
        return changePassword(request,false);
    }
    @RequestMapping(params = "method=updatePasswordByAdmin")
    @ResponseBody 
    public BaseResultCommand updatePasswordByAdmin(HttpServletRequest request) {
        return changePassword(request,true);
    }
    @RequestMapping(params = "method=lockUser")
    @ResponseBody 
    public BaseResultCommand lockUser(HttpServletRequest request) {
        try {
            return lockOrUnlockUser(request,true);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.lock.error",request),Boolean.FALSE);
    }
    @RequestMapping(params = "method=unLockUser")
    @ResponseBody 
    public BaseResultCommand unLockUser(HttpServletRequest request) {
        try {
            return lockOrUnlockUser(request,false);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.unlock.error",request),Boolean.FALSE);
    }
    @RequestMapping(params = "method=disableUser")
    @ResponseBody 
    public BaseResultCommand disableUser(HttpServletRequest request) {
        try {
            return enableOrDisableUser(request,false);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.enable.error",request),Boolean.FALSE);
    }
    @RequestMapping(params = "method=unDisableUser")
    @ResponseBody 
    public BaseResultCommand unDisableUser(HttpServletRequest request) {
        try {
            return enableOrDisableUser(request,true);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.unEnable.error",request),Boolean.FALSE);
    }
    
    @RequestMapping(params = "method=getUserById")
    @ResponseBody
    public BaseResultCommand getUserById(HttpServletRequest request){
        return getUser(request,"id");
    }
    @RequestMapping(params = "method=getUserByUsername")
    @ResponseBody
    public BaseResultCommand getUserByUsername(HttpServletRequest request){
        return getUser(request,"username");
    }
    @RequestMapping(params = "method=getUserByEmail")
    @ResponseBody
    public BaseResultCommand getUserByEmail(HttpServletRequest request){
        return getUser(request,"email");
    }
    @RequestMapping(params = "method=getUserByMobile")
    @ResponseBody
    public BaseResultCommand getUserByMobile(HttpServletRequest request){
        return getUser(request,"mobile");
    }
    private BaseResultCommand getUser(HttpServletRequest request,String type){
        String id=request.getParameter("id");
        String username=request.getParameter("username");
        String email=request.getParameter("email");
        String mobile=request.getParameter("mobile");
        
        if(StringUtils.equals("username",type)){
            if(checkIsEmpty(username)){
                return new BaseResultCommand(getMessage("message.error.username.null",request),Boolean.FALSE);
            }
            try{
                User user=userManager.getUserByUsername(username);
                return new BaseResultCommand(new UserCommand(user));
            }catch (Exception e){
            }
        }else if(StringUtils.equals("email",type)){
            if(checkIsEmpty(email)){
                return new BaseResultCommand(getMessage("message.error.email.null",request),Boolean.FALSE);
            }
            try{
                User user=userManager.getUserByEmail(email);
                return new BaseResultCommand(new UserCommand(user));
            }catch (Exception e){
            }
        }else if(StringUtils.equals("mobile",type)){
            if(checkIsEmpty(mobile)){
                return new BaseResultCommand(getMessage("message.error.mobile.null",request),Boolean.FALSE);
            }
            try{
                User user=userManager.getUserByMobile(mobile);
                return new BaseResultCommand(new UserCommand(user));
            }catch (Exception e){
            }
        }else if(StringUtils.equals("id",type)){
            if(checkIsNotNumber(id)){
                return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
            }
            try{
                User user=userManager.getUserById(parseLong(id));
                return new BaseResultCommand(new UserCommand(user));
            }catch (Exception e){
            }
        }
        return new BaseResultCommand(getMessage("message.error.getUser.error",request),Boolean.FALSE);
        
    }
    
    private BaseResultCommand lockOrUnlockUser(HttpServletRequest request,boolean lock) throws Exception{
        String id=request.getParameter("id");
        if(checkIsNotNumber(id)){
            return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
        }
        User    targetUser  = userManager.getUserById(Long.parseLong(id));
        if(lock){
            targetUser.setAccountLocked(true);
        }else{
            targetUser.setAccountLocked(false);
        }
        targetUser.setLastUpdateDate(new Date());
        userManager.saveOrUpdate(targetUser);
        return new BaseResultCommand(Boolean.TRUE);
    } 
    private BaseResultCommand enableOrDisableUser(HttpServletRequest request,boolean enable) throws Exception{
        String id=request.getParameter("id");
        if(checkIsNotNumber(id)){
            return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
        }
        User    targetUser  = userManager.getUserById(Long.parseLong(id));
        if(enable){
            targetUser.setEnabled(true);
        }else{
            targetUser.setEnabled(false);
        }
        targetUser.setLastUpdateDate(new Date());
        userManager.saveOrUpdate(targetUser);
        return new BaseResultCommand(Boolean.TRUE);
    } 
    
    private BaseResultCommand changePassword(HttpServletRequest request,boolean admin){
        String id=request.getParameter("id");
        String oldPassword=request.getParameter("oldPassword");
        String newPassword=request.getParameter("newPassword");
        if(admin){
            if(checkIsNotNumber(id)){
                return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
            }
        }else{
            if(checkIsEmpty(oldPassword)){
                return new BaseResultCommand(getMessage("message.error.updatePassword.oldPassword.null",request),Boolean.FALSE);
            }
        }
        
        if(checkIsEmpty(newPassword)){
            return new BaseResultCommand(getMessage("message.error.updatePassword.newPassword.null",request),Boolean.FALSE);
        }
        try {
            User user=null;
            if(admin){
                user=userManager.getUserById(parseLong(id));
            }else{
                user = userManager.getUserByUsername(request.getRemoteUser());
            }
            Integer result=userManager.updateUserPassword(user.getId(),oldPassword,newPassword,admin);
            if(result==1){
                return new BaseResultCommand(getMessage("message.error.updatePassword.oldPassword.error",request),Boolean.FALSE);
            }
            return new BaseResultCommand(Boolean.TRUE);
        }catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.updatePassword.fail",request),Boolean.FALSE);
    }
    
    private BaseResultCommand saveOrUpdate(HttpServletRequest request,boolean save){
        User        user        = null;
        String id=request.getParameter("id");
        String username=request.getParameter("username");
        String password=request.getParameter("password");
        String firstName=request.getParameter("firstName");
        String lastName=request.getParameter("lastName");
        String roleIds=request.getParameter("roleIds");
        String defaultRoleId=request.getParameter("defaultRoleId");
        String gender=request.getParameter("gender");
        String email=request.getParameter("email");
        String mobile=request.getParameter("mobile");
        if(!save){
            if(checkIsNotNumber(id)){
                return new BaseResultCommand(getMessage("message.error.id.null",request),Boolean.FALSE);
            }
        }
        if(checkIsEmpty(email)){
            return new BaseResultCommand(getMessage("message.error.email.null",request),Boolean.FALSE);
        }
        if(checkIsEmpty(mobile)){
            return new BaseResultCommand(getMessage("message.error.mobile.null",request),Boolean.FALSE);
        }
        
        if(save){
            if(checkIsEmpty(username)){
                return new BaseResultCommand(getMessage("message.error.username.null",request),Boolean.FALSE);
            }
            if(checkIsEmpty(password)){
                return new BaseResultCommand(getMessage("message.error.password.null",request),Boolean.FALSE);
            }
            if(userManager.getUserByUsername(username)!=null){
                return new BaseResultCommand(getMessage("message.error.username.exist",request),Boolean.FALSE);
            }
            if(userManager.getUserByMobile(mobile)!=null){
                return new BaseResultCommand(getMessage("message.error.getMobileUser.error",request),Boolean.FALSE);
            }
            if(userManager.getUserByEmail(email)!=null){
                return new BaseResultCommand(getMessage("message.error.getEmailUser.error",request),Boolean.FALSE);
            }
        }
        try{
            if(!save){
                user=userManager.getUserById(parseLong(id));
                if(!StringUtils.equals(mobile,user.getMobile())){
                    if(userManager.getUserByMobile(mobile)!=null){
                        return new BaseResultCommand(getMessage("message.error.getMobileUser.exist",request),Boolean.FALSE);
                    }
                }
                if(!StringUtils.equals(email,user.getEmail())){
                    if(userManager.getUserByEmail(email)!=null){
                        return new BaseResultCommand(getMessage("message.error.getEmailUser.exist",request),Boolean.FALSE);
                    }
                }
                user.setVersion(user.getVersion()+1);
            }else{
                user=new User();
                user.setCreateDate(new Date());
                user.setPassword(password);
                user.setVersion(1);
                user.setUsername(username);
            }
            user.setLastUpdateDate(new Date());
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setGender(gender);
            user.setEnabled(Boolean.TRUE);
            user.setMobile(mobile);
            user.setEmail(email);
            if(!checkIsNotNumber(defaultRoleId)){
               Role role=roleManager.getRoleById(parseLong(defaultRoleId));
               user.setDefaultRole(role);
            }
            Set<Role> roleSet  = new HashSet<Role>();
            if(StringUtils.isNotEmpty(roleIds)){
                String[] roleIdes=StringUtils.split(roleIds,",");
                if(roleIdes!=null){
                    for(String roleId:roleIdes){
                        Role role = roleManager.getRoleById(parseLong(roleId));
                        roleSet.add(role);
                    }
                }
            }
            user.getRoles().clear();
            user.getRoles().addAll(roleSet);
            userManager.saveOrUpdate(user);
            return new BaseResultCommand("",true);
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return new BaseResultCommand(getMessage("message.error.saveuser.fail",request),Boolean.FALSE);
    } 
}
