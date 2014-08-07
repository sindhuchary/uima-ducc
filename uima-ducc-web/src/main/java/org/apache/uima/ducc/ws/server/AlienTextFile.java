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
package org.apache.uima.ducc.ws.server;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.uima.ducc.common.utils.AlienAbstract;
import org.apache.uima.ducc.common.utils.DuccLogger;

public class AlienTextFile extends AlienAbstract {	
	
	private static DuccLogger duccLogger = DuccLogger.getLogger(AlienTextFile.class.getName(), null);
	
	private static String command_du = "/usr/bin/du";
	private static String flag_dash_b = "-b";
	
	private static String command_dd = "/bin/dd";
	private static String arg_if = "if=";
	private static String arg_skip = "skip=";
	private static String arg_count = "count=";
	
	private static int sizeDu = 4096;
	private static int sizeDefault = 0;
	
	private static int sizeBlockDd = 512;
	
	private String file_name;
	private int page_bytes = 4096;
	
	public AlienTextFile(String user, String file_name, String ducc_ling) {
		set_user(user);
		set_file_name(file_name);
		set_ducc_ling(ducc_ling);
	}
	
	public AlienTextFile(String user, String file_name, String ducc_ling, int pageBytes) {
		set_user(user);
		set_file_name(file_name);
		set_ducc_ling(ducc_ling);
		set_page_bytes(pageBytes);
	}
	
	protected void set_file_name(String value) {
		file_name = value;
	}
	
	protected String get_file_name() {
		return file_name;
	}
	
	protected void set_page_bytes(int value) {
		page_bytes = value;
	}
	
	protected int get_page_bytes() {
		return page_bytes;
	}
	
	private String[] buildCommandDu() {
		String[] command_ducc_ling_yes = { ducc_ling, q_parameter, u_parameter, user, command_du, flag_dash_b, file_name };
		String[] command_ducc_ling_no  = { command_du, flag_dash_b, file_name };
		String[] command = command_ducc_ling_yes;
		if(ducc_ling == null) {
			command = command_ducc_ling_no;
		}
		return command;
	}
	
	private String getDu() throws Throwable {
		String methodName = "getDu";
		String data = "";
		try {
			String[] command = buildCommandDu();
			echo(command);
			ProcessBuilder pb = new ProcessBuilder( command );
			Process p = pb.start();
			p.waitFor();
			InputStream pOut = p.getInputStream();
			InputStreamReader isr = new InputStreamReader(pOut);
			BufferedReader br = new BufferedReader(isr);
			char[] cbuf = new char[sizeDu];
	        int rc = br.read(cbuf);
	        duccLogger.debug(methodName, duccId, rc);
	        data = new String(cbuf);
	        duccLogger.debug(methodName, duccId, data);
		}
		catch(Throwable t) {
			duccLogger.warn(methodName, duccId, t);
		}
        return data;
	}
	
	private int convertToInt(String value, int otherwise) {
		String methodName = "convertToInt";
		int retVal = otherwise;
		try {
			retVal = Integer.parseInt(value);
		}
		catch(Throwable t) {
			duccLogger.debug(methodName, duccId, t);
		}
		return retVal;
	}
	
	public int getByteSize() {
		String methodName = "getByteSize";
		int retVal = sizeDefault;
		try {
			String text = getDu();
			if(text != null) {
				text = text.trim();
				String[] tokens = text.split("\\s+");
				if(tokens.length > 0) {
					duccLogger.debug(methodName, duccId, tokens[0]);
					retVal = convertToInt(tokens[0], sizeDefault);
				}
				else {
					duccLogger.debug(methodName, duccId, "empty");
				}
			}
		}
		catch(Throwable t) {
			duccLogger.warn(methodName, duccId, t);
		}
		return retVal;
	}
	
	/******/
	
