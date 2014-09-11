package com.ozstrategy.webapp.controller.system;

import com.ozstrategy.model.system.GlobalType;
import com.ozstrategy.service.system.GlobalTypeManager;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.system.GlobalTypeCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/4/13
 * Time: 4:23 PM
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping("globalTypeController.do")
public class GlobalTypeController extends BaseController {
    @Autowired
    private GlobalTypeManager globalTypeManager;

    @RequestMapping(params = "method=listGlobalTypes")
    @ResponseBody
    public JsonReaderResponse<GlobalTypeCommand> listGlobalTypes(HttpServletRequest request) {
        Map<String,Object> map=requestMap(request);
        Integer start = null;
        Integer limit = null;
        List<GlobalTypeCommand> commands = new ArrayList<GlobalTypeCommand>();
        if (request.getParameter("start") != null && !"".equals(request.getParameter("start"))) {
            start = Integer.valueOf(request.getParameter("start"));
        }
        if (request.getParameter("limit") != null && !"".equals(request.getParameter("limit"))) {
            limit = Integer.valueOf(request.getParameter("limit"));
        }
        List<GlobalType> globalTypes = globalTypeManager.getGlobalTypeByCatKey(map, start, limit);
        if (globalTypes != null && globalTypes.size() > 0) {
            for (GlobalType globalType : globalTypes) {
                GlobalTypeCommand command = new GlobalTypeCommand(globalType, Boolean.FALSE);
                commands.add(command);
            }
        }
        Integer total = globalTypeManager.countGlobalTypeByCatKey(map);
        return new JsonReaderResponse<GlobalTypeCommand>(commands, true, total == null ? 0 : total, "");
    }

    @RequestMapping(params = "method=getTreeList")
    @ResponseBody
    public List<GlobalTypeCommand> getAllOrgList(HttpServletRequest request) {
        String catKey = request.getParameter("catKey");
        String expand = request.getParameter("expand");
        List<GlobalType> globalTypeList = globalTypeManager.getGlobalTypeWithoutParent(catKey);
        List<GlobalTypeCommand> list = new ArrayList<GlobalTypeCommand>();
        if (globalTypeList != null && globalTypeList.size() > 0) {
            for (GlobalType globalType : globalTypeList) {
                list.add(new GlobalTypeCommand(globalType, Boolean.FALSE));
            }
        }
        return list;
    }

    @RequestMapping(params = "method=getArchTreeList")
    @ResponseBody
    public List<GlobalTypeCommand> getArchTreeList(HttpServletRequest request) {
        String catKey = request.getParameter("catKey");
        List<GlobalType> globalTypeList = globalTypeManager.getGlobalTypeWithoutParent(catKey);
        List<GlobalTypeCommand> list = new ArrayList<GlobalTypeCommand>();
        Set<GlobalTypeCommand> children = new HashSet<GlobalTypeCommand>();
        if (globalTypeList != null && globalTypeList.size() > 0) {
            for (GlobalType globalType : globalTypeList) {
                children.add(new GlobalTypeCommand(globalType, Boolean.TRUE));
            }
        }
        GlobalTypeCommand root = new GlobalTypeCommand();
        root.setId(0L);
        root.setText("总分类");
        root.setExpanded(Boolean.TRUE);
        root.setLeaf(false);
        root.setChildren(children);
        root.setIconCls("");
        list.add(root);
        return list;
    }

    @RequestMapping(params = "method=saveOrUpdate")
    @ResponseBody
    public JsonReaderResponse<GlobalTypeCommand> saveOrUpdate(GlobalTypeCommand command, Map<String, String> params, HttpServletRequest request) {
        if (command != null) {
            Long globalTypeId = command.getTypeId();
            GlobalType globalType = null;
            if (globalTypeId != null) {
                globalType = globalTypeManager.getGlobalType(globalTypeId);
                globalType.setLastUpdateDate(new Date());
                globalType.setTypeName(command.getTypeName());
                globalType.setTypeKey(command.getTypeKey());
            } else {
                globalType = new GlobalType();
                globalType.setTypeName(command.getTypeName());
                globalType.setTypeKey(command.getTypeKey());
                globalType.setCatKey(command.getCatKey());
                globalType.setDepth(command.getDepth());
                globalType.setPriority(command.getPriority());
                if (command.getParentId() != null && command.getParentId() != 0) {
                    GlobalType parentGlobalType = globalTypeManager.getGlobalType((command.getParentId()));
                    if (parentGlobalType != null) {
                        globalType.setParent(parentGlobalType);
                    }
                }
            }
            globalTypeManager.saveGlobalType(globalType);
            return new JsonReaderResponse<GlobalTypeCommand>(Collections.EMPTY_LIST, true, "");
        }
        return new JsonReaderResponse<GlobalTypeCommand>(Collections.EMPTY_LIST, false, "");
    }

    @RequestMapping(params = "method=removeGlobalType")
    @ResponseBody
    public JsonReaderResponse<GlobalTypeCommand> removeGlobalType(String globalTypeIds, HttpServletRequest request) {
        if (globalTypeIds != null) {
            String[] globalTypeStr = globalTypeIds.split(",");
            if (globalTypeStr != null && globalTypeStr.length > 0) {
                List<Long> list = new ArrayList<Long>();
                for (String globalTypeId : globalTypeStr) {
                    Long id = null;
                    id = Long.valueOf(globalTypeId);
                    list.add(id);
                }
                globalTypeManager.multiDel(list);
            }
            return new JsonReaderResponse<GlobalTypeCommand>(Collections.EMPTY_LIST, true, "");
        }
        return new JsonReaderResponse<GlobalTypeCommand>(Collections.EMPTY_LIST, false, "");
    }


}
