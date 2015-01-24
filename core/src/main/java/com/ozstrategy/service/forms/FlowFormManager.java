package com.ozstrategy.service.forms;

import com.ozstrategy.Constants;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FormField;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 8/8/14.
 */
public interface FlowFormManager extends Constants {
    void saveOrUpdate(FlowForm flowForm,String jsonHtml) throws Exception;
    List<FlowForm> listAll(Map<String,Object> map);
    List<FlowForm> listFlowForms(Map<String,Object> map, Integer start, Integer limit);
    Integer listFlowFormsCount(Map<String,Object> map);
    FlowForm getFlowFormById(Long id);
    FlowForm getNoCascadeFlowFormById(Long id);
    FlowForm getFlowFormByName(String name);
    void multiRemove(String[] ids);
    void publish(String[] ids);
    List<FormField> getDefFormFieldByFormId(Long formId);
    
}
