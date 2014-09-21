package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessElementForm;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface ProcessElementFormDao {
    List<ProcessElementForm> listProcessElementForms(Map<String,Object> map,RowBounds rowBounds);
    List<ProcessElementForm> getProcessElementFormsByEid(Long elementId);
    Integer listProcessElementFormsCount(Map<String,Object> map);
    ProcessElementForm getProcessElementFormById(Long id);
    void saveProcessElementForm(ProcessElementForm ProcessElementForm);
    void updateProcessElementForm(ProcessElementForm ProcessElementForm);
    void deleteProcessElementForm(Long id);
    void deleteProcessElementFormByElementId(Long elementId);
    void deleteProcessElementFormByDefId(Long defId);
}
