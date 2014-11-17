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
import java.net.URL;
import java.net.URLClassLoader;

import org.apache.uima.ducc.common.utils.DuccLogger;
import org.apache.uima.ducc.container.common.ContainerLogger;
import org.apache.uima.ducc.container.common.ContainerPropertiesHelper;
import org.apache.uima.ducc.container.common.IContainerLogger;
import org.apache.uima.ducc.container.common.IEntityId;
import org.apache.uima.ducc.container.common.MessageBuffer;
import org.apache.uima.ducc.container.common.Standardize;
import org.apache.uima.ducc.container.common.classloader.ClassLoaderUtil;
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

	private String[] requiredClasses = { 
			"org.apache.uima.ducc.user.jd.JdUserCollectionReader", 
			"org.apache.uima.aae.UimaSerializer",
			"org.apache.uima.cas.CAS",
			"com.thoughtworks.xstream.XStream",
			};
	
	public ProxyJobDriverCollectionReader() throws JobDriverException {
		ClassLoader classLoader = ClassLoaderUtil.getClassLoader();
		initialize(classLoader);
	}
	
	public ProxyJobDriverCollectionReader(boolean parentFlag) throws JobDriverException {
		ClassLoader classLoader = ClassLoaderUtil.getClassLoader();
		if(parentFlag) {
			classLoader = ClassLoaderUtil.getClassLoaderParent();
		}
		initialize(classLoader);
	}
	
	private void initialize(ClassLoader baseClassLoader) throws JobDriverException {
		String location = "initialize";
		ContainerPropertiesHelper cph = ContainerPropertiesHelper.getInstance();
		String userClasspath = cph.getUserClasspath();
		String resolvedUserCP = ClassLoaderUtil.resolveClasspathWildcards(userClasspath);
		String[] classpath = cph.stringToArray(resolvedUserCP);
		URL[] classLoaderUrls = new URL[classpath.length];
		logger.info(location, IEntityId.null_id, "classpath");
		int i = 0;
		for(String jar : classpath) {
			String text = "["+i+"]"+" "+jar;
			logger.info(location, IEntityId.null_id, text);
			classLoaderUrls[i] = this.getClass().getResource(jar);
			i++;
		}
		URLClassLoader classLoader = new URLClassLoader(classLoaderUrls, baseClassLoader);
		String crXml = cph.getCollectionReaderXml();
		String crCfg = cph.getCollectionReaderCfg();
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
	
	private void construct(URLClassLoader classLoader, String crXml, String cfCfg) throws JobDriverException {
		setup(classLoader, crXml, cfCfg);
		validate();
		prepare();
	}
	
	private void setup(URLClassLoader urlClassLoader, String crXml, String crCfg) throws JobDriverException {
		String location = "setup";
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
	
	private void prepare() throws JobDriverException {
		String location = "prepare";
		try {
			class_JdUserCollectionReader = urlClassLoader.loadClass("org.apache.uima.ducc.user.jd.JdUserCollectionReader");
			Constructor<?> constructor_JdUserCollectionReader = class_JdUserCollectionReader.getConstructor(String.class,String.class);
			instance_JdUserCollectionReader = constructor_JdUserCollectionReader.newInstance(new Object[] { crXml, crCfg });
			method_getTotal = class_JdUserCollectionReader.getMethod(name_getTotal, nullClassArray);
			class_JdUserMetaCas = urlClassLoader.loadClass("org.apache.uima.ducc.user.jd.JdUserMetaCas");
			method_getJdUserMetaCas = class_JdUserCollectionReader.getMethod(name_getJdUserMetaCas, nullClassArray);
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
			MessageBuffer mb1 = new MessageBuffer();
			mb1.append(Standardize.Label.loading.get()+className);
			logger.debug(location, IEntityId.null_id, mb1.toString());
			Class<?> loadedClass = urlClassLoader.loadClass(className);
			MessageBuffer mb2 = new MessageBuffer();
			mb2.append(Standardize.Label.loaded.get()+loadedClass.getName());
			logger.trace(location, IEntityId.null_id, mb2.toString());
		} 
		catch (Exception e) {
			DuccLogger duccLogger = DuccLogger.getLogger(ProxyJobDriverCollectionReader.class, "JD");
			duccLogger.error(location, null, e);
			logger.error(location, IEntityId.null_id, e);
			throw new JobDriverException(e);
		}
	}
}
