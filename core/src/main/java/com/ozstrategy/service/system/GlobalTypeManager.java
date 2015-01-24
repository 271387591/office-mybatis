package com.ozstrategy.service.system;

import com.ozstrategy.model.system.GlobalType;

import java.util.List;
import java.util.Map;

public interface GlobalTypeManager {
  void removeGlobalType(Long typeId);

  void saveGlobalType(GlobalType globalType);


  GlobalType getGlobalType(Long globalTypeId);

  List<GlobalType> getGlobalTypeByCatKey(Map<String,Object> map, Integer start, Integer limit);

  void multiDel(List<Long> ids);

  public Integer countGlobalTypeByCatKey(Map<String,Object> map);

  List<GlobalType> getGlobalTypeWithoutParent(String catKey);

} 
