package com.ozstrategy.service.flows;

import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.userrole.User;

import java.util.Map;

/**
 * Created by lihao on 9/27/14.
 */
public interface ProcessDefInstanceManager {
    void runStartNoneEventPro(User user,ProcessDef def,Map<String,Object> map) throws OzException,Exception;
    ProcessDefInstance getProcessDefInstanceById(Long id);
}
