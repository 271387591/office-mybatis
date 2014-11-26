package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface ProcessDefDao {
    List<ProcessDef> listProcessDefs(Map<String,Object> map,RowBounds rowBounds);
    List<ProcessDef> getProcessDefByName(String name);
    Integer listProcessDefsCount(Map<String,Object> map);
    ProcessDef getProcessDefById(Long id);
    ProcessDef getProcessDefByActId(String actId);
    ProcessDef getProcessDefByModelId(String modelId);
    ProcessDef getProcessDefByDepId(String depId);
    ProcessDef getProcessDefByName(@Param("name")String name,@Param("typeId")Long typeId);
    void saveProcessDef(ProcessDef processDef);
    void updateProcessDef(ProcessDef processDef);
    void deleteProcessDef(Long id);
    void removeChild(Long parentId);
    Long checkNameExist(@Param("name")String name,@Param("typeId")Long typeId);
    
    void saveProcessDefUser(@Param("userId")Long userId,@Param("id")Long id);
    void saveProcessDefRole(@Param("roleId")Long roleId,@Param("id")Long id);
    void deleteProcessDefUser(Long id);
    void deleteProcessDefRole(Long id);
    
    List<User> getProcessDefUser(Long id);
    List<Role> getProcessDefRole(Long id);

    List<ProcessDef> getProcessDefinition(Map<String,Object> map,RowBounds rowBounds);
    Integer getProcessDefinitionCount(Map<String,Object> map);

    List<ProcessDef> getProcessDefByRoleId(Long roleId);
    List<ProcessDef> getProcessDefByFormId(Long formId);
    
    
}
