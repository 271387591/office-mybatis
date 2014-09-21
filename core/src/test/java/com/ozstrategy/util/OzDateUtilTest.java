package com.ozstrategy.util;

import com.mxgraph.io.mxCodec;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.util.mxXmlUtils;
import com.ozstrategy.model.flows.ProcessElementType;
import com.sun.org.apache.xerces.internal.dom.ParentNode;
import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.junit.Test;

import java.io.File;
import java.util.Iterator;
import java.util.Map;

public class OzDateUtilTest extends TestCase {
    //~ Instance fields ========================================================

    private final Log log = LogFactory.getLog(OzDateUtilTest.class);

    //~ Constructors ===========================================================

    public OzDateUtilTest(String name) {
        super(name);
    }
    
    @Test
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
    @Test
    public void testProcessElementType() throws Exception{
        System.out.println(ProcessElementType.StartNoneEvent.name());
        System.out.println(ProcessElementType.StartNoneEvent.getName());
        System.out.println(ProcessElementType.get("StartEvent"));
        String str="T_8";
        System.out.println(str.lastIndexOf("T_"));
        System.out.println(str.substring(2));
                
        
        
    }
    @Test
    public void testGraph() throws Exception{
        String path=OzDateUtilTest.class.getClassLoader().getResource("graph.xml").getPath();
        String xml= FileUtils.readFileToString(new File(path));
        mxGraphModel model=getMxGraphModel(xml);
        Map<String,Object> map = model.getCells();
        mxCell cell = (mxCell)map.get("2");
        String activity1= cell.getAttribute("activity");
        Object value = cell.getValue();
        System.out.println(ObjectUtils.toString(value));
        ParentNode parentNode=(ParentNode)value;
        
        System.out.println(parentNode.getNodeName());
        System.out.println(parentNode.getNodeValue());
        String activity = parentNode.getAttributes().getNamedItem("activity").getNodeValue();
//        ObjectNode node = ActivityJsonConverUtil.Activiti(cell,"dsf");
//        System.out.println(node.toString());
        int i=0;
    }
    private static mxGraphModel getMxGraphModel(String gxml){
        mxCodec codec = new mxCodec();
        org.w3c.dom.Document doc = mxXmlUtils.parseXml(gxml);
        codec = new mxCodec(doc);
        mxGraphModel model = (mxGraphModel) codec.decode(doc.getDocumentElement());
        return model;
    }
}
