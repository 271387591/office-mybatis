package com.ozstrategy.util;

import org.activiti.engine.ProcessEngines;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.cmd.GetDeploymentProcessDefinitionCmd;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.interceptor.CommandExecutor;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang.ObjectUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/25/13
 * Time: 9:37 AM
 * To change this template use File | Settings | File Templates.
 */
public class ProcessDefineCache {
    private static Map<String,ActivityImpl> singleActivity=new ConcurrentHashMap<String,ActivityImpl>();
    private static Map<String,List<ActivityImpl>> activities=new ConcurrentHashMap<String,List<ActivityImpl>>();
    private static Map<String, ProcessDefinition> processDefinitionMap = new ConcurrentHashMap<String, ProcessDefinition>();
    private static RepositoryService repositoryService= ProcessEngines.getDefaultProcessEngine().getRepositoryService();
    private static Map<String,Map<String,String>> processStartFormData=new ConcurrentHashMap<String, Map<String,String>>();
    public static void put(String definitionId,ProcessDefinition processDefinition){
        processDefinitionMap.put(definitionId,processDefinition);
        ProcessDefinitionEntity pde = (ProcessDefinitionEntity) processDefinition;
        activities.put(definitionId, pde.getActivities());
        for (ActivityImpl activityImpl : pde.getActivities()) {
            singleActivity.put(definitionId + "_" + activityImpl.getId(), activityImpl);
        }
    }
    public static ProcessDefinition get(String definitionId){
        processDefinitionMap.clear();
        ProcessDefinition processDefinition=processDefinitionMap.get(definitionId);
        if(processDefinition == null){
//            processDefinition=(ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService).getDeployedProcessDefinition(definitionId);
            RepositoryServiceImpl repositoryService1=(RepositoryServiceImpl)repositoryService;
            CommandExecutor executor = repositoryService1.getCommandExecutor();
            processDefinition = executor.execute(new GetDeploymentProcessDefinitionCmdNoCache(definitionId));
            if(processDefinition!=null){
                put(definitionId,processDefinition);
            }
        }
        return processDefinition;
    }
    public static List<ActivityImpl> getActivityImpls(String definitionId){
        ProcessDefinition processDefinition=get(definitionId);
        if(processDefinition!=null){
            return activities.get(definitionId);
        }
        return null;
    }
    public static ActivityImpl getActivityImpl(String definitionId, String activityId){
        ProcessDefinition processDefinition=get(definitionId);
        if(processDefinition!=null) {
            ActivityImpl activity=singleActivity.get(definitionId+"_"+activityId);
            if(activity!=null){
                return activity;
            }
        }
        return null;
    }
    public static String getActivityName(String definitionId, String activityId){
        ActivityImpl activity = getActivityImpl(definitionId,activityId);
        if(activity!=null){
            String name= ObjectUtils.toString(activity.getProperty("name"));
            return name;
        }
        return null;
    }
    public static void putStartFormData(String userId,Map<String,String> data){
        processStartFormData.put(userId,data);
    }
    public static Map<String,String> getStartFormData(String userId){
        Map<String,String> data = processStartFormData.get(userId);
        if(data!=null){
            return data;
        }
        return null;
    }
    public static void cleanStartFormData(String userId){
        processStartFormData.remove(userId);
    }
    public static class GetDeploymentProcessDefinitionCmdNoCache extends GetDeploymentProcessDefinitionCmd {

        public GetDeploymentProcessDefinitionCmdNoCache(String processDefinitionId) {
            super(processDefinitionId);
        }
        public ProcessDefinitionEntity execute(CommandContext commandContext) {
           Context.getProcessEngineConfiguration().getDeploymentManager().getProcessDefinitionCache().clear();
           return Context.getProcessEngineConfiguration().getDeploymentManager().findDeployedProcessDefinitionById(processDefinitionId);
        }
    }
}
