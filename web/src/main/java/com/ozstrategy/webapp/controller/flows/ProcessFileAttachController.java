package com.ozstrategy.webapp.controller.flows;

import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessFileAttachManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.BaseResultCommand;
import com.ozstrategy.webapp.command.JsonReaderResponse;
import com.ozstrategy.webapp.command.flows.ProcessFileAttachCommand;
import com.ozstrategy.webapp.controller.BaseController;
import com.ozstrategy.webapp.util.DownloadFileUtils;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created by lihao on 9/28/14.
 */
@Controller
@RequestMapping("processFileAttachController.do")
public class ProcessFileAttachController extends BaseController{
    @Autowired
    ProcessFileAttachManager processFileAttachManager;
    @Autowired
    UserManager userManager;

    @RequestMapping(params = "method=listProcessDefs")
    @ResponseBody
    public JsonReaderResponse<ProcessFileAttachCommand> listProcessDefs(HttpServletRequest request) {
        String start=request.getParameter("start");
        String limit=request.getParameter("limit");
        Map<String,Object> map=requestMap(request);
        List<ProcessFileAttachCommand> commands=new ArrayList<ProcessFileAttachCommand>();
        List<ProcessFileAttach> items= processFileAttachManager.listProcessFileAttachs(map, parseInteger(start), parseInteger(limit));
        if(items!=null && items.size()>0){
            for(ProcessFileAttach item : items){
                ProcessFileAttachCommand command=new ProcessFileAttachCommand(item);
                commands.add(command);
            }
        }
//        Integer count=processFileAttachManager.listProcessFileAttachsCount(map);
        return new JsonReaderResponse<ProcessFileAttachCommand>(commands);
    }
    @RequestMapping(params = "method=delete")
    @ResponseBody
    public BaseResultCommand delete(HttpServletRequest request, HttpServletResponse response){
        Long id=parseLong(request.getParameter("id"));
        ProcessFileAttach attach=null;
        if(id!=null){
            attach=processFileAttachManager.getProcessFileAttachById(id);
            if(attach!=null){
                String path=attach.getFilePath();
                File file=new File(path);
                if(file.exists()){
                    FileUtils.deleteQuietly(file);
                }
                processFileAttachManager.deleteProcessFileAttach(attach.getId());
                return new BaseResultCommand(attach);
            }
        }
        return new BaseResultCommand("删除附件错误",false);
    }
    
    @RequestMapping(params = "method=upload")
    public ModelAndView upload(HttpServletRequest request, HttpServletResponse response){
        String username = request.getRemoteUser();
        User user = userManager.getUserByUsername(username);
        ProcessFileAttach attach=null;
        if(user!=null){
            String attachFilesDirStr = request.getRealPath("/") + "/attachFiles/";
            attachFilesDirStr= FilenameUtils.normalize(attachFilesDirStr);
            File fileDir = new File(attachFilesDirStr);
//            if(!fileDir.canWrite()){
//                return new BaseResultCommand(getMessage("文件目录权限不够",request),Boolean.FALSE);
//            }
            if (fileDir.exists() == false) {
                fileDir.mkdir();
            }
            try {
                MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
                Iterator list = multipartRequest.getFileNames();
                while (list.hasNext()) {
                    String controlName = list.next().toString();
                    MultipartFile file = multipartRequest.getFile(controlName);
                    CommonsMultipartFile cmf = (CommonsMultipartFile) file;
                    DiskFileItem fileItem = (DiskFileItem) cmf.getFileItem();
                    String str = UUID.randomUUID().toString();
                    String fileName = fileItem.getName();
                    String ext = FilenameUtils.getExtension(fileName);
                    attachFilesDirStr=attachFilesDirStr+"/"+str+"."+ext;
                    attachFilesDirStr= FilenameUtils.normalize(attachFilesDirStr);
                    File fileOnServer = new File(attachFilesDirStr);
                    if (fileOnServer.exists()) {
                        str = UUID.randomUUID().toString();
                        attachFilesDirStr=attachFilesDirStr+"/"+str+"."+ext;
                        attachFilesDirStr= FilenameUtils.normalize(attachFilesDirStr);
                        fileOnServer = new File(attachFilesDirStr);
                    }
                    fileItem.write(fileOnServer);
                    attach=new ProcessFileAttach();
                    attach.setLastUpdater(user);
                    attach.setLastUpdateDate(new Date());
                    attach.setCreator(user);
                    attach.setCreateDate(new Date());
                    attach.setFileSize(fileOnServer.length());
                    attach.setFileName(fileName);
                    attach.setFilePath(fileOnServer.getAbsolutePath());
                    attach.setFileIndex(parseInteger(request.getParameter("fileIndex")));
                    processFileAttachManager.saveProcessFileAttach(attach);
                    response.setContentType("text/html;charset=utf-8");
                    response.getWriter().print("{success:true,msg:'上传成功!',fileName:'"+attach.getFileName()+"',id:"+attach.getId()+"}");
                }
            } catch (Exception e) {
                logger.error("上传文件错误:",e);
                response.setContentType("text/html;charset=utf-8");
                try {
                    response.getWriter().print("{success:false,msg:'上传出错!'}");
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
                e.printStackTrace();
            }
        }
        return null;
    }
    @RequestMapping(params = "method=downloadFile")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response) {
        ServletOutputStream outputStream = null;
        Long id=parseLong(request.getParameter("id"));
        String online = request.getParameter("online");
        try {
            request.setCharacterEncoding("UTF-8");
            response.setCharacterEncoding("UTF-8");
            if(id!=null){
                ProcessFileAttach attach=processFileAttachManager.getProcessFileAttachById(id);
                String fileName=attach.getFileName();
                String filePath=attach.getFilePath();
                
                if(StringUtils.isNotEmpty(online) && StringUtils.equals("true",online)){
                    DownloadFileUtils.download(filePath, response, true,fileName);
                }else{
                    DownloadFileUtils.download(filePath, response, false, fileName);
                }
            }
        } catch (IOException ex1) {
            ex1.printStackTrace();
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.flush();
                } catch (IOException ex2) {
                    ex2.printStackTrace();
                }
                try {
                    outputStream.close();
                } catch (IOException ex3) {
                    ex3.printStackTrace();
                }
            }
        }
    }
    
}
