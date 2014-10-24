package com.ozstrategy.service.flows;

import org.activiti.engine.runtime.Execution;

/**
 * Created by lihao on 10/22/14.
 */

public interface MultiInstanceLoopService {
    boolean canComplete(Execution execution, Integer nrOfInstances, Integer nrOfActiveInstances, Integer nrOfCompletedInstances,Integer loopCounter);
}
