package com.ozstrategy.webapp.controller.userrole;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.userrole.FeatureManager;
import com.ozstrategy.service.userrole.RoleManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.userrole.FeatureCommand;
import com.ozstrategy.webapp.command.userrole.RoleCommand;
import com.ozstrategy.webapp.command.userrole.RoleTreeCommand;
import com.ozstrategy.webapp.command.userrole.UserCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("userRoleController.do")
public class UserRoleController extends BaseController {
  protected final transient Log log = LogFactory.getLog(getClass());

  @Autowired private FeatureManager featureManager;


  @Autowired private RoleManager roleManager = null;
    

  @Autowired private UserManager userManager = null;
  @Autowired private ProcessDefManager processDefManager = null;
    
  
  @RequestMapping(params = "method=getAvailableFeatures")
  @ResponseBody public JsonReaderResponse<FeatureCommand> getAvailableFeatures(String roleId,
    HttpServletRequest request) {
    List<FeatureCommand> result = new ArrayList<FeatureCommand>();
    int                  total  = 0;
    Map<String,Object> map=requestMap(request);
    try {
      List<Feature> features = featureManager.listAllFeatures(map);
// String roleId= params.get("roleId");
      if (StringUtils.isNotEmpty(roleId)) {
        List<Feature> featureList = featureManager.getFeaturesByRoleId(parseLong(roleId));

        for (Feature feature : featureList) {
          if (features.contains(feature)) {
            features.remove(feature);
          }
        }
      }

      for (Feature feature : features) {
        result.add(new FeatureCommand(feature));
      }
    } catch (Exception e) {
      log.error(e, e);
      // return empty
    } // end try-catch

    total = result.size();

    return new JsonReaderResponse<FeatureCommand>(result, total);

  } 

