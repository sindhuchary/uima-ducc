/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/

package org.apache.uima.ducc.database;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.uima.ducc.common.persistence.IDbProperty;
import org.apache.uima.ducc.common.persistence.IDbProperty.Type;

/**
 * Static common helper methods.
 *
 * Not public at this point, would prefer to encapsulate all this entirely in DB.
 */
class DbUtil
{
    static String mkSchema(IDbProperty[] props)
        throws Exception
    {
        List<String> parts = new ArrayList<String>();
        List<String> primaries = new ArrayList<String>();
        for (IDbProperty n : props ) {
            if ( n.isMeta() ) continue;
            String s = n.columnName() + " " + typeToString(n.type());
            if ( n.isPrimaryKey() ) {
                primaries.add(n.columnName());
            }
            parts.add(s);
        }
        if ( primaries.size() == 0 ) {
            throw new IllegalArgumentException("Schema properties must declare at least one primary key.");
        }
        StringBuffer buf = new StringBuffer();
        for ( String p : parts ) {
            buf.append(p);
            buf.append(",");
        }
        int ncommas = primaries.size() - 1;
        int c = 0;
        buf.append(" PRIMARY KEY(");
        for ( String s : primaries ) {
            buf.append(s);
            if ( c++ < ncommas ) {
                buf.append(",");
            }
        }

        buf.append(")");
        return buf.toString();
    }

    static String mkFields(StringBuffer buf, String[] fields)
    {
        int max = fields.length - 1;
        int current = 0;
        buf.append("(");
        for (String s : fields) {
            buf.append(s);
            if ( current++ < max) buf.append(", ");
        }
        buf.append(")");
        return buf.toString();                   

    }

    /**
     * Generate a CREATE TABLE statement from the incoming fields.  The preparer of the
     * fields must qualify any fields in advance e.g. with types, key attributes, etc.
     *
     * @param tableName This is the name of the table to create.
     * @param fields This is a string array of fields to generate the statement from.
     * 
     * @return A string of valid SQL / CQL used to create the table.
     */
    static String mkTableCreate(String tableName, String[] fields)
    {
        int max = fields.length - 1;
        int current = 0;
        StringBuffer buf = new StringBuffer("CREATE TABLE IF NOT EXISTS ");
        buf.append(tableName);
        buf.append(" (");
        for (String s : fields) {
            buf.append(s);
            if ( current++ < max) buf.append(", ");
        }
        buf.append(")");
        return buf.toString();                   
    }

    static String mkInsert(String tableName, Map<? extends IDbProperty, Object> props)
    {
        int max = props.size() - 1;
        int current = 0;
        StringBuffer buf = new StringBuffer("INSERT INTO ");
        buf.append(tableName);
        buf.append("(");

        StringBuffer vals = new StringBuffer(") VALUES (");

        for ( IDbProperty ok : props.keySet() ) {

            String k = ok.columnName();
            buf.append(k);
            vals.append(rep(ok.type(), props.get(ok)));

            if ( current++ < max ) {
                buf.append(",");
                vals.append(",");
            }
        }
        buf.append(vals.toString());
        buf.append(")");

        return buf.toString();
    }

    static String mkInsert(String tableName, Object key, Object keyval, Map<? extends IDbProperty, Object> props)
    {
        int max = props.size() + 1;
        int current = 0;
        StringBuffer buf = new StringBuffer("INSERT INTO ");
        buf.append(tableName);
        buf.append("(");

        StringBuffer vals = new StringBuffer(") VALUES (");

        buf.append(key.toString());
        buf.append(",");
        vals.append(keyval.toString());
        vals.append(",");

        for ( IDbProperty ok : props.keySet() ) {

            String k = ok.columnName();
            buf.append(k);
            vals.append(rep(ok.type(), props.get(ok)));

            if ( current++ < max ) {
                buf.append(",");
                vals.append(",");
            }
        }
        buf.append(vals.toString());
        buf.append(")");

        return buf.toString();

    }

    static String mkUpdate(String table, String key, Object... props)
    {
        int len = props.length;
        StringBuffer buf = new StringBuffer("UPDATE ");
        buf.append(table);        
        buf.append(" SET ");
        
        for ( int i = 0; i < len; i+=2) {
            IDbProperty prop = (IDbProperty) props[i];
            if ( !prop.isPrimaryKey()) {                  // not allowed to update this
                                                          // we allow it in 'props' so callers can
                                                          // simply call update and expect the right
                                                          // thing to happen

                buf.append(prop.columnName());
                buf.append("=");
                buf.append(rep(prop.type(), props[i+1]));
                if ( i + 2 < len ) {
                    buf.append(",");
                }  
            }
        }
        buf.append(" WHERE ");
        buf.append(key);
        return buf.toString();
    }

    /**
     * Return the correct representation for CQL update, of val, for the indicated type, for this database.
     */
    static String rep(Type t, Object val)
    {
        switch ( t ) {
        case String:
            return "'" + val.toString() + "'";
        default:
            return val.toString();
        }

    }

    /**
     * Convert our generic "type" to the right name for this db implementation.
     * We could make Type a magic enum but I want to hide DB specifics, in particular,
     * how this database names various java types.
     */
    static String typeToString(Type t)
    {
        switch ( t ) {
            case Blob:
                return  "blob";
            case String:
                return  "text";
            case Boolean:
                return "boolean";
            case Integer:
                return "int";
            case Long:
                return "bigint";
            case Double:
                return "double";
            case UUID:
                return "uuid";
        }
        throw new IllegalArgumentException("Unrecognized type for schema: " + t);
    }

}