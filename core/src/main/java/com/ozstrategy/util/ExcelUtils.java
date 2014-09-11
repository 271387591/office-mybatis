package com.ozstrategy.util;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import sun.security.util.Password;


/**
 * Created by IntelliJ IDEA. User: kangpan Date: 22/3/12 Time: 11:42 AM To change this template use File | Settings |
 * File Templates.
 *
 * @author $author$
 * @version $Revision$, $Date$
 */
public class ExcelUtils {
    public static void main(String[] args) throws Exception {
        Columns columns1=new Columns();
        Column r1_c0=new Column(0,"手机",1,0,"mobile");
        Column r1_c1=new Column(1,"合同起始日期",1,0,"htStartDate");
        Column r1_c2=new Column(2,"合同终止日期",1,0,"htEndDate");
        Column r1_c3=new Column(3,"培训",0,1,"");
        Column r1_c4=new Column(4,"",0,0,"");
        Column r1_c5=new Column(5,"实习",0,1,"");
        Column r1_c6=new Column(6,"",0,0,"");
        Column r1_c7=new Column(7,"个人简历",0,5,"");
        Column r1_c8=new Column(8,"",0,0,"");
        Column r1_c9=new Column(9,"",0,0,"");
        Column r1_c10=new Column(10,"",0,0,"");
        Column r1_c11=new Column(11,"",0,0,"");
        Column r1_c12=new Column(12,"",0,0,"");
        columns1.addColumn(r1_c0)
                .addColumn(r1_c1)
                .addColumn(r1_c2)
                .addColumn(r1_c3)
                .addColumn(r1_c4)
                .addColumn(r1_c5)
                .addColumn(r1_c6)
                .addColumn(r1_c7)
                .addColumn(r1_c8)
                .addColumn(r1_c9)
                .addColumn(r1_c10)
                .addColumn(r1_c11)
                .addColumn(r1_c12);
        Columns columns2=new Columns();
        Column r2_c0=new Column(0,"",0,0,"");
        Column r2_c1=new Column(1,"",0,0,"");
        Column r2_c2=new Column(2,"",0,0,"");
        Column r2_c3=new Column(3,"起时间",0,0,"sxStartDate");
        Column r2_c4=new Column(4,"止时间",0,0,"sxEndDate");
        Column r2_c5=new Column(5,"起时间",0,0,"sxStartDate");
        Column r2_c6=new Column(6,"止时间",0,0,"sxEndDate");

        Column r2_c7=new Column(7,"简历1（起止时间）",0,0,"jlStartDate1");
        Column r2_c8=new Column(8,"简历1（内容）",0,0,"jlContent1");
        Column r2_c9=new Column(9,"简历2（起止时间）",0,0,"jlStartDate2");
        Column r2_c10=new Column(10,"简历2（内容）",0,0,"jlContent2");
        Column r2_c11=new Column(11,"简历3（起止时间）",0,0,"jlStartDate3");
        Column r2_c12=new Column(12,"简历3（内容）",0,0,"jlContent3");
        columns2.addColumn(r2_c0)
                .addColumn(r2_c1)
                .addColumn(r2_c2)
                .addColumn(r2_c3)
                .addColumn(r2_c4)
                .addColumn(r2_c5)
                .addColumn(r2_c6)
                .addColumn(r2_c7)
                .addColumn(r2_c8)
                .addColumn(r2_c9)
                .addColumn(r2_c10)
                .addColumn(r2_c11)
                .addColumn(r2_c12);
        Row row1=new Row(1,columns1);
        Row row2=new Row(2,columns2);
        Rows rows=new Rows();
        rows.addRow(row2).addRow(row1);
//        rows=createRosterRows();
        List<Map<String,String>> data=new ArrayList<Map<String, String>>();
        Map<String,String> map1=new HashMap<String, String>();
        map1.put("name","133");
        map1.put("htStartDate","2014-01-23");
        map1.put("htEndDate","2014-01-24");
        map1.put("sxStartDate","2014-01-25");
        map1.put("sxEndDate","2014-01-26");
        map1.put("jlStartDate1","2014-01-27");
        map1.put("jlContent1","1111");
        map1.put("jlStartDate2","2014-01-27");
        map1.put("jlContent2","222");
        map1.put("jlStartDate3","2014-01-27");
        map1.put("jlContent3","333");
        data.add(map1);
        Map<String,String> map2=new HashMap<String, String>();
        map2.put("name","134");
        map2.put("htStartDate","2014-01-23");
        map2.put("htEndDate","2014-01-24");
        map2.put("sxStartDate","2014-01-25");
        map2.put("sxEndDate","2014-01-26");
        map2.put("jlStartDate1","2014-01-27");
        map2.put("jlContent1","1111");
        map2.put("jlStartDate2","2014-01-27");
        map2.put("jlContent2","222");
        map2.put("jlStartDate3","2014-01-27");
        map2.put("jlContent3","333");
        data.add(map2);


//        HSSFWorkbook wb1 = export("导出排班信息", rows, data);
//        FileOutputStream os1 = new FileOutputStream("/Users/lihao/Downloads/Roster.xls");
//        wb1.write(os1);
//        os1.close();
//        InputStream inputStream=new FileInputStream("/Users/lihao/Downloads/workbook.xls");
//        readExcel(rows,inputStream,0);
    }
    public static HSSFWorkbook export(String sheetName,Rows rows,  List<Map<String,String>> contexts ) throws IOException {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet(sheetName);
        Map<String,CellStyle> styleMap=createStyles(wb);
        HSSFCell cell =null;
        List<CellRangeAddress> cellRangeAddresses=new ArrayList<CellRangeAddress>();
        List<Row> rows_list=rows.getRows();
        for(int i=0;i<rows_list.size();i++){
            Row row=rows_list.get(i);
            int r_index=row.getIndex();
            HSSFRow sheetRow = sheet.createRow(r_index);
            sheetRow.setHeight((short)(450+450*i));
            List<Column> columns=row.getColumns().getColumns();
            for(Column column : columns){
                int c_index=column.getIndex();
                String header=column.getHeader();
                cell = sheetRow.createCell(c_index);
                sheet.setColumnWidth(c_index, 3500);
                cell.setCellStyle(styleMap.get("header"));
                cell.setCellValue(header);
                int colSpan=column.getColSpan();
                if(colSpan!=0){
                    CellRangeAddress cellRangeAddress=new  CellRangeAddress(r_index,(short)(r_index+colSpan),c_index,(short)c_index);
                    cellRangeAddresses.add(cellRangeAddress);
                }
                int cellSpan=column.getCellSpan();
                if(cellSpan!=0){
                    CellRangeAddress cellRangeAddress=new  CellRangeAddress(r_index,(short)(r_index),c_index,(short)(c_index+cellSpan));
                    cellRangeAddresses.add(cellRangeAddress);
                }
            }
        }
        for(CellRangeAddress cellRangeAddress : cellRangeAddresses){
            sheet.addMergedRegion(cellRangeAddress);
        }

        Row dataRow=rows.toDataRow();
        List<Column> dataColumns=dataRow.getColumns().getColumns();

        // 设置单元格内容格式
        HSSFCellStyle style1 = wb.createCellStyle();
        style1.setWrapText(true);// 自动换行
        for(int i=0;i<contexts.size();i++){
            Map<String,String> data=contexts.get(i);
            HSSFRow sheetRow = sheet.createRow(dataRow.getIndex()+i);
            sheetRow.setHeight((short)450);
            for(int j=0;j<dataColumns.size();j++){
                Column column=dataColumns.get(j);
                String dataIndex=column.getDataIndex();
                int c_index=column.getIndex();
                cell=sheetRow.createCell(c_index);
                cell.setCellStyle(styleMap.get("cell"));
                cell.setCellValue(data.get(dataIndex));
            }
        }
        return wb;
    }
    public static List<Map<String, String>> readExcel(Rows rows,InputStream is,int sheetIndex) throws IOException{
        List<Map<String, String>> list=new ArrayList<Map<String, String>>();
        POIFSFileSystem fs = new POIFSFileSystem(is);
        HSSFWorkbook wb = new HSSFWorkbook(fs);
        HSSFSheet sheet=wb.getSheetAt(sheetIndex);
        Row dataColumn=rows.toDataRow();
        int dataRowIndex=dataColumn.getIndex();
        List<Column> columns = dataColumn.getColumns().getColumns();
        int rowSum=sheet.getPhysicalNumberOfRows();
        for(int i=dataRowIndex;i<=rowSum;i++){
            Map<String, String> result = new HashMap<String, String>();
            for(Column column : columns){
                int c_index=column.getIndex();
                String dataIndex=column.getDataIndex();
                Cell cell = sheet.getRow(i).getCell(c_index);
                String value = cell.toString().trim();
//                if(value.matches("^\\d+\\.[0]$")){
//                    value = value.substring(0, value.indexOf("."));
//                }
                result.put(dataIndex,value);
            }
            list.add(result);
        }
        return list;
    } // end method readExcel
    private static Map<String, CellStyle> createStyles(Workbook wb) {
        Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
        CellStyle style;
        Font titleFont = wb.createFont();
        titleFont.setFontHeightInPoints((short) 16);
        titleFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
        titleFont.setColor(IndexedColors.ROYAL_BLUE.getIndex());
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFont(titleFont);
        styles.put("title", style);

        Font monthFont = wb.createFont();
        monthFont.setFontHeightInPoints((short) 14);
//        monthFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
//        monthFont.setColor(IndexedColors.WHITE.getIndex());
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFillForegroundColor(IndexedColors.WHITE.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setFont(monthFont);
        style.setWrapText(true);
        styles.put("header", style);

        Font cellFont = wb.createFont();
//        cellFont.setFontHeightInPoints((short) 12);
//        cellFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setWrapText(true);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setFont(cellFont);
        style.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));
        styles.put("cell", style);

        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFillForegroundColor(IndexedColors.WHITE.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setFont(cellFont);
//    style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
        styles.put("formula", style);

        Font cellFont1 = wb.createFont();
        cellFont1.setFontHeightInPoints((short) 12);
        cellFont1.setBoldweight(Font.BOLDWEIGHT_BOLD);
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setLocked(false);
        style.setWrapText(true);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setFont(cellFont1);
        styles.put("cellUnlocked", style);

        return styles;
    }
    private static class Column implements Comparable{
        private int index;
        private String header;
        private int colSpan;
        private int cellSpan;
        private String dataIndex;

