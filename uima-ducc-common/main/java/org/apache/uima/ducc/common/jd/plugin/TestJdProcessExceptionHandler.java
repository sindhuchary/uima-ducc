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
package org.apache.uima.ducc.common.jd.plugin;

import java.util.Properties;

import org.apache.uima.aae.error.UimaASProcessCasTimeout;
import org.apache.uima.cas.CAS;
import org.apache.uima.resource.ResourceProcessException;

public class TestJdProcessExceptionHandler {
	
	private static void generateUimaASProcessCasTimeout() throws Exception {
		throw new UimaASProcessCasTimeout();
	}
	
	private static void generateTimeout() throws Exception {
		try {
			generateUimaASProcessCasTimeout();
		}
		catch(Exception e) {
			throw new ResourceProcessException(e);
		}
	}
	
	private static void generateError() throws Exception {
		try {
			throw new NullPointerException();
		}
		catch(Exception e) {
			throw new ResourceProcessException(e);
		}
	}
	
	public static void main(String[] args) {
		JdProcessExceptionHandler jdProcessExceptionHandler = new JdProcessExceptionHandler(); 
		for(int i=1; i<20; i++) {
			try {
				generateTimeout();
			}
			catch(Exception e) {
				String processId = "0";
				CAS cas = null;
				Properties properties = null;
				jdProcessExceptionHandler.handle(processId, cas, e, properties);
			}
		}
		for(int i=1; i<4; i++) {
			try {
				generateError();
			}
			catch(Exception e) {
				String processId = "1";
				CAS cas = null;
				Properties properties = null;
				jdProcessExceptionHandler.handle(processId, cas, e, properties);
			}
		}
		for(int i=1; i<13; i++) {
			try {
				generateError();
			}
			catch(Exception e) {
				String processId = "2";
				CAS cas = null;
				Properties properties = null;
				jdProcessExceptionHandler.handle(processId, cas, e, properties);
			}
		}
	}

}
