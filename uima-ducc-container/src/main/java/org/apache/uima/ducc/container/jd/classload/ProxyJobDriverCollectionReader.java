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
package org.apache.uima.ducc.container.jd.classload;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.net.URL;
import java.net.URLClassLoader;

import org.apache.uima.ducc.common.config.SystemPropertiesHelper;
import org.apache.uima.ducc.container.common.ContainerLogger;
import org.apache.uima.ducc.container.common.IContainerLogger;
import org.apache.uima.ducc.container.common.IEntityId;
import org.apache.uima.ducc.container.common.MessageBuffer;
import org.apache.uima.ducc.container.common.Standardize;
import org.apache.uima.ducc.container.jd.JobDriverException;
import org.apache.uima.ducc.container.net.impl.MetaCas;

public class ProxyJobDriverCollectionReader {

	private IContainerLogger logger = ContainerLogger.getLogger(ProxyJobDriverCollectionReader.class, IContainerLogger.Component.JD.name());
	
	private URLClassLoader urlClassLoader = null;
	
	private String crXml = null;
	private String crCfg = null;
	
	private Class<?>[] nullClassArray = null;
	private Object[] nullObjectArray = null;
	
	private Class<?> class_JdUserCollectionReader = null;
	private Object instance_JdUserCollectionReader = null;
	
	private String name_getTotal = "getTotal";
	private Method method_getTotal = null;
	
	private Class<?> class_JdUserMetaCas = null;
	
	private String name_getJdUserMetaCas = "getJdUserMetaCas";
	private Method method_getJdUserMetaCas = null;
	
	private String name_getSeqNo = "getSeqNo";
	private String name_getDocumentText = "getDocumentText";
	private String name_getSerializedCas = "getSerializedCas";
	
	private Method method_deserialize = null;
	
	private String[] requiredClasses = { 
			"org.apache.uima.ducc.user.jd.JdUserCollectionReader", 
			"org.apache.uima.aae.UimaSerializer",
			"org.apache.uima.cas.CAS",
			"com.thoughtworks.xstream.XStream",
			};
	
	public ProxyJobDriverCollectionReader() throws JobDriverException {
		SystemPropertiesHelper sph = SystemPropertiesHelper.getInstance();
		String userClasspath = sph.getUserClasspath();
		String[] classpath = sph.stringToArray(userClasspath);
		URL[] classLoaderUrls = new URL[classpath.length];
		int i = 0;
		for(String jar : classpath) {
			classLoaderUrls[i] = this.getClass().getResource(jar);
			i++;
		}
		URLClassLoader classLoader = new URLClassLoader(classLoaderUrls, ClassLoader.getSystemClassLoader().getParent());
		String crXml = sph.getCollectionReaderXml();
		String crCfg = sph.getCollectionReaderCfg();
		construct(classLoader, crXml, crCfg);
	}
	
