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
package org.apache.uima.ducc.container.jd.test.helper;

public class Testing {

	private static boolean disabled = false;
	private static boolean verbose = false;
	private static boolean warned = false;
	private static boolean debug = false;
	
	public static boolean isDisabled(String name ) {
		if(disabled) {
			if(!warned) {
				System.err.println("Tests are disabled: "+name);
			}
			warned = true;
		}
		return disabled;
	}
	
	public static boolean isVerbose() {
		return verbose;
	}
	
	public static boolean isDebug() {
		return debug;
	}
	
}