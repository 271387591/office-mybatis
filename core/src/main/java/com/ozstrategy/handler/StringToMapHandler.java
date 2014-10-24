package com.ozstrategy.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 * Created by lihao on 10/23/14.
 */
public class StringToMapHandler implements TypeHandler<Map<String,Object>> {
    private ObjectMapper objectMapper=new ObjectMapper();
    public void setParameter(PreparedStatement ps, int i, Map<String,Object> parameter, JdbcType jdbcType) throws SQLException {
        try {
            String str = objectMapper.writeValueAsString(parameter);
            ps.setString(i, str);
        } catch (JsonProcessingException e) {
            ps.setString(i, "{}");
        }
    }

    public Map<String,Object> getResult(ResultSet rs, String columnName) throws SQLException {
        String str=rs.getString(columnName);
        return readToMap(str);
    }

    public Map<String,Object> getResult(ResultSet rs, int columnIndex) throws SQLException {
        String str=rs.getString(columnIndex);
        return readToMap(str);
    }

    public Map<String,Object> getResult(CallableStatement cs, int columnIndex) throws SQLException {
        String str=cs.getString(columnIndex);
        return readToMap(str);
    }
    private Map<String,Object> readToMap(String str){
        try {
            Map<String,Object> map = (Map<String,Object>)objectMapper.readValue(str,Map.class);
            return map;
        } catch (IOException e) {
        }
        return null;
    }
}