	public int getTotal() throws JobDriverException {
		String location = "getTotal";
		int retVal = -1;
		try {
			retVal = (Integer)method_getTotal.invoke(instance_JdUserCollectionReader, nullObjectArray);
		} 
		catch (Exception e) {
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
		return retVal;
	}
	
	public MetaCas getMetaCas() throws JobDriverException {
		String location = "getMetaCas";
		MetaCas retVal = null;
		try {
			method_getJdUserMetaCas = class_JdUserCollectionReader.getMethod(name_getJdUserMetaCas, nullClassArray);
			Object instance_metaCas = method_getJdUserMetaCas.invoke(instance_JdUserCollectionReader, nullObjectArray);
			if(instance_metaCas != null) {
				Method method_getSeqNo = class_JdUserMetaCas.getMethod(name_getSeqNo, nullClassArray);
				Integer integer = (Integer)method_getSeqNo.invoke(instance_metaCas, nullObjectArray);
				int seqNo = integer.intValue();
				Method method_getSerializedCas = class_JdUserMetaCas.getMethod(name_getSerializedCas, nullClassArray);
				Object serializedCas = method_getSerializedCas.invoke(instance_metaCas, nullObjectArray);
				Method method_getDocumentText = class_JdUserMetaCas.getMethod(name_getDocumentText, nullClassArray);
				String docId = (String)method_getDocumentText.invoke(instance_metaCas, nullObjectArray);
				retVal = new MetaCas(seqNo, docId, serializedCas);
			}
		} 
		catch (Exception e) {
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
		return retVal;
	}
	
	public Object deserialize(String serializedCas) throws JobDriverException {
		String location = "deserialize";
		Object retVal = null;
		try {
			Object[] parms = new Object[1];
			parms[0] = serializedCas;
			retVal = method_deserialize.invoke(instance_JdUserCollectionReader, parms);
		} 
		catch (Exception e) {
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
		return retVal;
	}
	
	private void construct(URLClassLoader classLoader, String crXml, String cfCfg) throws JobDriverException {
		prepare(classLoader, crXml, cfCfg);
		validate();
		initialize();
	}
	
	private void prepare(URLClassLoader urlClassLoader, String crXml, String crCfg) throws JobDriverException {
		String location = "prepare";
		if(urlClassLoader == null) {
			JobDriverException e = new JobDriverException("missing URLClassLoader");
			logger.error(location, IEntityId.null_id, e);
			throw e;
		}
		setURLClassLoader(urlClassLoader);
		if(crXml == null) {
			JobDriverException e = new JobDriverException("missing CollectionReader xml");
			logger.error(location, IEntityId.null_id, e);
			throw e;
		}
		setCrXml(crXml);
		setCrCfg(crCfg);
	}
	
	private void validate() throws JobDriverException {
		for(String className : requiredClasses) {
			loadClass(className);
		}
	}
	
	private void initialize() throws JobDriverException {
		String location = "initialize";
		try {
			class_JdUserCollectionReader = urlClassLoader.loadClass("org.apache.uima.ducc.user.jd.JdUserCollectionReader");
			Constructor<?> constructor_JdUserCollectionReader = class_JdUserCollectionReader.getConstructor(String.class,String.class);
			instance_JdUserCollectionReader = constructor_JdUserCollectionReader.newInstance(new Object[] { crXml, crCfg });
			method_getTotal = class_JdUserCollectionReader.getMethod(name_getTotal, nullClassArray);
			class_JdUserMetaCas = urlClassLoader.loadClass("org.apache.uima.ducc.user.jd.JdUserMetaCas");
			method_getJdUserMetaCas = class_JdUserCollectionReader.getMethod(name_getJdUserMetaCas, nullClassArray);
			//
			Method[] classMethods = class_JdUserCollectionReader.getMethods();
			for(Method method : classMethods) {
				if(method.getName().equals("deserialize")) {
					Type[] types = method.getParameterTypes();
					if(types.length == 1) {
						if(types[0].toString().contains(".String")) {
							method_deserialize = method;
							break;
						}
					}
				}
			}
		} 
		catch (Exception e) {
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
	}
	
	private void setURLClassLoader(URLClassLoader value) {
		String location = "setURLClassLoader";
		logger.debug(location, IEntityId.null_id, value);
		urlClassLoader = value;
	}
	
	private void setCrXml(String value) {
		crXml = value;
	}
	
	private void setCrCfg(String value) {
		crCfg = value;
	}
	
	private void loadClass(String className) throws JobDriverException {
		String location = "loadClass";
		try {
			logger.info(location, IEntityId.null_id, "loading "+className);
			Class<?> loadedClass = urlClassLoader.loadClass(className);
			MessageBuffer mb = new MessageBuffer();
			mb.append(Standardize.Label.loaded.get()+loadedClass.getName());
			logger.debug(location, IEntityId.null_id, mb.toString());
		} 
		catch (Exception e) {
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
	}
}