  @RequestMapping(params = "method=getFeaturesOfRole")
  @ResponseBody 
  public JsonReaderResponse<FeatureCommand> getFeaturesOfRole(String roleId, HttpServletRequest request) {
    List<FeatureCommand> result = new ArrayList<FeatureCommand>();
    int                  total  = 0;

    try {
// String roleId = params.get("roleId");
      if (StringUtils.isNotEmpty(roleId)) {
        List<Feature> features = featureManager.getFeaturesByRoleId(parseLong(roleId));

        for (Feature feature : features) {
          result.add(new FeatureCommand(feature));
        }

      }
    } catch (Exception e) {
      log.error(e, e);
      // return empty
    } // end try-catch

    total = result.size();

    return new JsonReaderResponse<FeatureCommand>(result, total);
  }
    @RequestMapping(params = "method=getAllRoleList")
    @ResponseBody
    public List<RoleTreeCommand> getAllRoleList(HttpServletRequest request) {
        List<Role> roleList = roleManager.listAllRoles(requestMap(request));
        List<RoleTreeCommand> list = new ArrayList<RoleTreeCommand>();
        RoleTreeCommand roleCmd = null;
        if (roleList != null && roleList.size() > 0) {
            for (Role role : roleList) {
                roleCmd = new RoleTreeCommand(role);
                list.add(roleCmd);
            }
        }
        return list;
    }
    @RequestMapping(params = "method=listSelectorUsers")
    @ResponseBody
    public JsonReaderResponse<UserCommand> listSelectorUsers(HttpServletRequest request) {
        String roleId=request.getParameter("roleId");
        Long rId=null;
        if(StringUtils.isNotEmpty(roleId)){
            rId=Long.parseLong(roleId);
        }
        Map<String,Object> map=requestMap(request);
        List<User> users = userManager.getUserByRoleId(rId);
        List<UserCommand> userCommands = new ArrayList<UserCommand>();
        if (users != null && users.size() > 0) {
            for (User user : users) {
                UserCommand cmd = new UserCommand(user);
                userCommands.add(cmd);
            }
        }
        Integer count = userManager.listUsersCount(map);
        return new JsonReaderResponse<UserCommand>(userCommands, count);
    }
    @RequestMapping(params = "method=checkRoleInUser")
    @ResponseBody
    public BaseResultCommand checkRoleInUser(HttpServletRequest request){
        String roleId=request.getParameter("roleId");
        Long rId=parseLong(roleId);
        if(rId!=null){
            List<User> users = userManager.getUserByRoleId(rId);
            if(users!=null && users.size()>0){
                return new BaseResultCommand(getMessage("userRoleRes.msg.removeRoleMsg",request),Boolean.TRUE);
            }
            Boolean checkProcessUseRole=processDefManager.checkProcessUseRole(rId);
            if(checkProcessUseRole){
                return new BaseResultCommand(getMessage("userRoleRes.msg.removeRoleFlowMsg",request),Boolean.TRUE);
            }
        }
        return new BaseResultCommand("",Boolean.FALSE); 
    }
    

  
  @RequestMapping(params = "method=listFeatures")
  @ResponseBody 
  public JsonReaderResponse<FeatureCommand> listFeatures(@RequestParam Map<String, String> params,
    HttpServletRequest request) {
    List<Feature>        features        = featureManager.listFeatures(requestMap(request),
            Integer.valueOf(params.get("start")), Integer.valueOf(params.get("limit")));
    List<FeatureCommand> featureCommands = new ArrayList<FeatureCommand>();

    if ((features != null) && (features.size() > 0)) {
      for (Feature feature : features) {
        FeatureCommand cmd = new FeatureCommand(feature);
        featureCommands.add(cmd);
      }
    }

    int count = featureCommands.size();

    return new JsonReaderResponse<FeatureCommand>(featureCommands, count);
  }
    @RequestMapping(params = "method=saveOrUpdate")
    @ResponseBody
    public JsonReaderResponse<FeatureCommand> saveOrUpdate(HttpServletRequest request){
//        for(int i=0;i<featureCommands.size();i++){
//            FeatureCommand featureCommand = featureCommands.get(i);
        String id=request.getParameter("id");
        String name=request.getParameter("name");
        String displayName=request.getParameter("displayName");
        String description=request.getParameter("description");
        String criteria=request.getParameter("criteria");
        Feature feature = null;
        if(StringUtils.isNotEmpty(id)){
            feature=featureManager.getFeatureById(Long.parseLong(id));
        }else{
            if(StringUtils.isNotEmpty(name)){
                feature=featureManager.getFeatureByName(name);
                if(feature!=null){
                    return new JsonReaderResponse<FeatureCommand>(null,false,"失败");
                }
            }
            feature=new Feature();
            feature.setCreateDate(new Date());
        }
        feature.setLastUpdateDate(new Date());
        feature.setName(name);
        feature.setDisplayName(displayName);
        feature.setDescription(description);
        feature.setCriteria(criteria);
//        featureManager.(feature);
        return new JsonReaderResponse<FeatureCommand>(null,true,"");
    }

  @RequestMapping(params = "method=listRoles")
  @ResponseBody 
  public JsonReaderResponse<RoleCommand> listRoles(HttpServletRequest request) {
      Integer start=Integer.parseInt(request.getParameter("start"));
      Integer limit=Integer.parseInt(request.getParameter("limit"));
      Map<String,Object> map=requestMap(request);
      
      List<Role>        roles        = roleManager.listRoles(map,start, limit);
      List<RoleCommand> roleCommands = new ArrayList<RoleCommand>();

        if ((roles != null) && (roles.size() > 0)) {
          for (Role role : roles) {
              RoleCommand command=new RoleCommand(role);
              List<RoleFeature> roleFeatures=roleManager.getRoleFeatureByRoleId(role.getId());
              List<FeatureCommand> featureCommands=new ArrayList<FeatureCommand>();
              if(roleFeatures!=null){
                  for(RoleFeature roleFeature : roleFeatures){
                      featureCommands.add(new FeatureCommand(roleFeature.getFeature()));
                  }
              }
              command.getSimpleFeatures().clear();
              command.getSimpleFeatures().addAll(featureCommands);
            roleCommands.add(command);
          }
        }

    Integer count = roleManager.listRolesCount(map);

    return new JsonReaderResponse<RoleCommand>(roleCommands, true,count.intValue(),getMessage("display.title",request));
  }