        public Column(int index, String header, int colSpan, int cellSpan,String dataIndex) {
            this.index = index;
            this.header = header;
            this.colSpan = colSpan;
            this.cellSpan = cellSpan;
            this.dataIndex=dataIndex;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public String getHeader() {
            return header;
        }

        public void setHeader(String header) {
            this.header = header;
        }

        public int getColSpan() {
            return colSpan;
        }

        public void setColSpan(int colSpan) {
            this.colSpan = colSpan;
        }

        public int getCellSpan() {
            return cellSpan;
        }

        public void setCellSpan(int cellSpan) {
            this.cellSpan = cellSpan;
        }

        public String getDataIndex() {
            return dataIndex;
        }

        public void setDataIndex(String dataIndex) {
            this.dataIndex = dataIndex;
        }

        public int compareTo(Object o) {
            Column other=(Column)o;
            if(this.index>other.index){
                return 1;
            }else if(this.index==other.getIndex()){
                return 0;
            }
            return -1;
        }
    }
    private static class Columns{
        private List<Column> columns=new ArrayList<Column>();
        public Columns addColumn(Column column){
            this.columns.add(column);
            return this;
        }

        public List<Column> getColumns() {
            Collections.sort(this.columns);
            return columns;
        }

        public void setColumns(List<Column> columns) {
            this.columns = columns;
        }
    }
    private static class Row implements Comparable{
        private int index;
        private Columns columns;
        public Row(int index,Columns columns){
            this.index=index;
            this.columns=columns;
        }
        public int getIndex() {
            return index;
        }
        public void setIndex(int index) {
            this.index = index;
        }

