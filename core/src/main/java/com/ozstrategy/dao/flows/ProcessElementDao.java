package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.userrole.User;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface ProcessElementDao {
    List<ProcessElement> listProcessElements(Map<String,Object> map,RowBounds rowBounds);
    List<ProcessElement> getProcessElementByTaskKey(String taskKey);
    List<ProcessElement> getProcessElementByDefId(Long defId);
    List<User> getProcessElementUsers(Long id);
    ProcessElement getProcessElementById(Long id);
    Integer listProcessElementsCount(Map<String,Object> map);
    void saveProcessElement(ProcessElement ProcessElement);
    void updateProcessElement(ProcessElement ProcessElement);
    void deleteProcessElement(Long id);
    void deleteProcessElementByDefId(Long defId);
}
