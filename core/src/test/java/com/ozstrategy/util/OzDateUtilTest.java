package com.ozstrategy.util;

import com.ozstrategy.model.flows.ProcessElementType;
import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.util.Iterator;

public class OzDateUtilTest extends TestCase {
    //~ Instance fields ========================================================

    private final Log log = LogFactory.getLog(OzDateUtilTest.class);

    //~ Constructors ===========================================================

    public OzDateUtilTest(String name) {
        super(name);
    }
    
    public void testJsoup() throws Exception{
        String path=OzDateUtilTest.class.getClassLoader().getResource("jsoup.txt").getPath();
        String html= FileUtils.readFileToString(new File(path));
        Document document = Jsoup.parse(html);
//        Elements elements =  document.select("table[xtype=table]").select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
//        Elements elements =  document.select("table[xtype=detailGrid]:not(textarea[xtype=textareafield])");//.select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
        Elements tables= document.select("table[xtype=table]");
        Iterator<Element> tableIterator=tables.iterator();
        while (tableIterator.hasNext()){
            Element table=tableIterator.next();
            Elements elements =  table.select("table[index=1] > tbody > tr > td > textarea[xtype=textareafield]");//.select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
            Iterator<Element> iterator =  elements.iterator();
            while (iterator.hasNext()){
                Element element=iterator.next();
                System.out.println("name=="+element.attributes().get("name"));
                System.out.println("txtlabel=="+element.attributes().get("txtlabel"));
                System.out.println("xtype==="+element.attributes().get("xtype"));
                System.out.println("html=="+element.outerHtml());
            }
        }
    }
    public void testProcessElementType() throws Exception{
        System.out.println(ProcessElementType.StartNoneEvent.name());
        System.out.println(ProcessElementType.StartNoneEvent.getName());
        System.out.println(ProcessElementType.get("StartEvent"));
        
        
    }
}