  @RequestMapping(params = "method=readAvailableRoles")
  @ResponseBody 
  public JsonReaderResponse<RoleCommand> readAvailableRoles(HttpServletRequest request) {
    List<RoleCommand> result = new ArrayList<RoleCommand>();
    try {
      List<Role> roles     = roleManager.listAllRoles(requestMap(request));
      for (Role role : roles) {
        result.add(new RoleCommand(role));
      }
    } catch (Exception e) {
      log.error(e, e);
    } // end try-catch

    return new JsonReaderResponse<RoleCommand>(result, true,"");
  } 
    @RequestMapping(params = "method=readAvailableFeature")
    @ResponseBody 
    public JsonReaderResponse<FeatureCommand> readAvailableFeature(HttpServletRequest request) {
        List<FeatureCommand> result = new ArrayList<FeatureCommand>();
        try {
            List<Feature> features=featureManager.listAllFeatures(requestMap(request));
            if(features!=null && features.size()>0){
                for(Feature feature : features){
                    result.add(new FeatureCommand(feature));
                }
            }
        } catch (Exception e) {
            log.error(e, e);
        } // end try-catch

        return new JsonReaderResponse<FeatureCommand>(result, true,"");
    }
    
  @RequestMapping(params = "method=removeRole")
  @ResponseBody 
  public BaseResultCommand removeRole(String id, HttpServletRequest request) {
    roleManager.removeRoleById(parseLong(id));

    return new BaseResultCommand(true);
  }

    @RequestMapping(params = "method=saveRole")
    @ResponseBody
    public BaseResultCommand saveRole(HttpServletRequest request){
          return saveOrUpdateRole(request,true);
    }
    @RequestMapping(params = "method=updateRole")
    @ResponseBody
    public BaseResultCommand updateRole(HttpServletRequest request){
          return saveOrUpdateRole(request,false);
    }
    
    private BaseResultCommand saveOrUpdateRole(HttpServletRequest request,boolean save){
        try {
            String id=request.getParameter("id");
            String name=request.getParameter("name");
            String displayName=request.getParameter("displayName");
            String description=request.getParameter("description");
            String featureIds=request.getParameter("featureIds");
            String systemViewId=request.getParameter("systemViewId");
            Role role=null;
            if(save){
                if(!checkIsEmpty(name)){
                    role = roleManager.getRoleByName(name);
                    if(role!=null){
                        return new BaseResultCommand(getMessage("message.error.role.exist",request),Boolean.FALSE);
                    }
                }
                role=new Role();
                role.setCreateDate(new Date());
                role.setName(name);
            }else{
                role=roleManager.getRoleById(parseLong(id));
            }
            role.setLastUpdateDate(new Date());
            role.setDescription(description);
            role.setDisplayName(displayName);
            if(!checkIsEmpty(systemViewId)){
                SystemView systemView  = userManager.getSystemViewById(Long.parseLong(systemViewId));
                role.setSystemView(systemView);
            }
            List<Feature> features=new ArrayList<Feature>();
            if(!checkIsEmpty(featureIds)){
                String[] featureIda = StringUtils.split(featureIds,",");
                if(featureIda!=null){
                    for(String fid : featureIda){
                        Feature feature=featureManager.getFeatureById(parseLong(fid));
                        if(feature!=null){
                            features.add(feature);
                        }
                    }
                }
            }
            roleManager.saveOrUpdate(role, features);
            return new BaseResultCommand(Boolean.TRUE);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("save role fail",e);
        }
        return new BaseResultCommand(getMessage(save?"globalRes.addFail":"globalRes.updateFail",request),Boolean.FALSE);
    }
} 
