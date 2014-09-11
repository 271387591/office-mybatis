package com.ozstrategy.service.system.impl;

import com.ozstrategy.dao.system.GlobalTypeDao;
import com.ozstrategy.model.system.GlobalType;
import com.ozstrategy.service.system.GlobalTypeManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service("globalTypeManager")
public class GlobalTypeManagerImpl implements GlobalTypeManager {
    @Autowired
    GlobalTypeDao globalTypeDao;


    public void removeGlobalType(Long typeId) {
        globalTypeDao.delete(typeId);
    }

    @Transactional
    public void saveGlobalType(GlobalType globalType) {
        if (globalType.getTypeId() == null) {
            globalTypeDao.save(globalType);
        }
        GlobalType parent = globalType.getParent();
        if (parent == null || parent.getTypeId() == 0L) {
            globalType.setPath((new StringBuilder()).append("0.").append(globalType.getTypeId()).append(".").toString());
            globalType.setDepth(Integer.valueOf(1));

        } else {
            GlobalType parentGlobalType = globalTypeDao.getGlobalTypeById(parent.getTypeId());
            globalType.setPath((new StringBuffer()).append(parentGlobalType.getPath()).append(globalType.getTypeId()).append(".").toString());
            globalType.setDepth(Integer.valueOf(parentGlobalType.getDepth() != null ? Integer.valueOf(parentGlobalType.getDepth().intValue()) + 1 : Integer.valueOf(1)));
        }
        globalTypeDao.update(globalType);
    }

    public GlobalType getGlobalType(Long globalTypeId) {
        return globalTypeDao.getGlobalTypeById(globalTypeId);
    }

    public List<GlobalType> getGlobalTypeByCatKey(Map<String,Object> map, Integer start, Integer limit) {
        return globalTypeDao.listGlobalTypes(map,new RowBounds(start,limit));
    }

    @Transactional
    public void multiDel(List<Long> ids) {
        for(Long id : ids){
            GlobalType globalType=globalTypeDao.getGlobalTypeById(id);
            if(globalType!=null){
                if(globalType.getChildren().size()>0){
                    globalTypeDao.removeChild(globalType.getTypeId());
                }
                globalTypeDao.delete(id);
            }
        }
    }

    public Integer countGlobalTypeByCatKey(Map<String,Object> map) {
        return globalTypeDao.listGlobalTypesCount(map);
    }

    public List<GlobalType> getGlobalTypeWithoutParent(String catKey) {
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("catKey",catKey);
        return globalTypeDao.getGlobalTypeWithoutParent(map);
    }
}