	private String[] buildCommandDd(int skip, int count) {
		String[] command_ducc_ling_yes = { ducc_ling, q_parameter, u_parameter, user, command_dd, arg_if+file_name, arg_skip+skip, arg_count+count };
		String[] command_ducc_ling_no  = { command_dd, arg_if+file_name, arg_skip+skip, arg_count+count };
		String[] command = command_ducc_ling_yes;
		if(ducc_ling == null) {
			command = command_ducc_ling_no;
		}
		return command;
	}
	
	private String getDd(int skip, int count) throws Throwable {
		String methodName = "getDd";
		String data = "";
		try {
			String[] command = buildCommandDd(skip, count);
			echo(command);
			ProcessBuilder pb = new ProcessBuilder( command );
			Process p = pb.start();
			p.waitFor();
			InputStream is = p.getInputStream();
			int ev = p.exitValue();
			if(ev > 0) {
				is = p.getErrorStream();
			}
			InputStreamReader isr = new InputStreamReader(is);
			BufferedReader br = new BufferedReader(isr);
			int bufSize = count*sizeBlockDd;
			char[] cbuf = new char[bufSize];
			int rc = br.read(cbuf);
			duccLogger.debug(methodName, duccId, rc);
	        data = new String(cbuf);
		}
		catch(Throwable t) {
			duccLogger.warn(methodName, duccId, t);
		}
		return data;
	}
	
	public String getChunk(int byteStart, int byteCount) {
		String methodName = "getChunk";
		String retVal = "";
		try {
			int skip = (int) Math.ceil(byteStart / (1.0*sizeBlockDd));
			int count = (int) Math.ceil(byteCount / (1.0*sizeBlockDd));
			//System.err.println("skip:"+skip+" "+"count:"+count);
			retVal = getDd(skip, count);
		}
		catch(Throwable t) {
			duccLogger.warn(methodName, duccId, t);
		}
		return retVal;
	}
	
	public int getPageCount() {
		int retVal = 0;
		int pageSize = get_page_bytes();
		int fileBytes = getByteSize();
		retVal = (int) Math.ceil(fileBytes / (1.0 * pageSize));
		return retVal;
	}
	
	public String getPage(int pageNo) {
		String retVal = "";
		int pageSize = get_page_bytes();
		retVal = getChunk(pageNo*pageSize, pageSize);
		return retVal;
	}
	
	public String getPageFirst() {
		String retVal = "";
		int pageSize = get_page_bytes();
		retVal = getChunk(0, pageSize);
		return retVal;
	}
	
	public String getPageLast() {
		String retVal = "";
		int pageSize = get_page_bytes();
		int fileBytes = getByteSize();
		if(fileBytes > pageSize) {
			int byteStart = (fileBytes-pageSize)+1;
			int byteCount = pageSize;
			//System.err.println("byteStart:"+byteStart+" "+"byteCount:"+byteCount);
			retVal = getChunk(byteStart, byteCount);
		}
		else {
			retVal = getPageFirst();
		}
		return retVal;
	}
	
	/******/
	
	public static void main(String[] args) throws Throwable {
		AlienTextFile alienTextFile;
		String arg_user = args[0];
		String arg_file = args[1];
		if(args.length < 3) {
			alienTextFile = new AlienTextFile(arg_user, arg_file, null);
		}
		else {
			String arg_ducc_ling = args[2];
			alienTextFile = new AlienTextFile(arg_user, arg_file, arg_ducc_ling);
		}
		int bytes = alienTextFile.getByteSize();
		System.out.println("--- file bytes ---");
		System.out.println(bytes);
		String data;
		data = alienTextFile.getPageFirst();
		System.out.println("--- first ---");
		System.out.println(data);
		data = alienTextFile.getPageLast();
		System.out.println("--- last ---");
		System.out.println(data);
		int count = alienTextFile.getPageCount();
		System.out.println("--- page count ---");
		System.out.println(count);
		for(int i=0; i<count; i++) {
			data = alienTextFile.getPage(i);
			System.out.println("--- page "+i+" ---");
			System.out.println(data);
		}
	}
}