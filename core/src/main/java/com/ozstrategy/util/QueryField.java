package com.ozstrategy.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

// Referenced classes of package com.ozstrategy.core.command:
//			CriteriaCommand, QueryFilter

public class QueryField {

	private static Log logger = LogFactory.getLog(QueryField.class);
	private String property;
	private Object value;
	private String operation;
    private String alias;

    public QueryField(String alias,String property,String operation) {
        this.property = property;
        this.operation = operation;
        this.alias=alias;
    }
    public QueryField(String property, Object value, String operation) {
        this.property = property;
        this.value = value;
        this.operation = operation;
    }
	public Criteria execute(Criteria criteria){
		if ("LT".equals(operation)){
            criteria.add(Restrictions.lt(property, value));
        } else if ("GT".equals(operation)){
            criteria.add(Restrictions.gt(property, value));
        } else if ("LE".equals(operation)){
            criteria.add(Restrictions.le(property, value));
        } else if ("GE".equals(operation)){
            criteria.add(Restrictions.ge(property, value));
        } else if ("LK".equals(operation)) {
            criteria.add(Restrictions.like(property, (new StringBuilder()).append("%").append(value).append("%").toString()).ignoreCase());
        } else if ("LFK".equals(operation)){
            criteria.add(Restrictions.like(property, (new StringBuilder()).append(value).append("%").toString()).ignoreCase());
        } else if ("RHK".equals(operation)) {
            criteria.add(Restrictions.like(property, (new StringBuilder()).append("%").append(value).toString()).ignoreCase());
        } else if ("NULL".equals(operation)){
            criteria.add(Restrictions.isNull(property));
        } else if ("NOTNULL".equals(operation)) {
            criteria.add(Restrictions.isNotNull(property));
        } else if ("EMP".equals(operation)) {
            criteria.add(Restrictions.isEmpty(property));
        } else if ("NOTEMP".equals(operation))  {
            criteria.add(Restrictions.isNotEmpty(property));
        } else if ("NEQ".equals(operation)){
            criteria.add(Restrictions.ne(property, value));
        } else if ("DESC".equalsIgnoreCase(operation)){
            criteria.addOrder(Order.desc(property));
        } else if ("ASC".equalsIgnoreCase(operation)){
            criteria.addOrder(Order.asc(property));
        } else if ("START".equalsIgnoreCase(operation)){
            if(value!=null){
                criteria.setFirstResult(Integer.parseInt(value.toString()));
            }
        }
        else if ("LIMIT".equalsIgnoreCase(operation)){
            if(value!=null) {
                criteria.setMaxResults(Integer.parseInt(value.toString()));
            }
        } else{
            criteria.add(Restrictions.eq(property, value));
        }
		return criteria;
	}

	public String getPartHql() {
		String s = "";
		if ("LT".equals(operation)){
			s = (new StringBuilder()).append(" and ").append(property).append(" < :").append(alias).toString();
		} else if ("GT".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" > :").append(alias).toString();
		} else if ("LE".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" <= :").append(alias).toString();
		} else if ("GE".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" >= :").append(alias).toString();
		} else if ("LK".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" like :").append(alias).toString();
		} else if ("LLK".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" like :").append(alias).toString();
		} else if ("RLK".equals(operation)) {
			s = (new StringBuilder()).append(" and ").append(property).append(" like :").append(alias).toString();
		} else if ("NULL".equals(operation))
			s = (new StringBuilder()).append(" and ").append(property).append(" is null ").toString();
		else if ("NOTNULL".equals(operation))
			s = (new StringBuilder()).append(" and ").append(property).append(" is not null ").toString();
		else if ("NEQ".equals(operation)){
            s = (new StringBuilder()).append(" and ").append(property).append(" != :").append(alias).toString();
        }else if("EQ".equals(operation)){
            s = (new StringBuilder()).append(" and ").append(s).append(property).append(" = :").append(alias).toString();
        }
		return s;
	}

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }
}