        public Columns getColumns() {

            return columns;
        }

        public void setColumns(Columns columns) {
            this.columns = columns;
        }

        public int compareTo(Object o) {
            Row other=(Row)o;
            if(this.index>other.index){
                return 1;
            }else if(this.index==other.getIndex()){
                return 0;
            }
            return -1;
        }
    }
    private static class Rows{
        List<Row> rows=new ArrayList<Row>();
        public Rows addRow(Row row){
            this.rows.add(row);
            return this;
        }

        public List<Row> getRows() {
            Collections.sort(this.rows);
            return rows;
        }
        public Row toDataRow(){
            int index=0;
            Columns list=new Columns();
            List<Integer> indexs=new ArrayList<Integer>();
            for(Row row : this.rows){
                index=row.getIndex();
                indexs.add(index);
                List<Column> columns=row.getColumns().getColumns();
                for(Column c:columns){
                    String dataIndex=c.getDataIndex();
                    if(StringUtils.isNotEmpty(dataIndex)){
                        list.addColumn(c);
                    }
                }
            }
            Collections.sort(indexs);
            if(indexs.size()>0){
                int dataIndex=indexs.get(indexs.size()-1);
                Row row=new Row(dataIndex+1,list);
                return row;
            }
            return null;

        }
    }
} // end class ExcelUtils
