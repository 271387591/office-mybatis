package com.ozstrategy.dao.forms;

import com.ozstrategy.model.forms.FlowForm;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 8/8/14.
 */
public interface FlowFormDao{
    List<FlowForm> listFlowForms(Map<String,Object> map,RowBounds rowBounds);
    Integer listFlowFormsCount(Map<String,Object> map);
    FlowForm getFlowFormByNameAndParentId(String name, Long parentId);
    FlowForm getFlowFormById(Long id);
    FlowForm getNoCascadeFlowFormById(Long id);
    List<FlowForm> getFlowFormByName(String name);
    void removeChild(Long parentId);
    void saveFlowForm(FlowForm flowForm);
    void updateFlowForm(FlowForm flowForm);
    void deleteFlowForm(FlowForm flowForm);
    List<FlowForm> getChild(Long id);
    
}
