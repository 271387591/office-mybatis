package com.ozstrategy.webapp.controller.userrole;

import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.userrole.SystemViewCommand;
import com.ozstrategy.webapp.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by lihao on 7/24/14.
 */
@Controller
@RequestMapping("systemViewController.do")
public class SystemViewController extends BaseController{
    @Autowired
    UserManager userManager;
    @RequestMapping(params = "method=listSystemView")
    @ResponseBody
    public JsonReaderResponse<SystemViewCommand> listSystemView(HttpServletRequest request) {
        List<SystemView> users        = userManager.listSystemView();
        List<SystemViewCommand> userCommands = new ArrayList<SystemViewCommand>();

        if ((users != null) && (users.size() > 0)) {
            for (SystemView user : users) {
                SystemViewCommand cmd = new SystemViewCommand(user);
                userCommands.add(cmd);
            }
        }
        return new JsonReaderResponse<SystemViewCommand>(userCommands);
    }
}
