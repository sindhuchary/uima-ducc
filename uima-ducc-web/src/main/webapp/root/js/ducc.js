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
/*!
 * ducc.js
 */

var oTable;
var display_table_style;

function ducc_cluetips() {
	try {
		$('a.logfileLink').cluetip('destroy');
		$('a.logfileLink').cluetip({
			width: '600px',
	    	attribute: 'href',
	    	activation: 'click',
	    	sticky: true,
	    	closePosition: 'title',
  			closeText: '<img src="opensources/cluetip/cross.png" alt="close" />',
	    	mouseOutClose: true
	  	});
		$('a.classLoad').cluetip('destroy');
		$('a.classLoad').cluetip({
			width: 'auto',
    		local:true,
    		cluetipClass: 'jtip',
    		activation: 'click',
    		sticky: true,
    		titleAttribute: 'title',
    		closePosition: 'title',
    		mouseOutClose: true,
    		dropShadow: false,
   			arrows: true
		});
	}
	catch(err) {
		//ducc_error("ducc_cluetips",err);
	}	
}

function toggleById(id) {
   	$("#"+id).toggle();
}

function ducc_error(loc, err)
{
	var txt;
	txt="There was an error on this page.\n\n";
	txt+="Error location: " + loc + "\n\n";
	txt+="Error description: " + err.message + "\n\n";
	txt+="Click OK to continue.\n\n";
	alert(txt);
}

function ducc_window_close()
{
	try {
  		window.close();
  	}
	catch(err) {
		ducc_error("ducc_window_close",err);
	}	
}

function ducc_identity()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/cluster-name",
			success : function (data) 
			{
				$("#identity").html(data);
				$(document).attr("title", "ducc-mon: "+data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_identity",err);
	}
}

function ducc_version()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/version",
			success : function (data) 
			{
				$("#version").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_version",err);
	}
}

function ducc_authenticator_version()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/authenticator-version",
			success : function (data) 
			{
				$("#authenticator_version_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_authenticator_version",err);
	}
}

function ducc_links()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/login-link",
			success : function (data) 
			{
				$("#login_link_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_links",err);
	}
}

function ducc_timestamp()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/timestamp",
			success : function (data) 
			{
				$("#timestamp_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_timestamp",err);
	}
}

function ducc_authentication()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/user-authentication-status",
			success : function (data) 
			{
				$("#authentication_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_authentication",err);
	}
}

function ducc_init_common()
{
	try {
		data = "...?"
		$("authenticator_version_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_common",err);
	}
}

function ducc_load_common()
{
	try {
		ducc_authenticator_version()
		ducc_timestamp();
		ducc_authentication();
	}
	catch(err) {
		ducc_error("ducc_load_common",err);
	}
}

function ducc_load_jobs_data()
{
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_jobs_data()
	}
	else {
		ducc_load_scroll_jobs_data()
	}
}

function ducc_load_classic_jobs_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-jobs-data",
			success : function (data) 
			{
				$("#jobs_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_jobs_data",err);
	}	
}

function ducc_load_scroll_jobs_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-jobs",ducc_load_scroll_jobs_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_jobs_data",err);
	}	
}

function ducc_load_scroll_jobs_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_jobs_callback",err);
	}	
}

function ducc_init_jobs_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#jobs_list_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_jobs_data",err);
	}	
}

function ducc_load_services_data()
{
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_services_data()
	}
	else {
		ducc_load_scroll_services_data()
	}
}

function ducc_load_classic_services_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-services-data",
			success : function (data) 
			{
				$("#services_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_services_data",err);
	}	
}

function ducc_load_scroll_services_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-services",ducc_load_scroll_services_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_services_data",err);
	}	
}

function ducc_load_scroll_services_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_services_callback",err);
	}	
}

function ducc_init_services_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_services_data",err);
	}
}

function ducc_init_service_summary_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#job_workitems_count_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_service_summary_data",err);
	}
}

function ducc_load_service_summary_data()
{
	try {
		server_url= "/ducc-servlet/service-summary-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#service_summary_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_service_summary_data",err);
	}	
}

function ducc_init_job_workitems_count_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#job_workitems_count_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_job_workitems_count_data",err);
	}
}

function ducc_load_job_workitems_count_data()
{
	try {
		server_url= "/ducc-servlet/job-workitems-count-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#job_workitems_count_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_workitems_count_data",err);
	}	
}

function ducc_init_job_workitems_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#workitems_data_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_job_workitems_data",err);
	}
}

function ducc_load_job_workitems_data()
{
	try {
		server_url= "/ducc-servlet/job-workitems-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#workitems_data_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_workitems_data",err);
	}	
}

function ducc_init_job_performance_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#performance_data_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_job_performance_data",err);
	}
}

function ducc_load_job_performance_data()
{
	try {
		server_url= "/ducc-servlet/job-performance-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#performance_data_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_performance_data",err);
	}	
}

function ducc_init_job_specification_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#specification_data_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_job_specification_data",err);
	}
}

function ducc_load_job_specification_data()
{
	try {
		server_url= "/ducc-servlet/job-specification-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#specification_data_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_specification_data",err);
	}	
}

function ducc_init_service_registry_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#registry_data_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_service_registry_data",err);
	}
}

function ducc_load_service_registry_data()
{
	try {
		server_url= "/ducc-servlet/service-registry-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#registry_data_area").html(data);
				hide_show();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_service_registry_data",err);
	}	
}

function ducc_load_service_deployments_data()
{
	try {
		server_url= "/ducc-servlet/service-deployments-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#deployments_list_area").html(data);
				ducc_cluetips();
				hide_show();
     			ducc_timestamp();
				ducc_authentication();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_service_deployments_data",err);
	}
}

function ducc_init_service_deployments_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#deployments_list_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_service_deployments_data",err);
	}
}

function hide_show() {
	var classpathdata = ducc_appl("classpathdata");
	var c_value = ducc_get_cookie(classpathdata);
	if(c_value == null) {
		c_value = "hide";
	}
	if(c_value == "hide") {
		$('div.showdata').hide();
			$('div.hidedata').show();
	}
	if(c_value == "show") {
		$('div.showdata').show();
			$('div.hidedata').hide();
	}
	$('#showbutton0').click(function(){
		$('div.showdata').show();
		$('div.hidedata').hide();
		ducc_put_cookie(classpathdata,"show")
	});
	$('#hidebutton0').click(function(){
		$('div.showdata').hide();
		$('div.hidedata').show();
		ducc_put_cookie(classpathdata,"hide")
	});
	$('#showbutton1').click(function(){
		$('div.showdata').show();
		$('div.hidedata').hide();
		ducc_put_cookie(classpathdata,"show")
	});
	$('#hidebutton1').click(function(){
		$('div.showdata').hide();
		$('div.hidedata').show();
		ducc_put_cookie(classpathdata,"hide")
	});
}

function ducc_load_job_processes_data()
{
	try {
		server_url= "/ducc-servlet/job-processes-data"+location.search;
		$.ajax(
		{
			url : server_url,
			success : function (data) 
			{
				$("#processes_list_area").html(data);
				ducc_cluetips();
				hide_show();
     			ducc_timestamp();
				ducc_authentication();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_processes_data",err);
	}
}

function ducc_init_job_processes_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#processes_list_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_job_processes_data",err);
	}
}

function ducc_load_machines_data()
{
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_machines_data()
	}
	else {
		ducc_load_scroll_machines_data()
	}
}

function ducc_load_classic_machines_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-system-machines-data",
			success : function (data) 
			{
				$("#machines_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_machines_data",err);
	}			
}

function ducc_load_scroll_machines_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-machines",ducc_load_scroll_machines_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_machines_data",err);
	}	
}

function ducc_load_scroll_machines_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_machines_callback",err);
	}	
}

function ducc_init_machines_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_machines_data",err);
	}
}

function ducc_reservation_form_button()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-get-form-button",
			success : function (data) 
			{
				$("#reservation_form_button").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_reservation_form_button",err);
	}
}

function ducc_load_reservations_data()
{
	ducc_reservation_form_button();
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_reservations_data()
	}
	else {
		ducc_load_scroll_reservations_data()
	}
}

function ducc_load_classic_reservations_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-reservations-data",
			success : function (data) 
			{
				$("#reservations_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_reservations_data",err);
	}
}

function ducc_load_scroll_reservations_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-reservations",ducc_load_scroll_reservations_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_reservations_data",err);
	}	
}

function ducc_load_scroll_reservations_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_reservations_callback",err);
	}	
}

function ducc_init_reservations_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#reservations_list_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_reservations_data",err);
	}
}

function ducc_load_reservation_scheduling_classes()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-scheduling-classes",
			success : function (data) 
			{
				$("#scheduling_class_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_reservation_scheduling_classes",err);
	}
}

function ducc_load_reservation_instance_memory_sizes()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-instance-memory-sizes",
			success : function (data) 
			{
				$("#instance_memory_sizes_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_reservation_instance_memory_sizes",err);
	}
}

function ducc_load_reservation_instance_memory_units()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-instance-memory-units",
			success : function (data) 
			{
				$("#instance_memory_units_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_reservation_instance_memory_units",err);
	}
}

function ducc_load_reservation_number_of_instances()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-number-of-instances",
			success : function (data) 
			{
				$("#number_of_instances_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_reservation_number_of_instances",err);
	}		
}

function ducc_load_reservation_submit_button()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/reservation-get-submit-button",
			success : function (data) 
			{
				$("#reservation_submit_button_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_reservation_submit_button",err);
	}			
}

function ducc_load_submit_reservation_data()
{
	try {
		ducc_load_reservation_scheduling_classes();
		ducc_load_reservation_instance_memory_sizes();
		ducc_load_reservation_instance_memory_units();
		ducc_load_reservation_number_of_instances();
		ducc_load_reservation_submit_button();
		ducc_timestamp();
		ducc_authentication();
	}
	catch(err) {
		ducc_error("ducc_load_submit_reservation_data",err);
	}			
}

function ducc_init_submit_reservation_data()
{
	try {
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_submit_reservation_data",err);
	}	
}

function ducc_load_job_form()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/job-submit-form",
			success : function (data) 
			{
				$("#job_submit_form_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_form",err);
	}		
}

function ducc_load_job_submit_button()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/job-get-submit-button",
			success : function (data) 
			{
				$("#job_submit_button_area").html(data);
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_job_submit_button",err);
	}	
}

function ducc_load_submit_job_data()
{
	try {
		ducc_load_job_form();
		ducc_load_job_submit_button();
		ducc_timestamp();
		ducc_authentication();
	}
	catch(err) {
		ducc_error("ducc_load_submit_job_data",err);
	}
}

function ducc_init_submit_job_data()
{
	try {
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_submit_job_data",err);
	}
}

function ducc_load_system_administration_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/system-admin-admin-data",
			success : function (data) 
			{
				$("#system_administration_administrators_area").html(data);
				ducc_timestamp();
				ducc_authentication();
			}
		});
		$.ajax(
		{
			url : "/ducc-servlet/system-admin-control-data",
			success : function (data) 
			{
				$("#system_administration_control_area").html(data);
				ducc_timestamp();
				ducc_authentication();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_system_administration_data",err);
	}
}

function ducc_init_system_administration_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#system_administration_administrators_area").html(data);
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		$("#system_administration_quiesce_area").html(data);
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_system_administration_data",err);
	}
}

function ducc_load_system_classes_data()
{
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_system_classes_data()
	}
	else {
		ducc_load_scroll_system_classes_data()
	}
}

function ducc_load_classic_system_classes_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-system-classes-data",
			success : function (data) 
			{
				$("#system_classes_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_system_classes_data",err);
	}	
}

function ducc_load_scroll_system_classes_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-classes",ducc_load_scroll_system_classes_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_system_classes_data",err);
	}	
}

function ducc_load_scroll_system_classes_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_system_classes_callback",err);
	}	
}

function ducc_init_system_classes_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_system_classes_data",err);
	}
}

function ducc_button_show_agents()
{
	try {
		var agents = ducc_appl("agents");
		var c_value = "show";
		ducc_put_cookie(agents,c_value);
		document.getElementById("showbutton").style.display = 'none';
		document.getElementById("hidebutton").style.display = 'block';
	}
	catch(err) {
		ducc_error("ducc_button_show_agents",err);
	}
}

function ducc_show_agents()
{
	try {
		ducc_button_show_agents();
		ducc_refresh("system-daemons");
	}
	catch(err) {
		ducc_error("ducc_show_agents",err);
	}
}

function ducc_button_hide_agents()
{
	try {
		var agents = ducc_appl("agents");
		var c_value = "hide";
		ducc_put_cookie(agents,c_value);
		document.getElementById("showbutton").style.display = 'block';
		document.getElementById("hidebutton").style.display = 'none';
	}
	catch(err) {
		ducc_error("ducc_button_hide_agents",err);
	}
}

function ducc_hide_agents()
{
	try {
		ducc_button_hide_agents();
		ducc_refresh("system-daemons");
	}
	catch(err) {
		ducc_error("ducc_hide_agents",err);
	}
}


function ducc_default_agents()
{
	try {
		var agents = ducc_appl("agents");
		var c_value = ducc_get_cookie(agents);
		if(c_value == "hide") {
			ducc_button_hide_agents();
		}
		else if(c_value == "show") {
			ducc_button_show_agents();
		}
		else {
			ducc_button_hide_agents();
		}
	}
	catch(err) {
		ducc_error("ducc_hide_agents",err);
	}
}

function ducc_load_system_daemons_data()
{
	var table_style = ducc_preferences_get("table_style");
	if(table_style == "classic") {
		ducc_load_classic_system_daemons_data()
	}
	else {
		ducc_load_scroll_system_daemons_data()
	}
	ducc_default_agents();
}

function ducc_load_classic_system_daemons_data()
{
	try {
		$.ajax(
		{
			url : "/ducc-servlet/legacy-system-daemons-data",
			success : function (data) 
			{
				$("#system_daemons_list_area").html(data);
				ducc_timestamp();
				ducc_authentication();
				ducc_cluetips();
			}
		});
	}
	catch(err) {
		ducc_error("ducc_load_classic_system_daemons_data",err);
	}	
}

function ducc_load_scroll_system_daemons_data()
{
	try {
		oTable.fnReloadAjax("/ducc-servlet/json-format-aaData-daemons",ducc_load_scroll_system_daemons_callback);
	}
	catch(err) {
		ducc_error("ducc_load_scroll_system_daemons_data",err);
	}	
}

function ducc_load_scroll_system_daemons_callback() 
{
	try {
		ducc_timestamp();
		ducc_authentication();
		ducc_cluetips();
	}
	catch(err) {
		ducc_error("ducc_load_scroll_system_daemons_callback",err);
	}	
}

function ducc_init_system_daemons_data()
{
	try {
		data = "<img src=\"opensources/images/indicator.gif\" alt=\"waiting...\">"
		data = "...?"
		$("#timestamp_area").html(data);
		data = "...?"
		$("#authentication_area").html(data);
	}
	catch(err) {
		ducc_error("ducc_init_system_daemons_data",err);
	}
}

function ducc_init(type)
{
	try {
		ducc_identity();
		ducc_version();
		ducc_links();
		ducc_cookies();
		if(type == "jobs") {
			$(document).keypress(function(e) {
  			if(e.which == 13) {
    			ducc_jobs_page();
  			}
			});
			ducc_init_jobs_data();
			ducc_load_jobs_data();
		}
		if(type == "services") {
			$(document).keypress(function(e) {
  			if(e.which == 13) {
    			ducc_services_page();
  			}
			});
			ducc_init_services_data();
			ducc_load_services_data();
		}
		if(type == "job-details") {
			ducc_init_job_workitems_count_data();
			ducc_init_job_processes_data();
			ducc_init_job_workitems_data();
			ducc_init_job_performance_data();
			ducc_init_job_specification_data();
			ducc_load_job_workitems_count_data();
			ducc_load_job_specification_data();
			ducc_load_job_workitems_data();
			ducc_load_job_performance_data();
			ducc_load_job_processes_data();
		}
		if(type == "service-details") {
			ducc_init_service_summary_data();
			ducc_init_service_deployments_data();
			ducc_init_service_registry_data();
			ducc_load_service_summary_data();
			ducc_load_service_deployments_data();
			ducc_load_service_registry_data();
		}
		if(type == "system-machines") {
			ducc_init_machines_data();
			ducc_load_machines_data();
		}
		if(type == "reservations") {
			$(document).keypress(function(e) {
  			if(e.which == 13) {
    			ducc_reservations_page();
  			}
			});
			ducc_init_reservations_data();
			ducc_load_reservations_data();
		}
		if(type == "submit-reservation") {
			ducc_init_submit_reservation_data();
			ducc_load_submit_reservation_data();
		}
		if(type == "submit-job") {
			ducc_init_submit_job_data();
			ducc_load_submit_job_data();
		}
		if(type == "system-administration") {
			ducc_init_system_administration_data();
			ducc_load_system_administration_data();
		}
		if(type == "system-classes") {
			ducc_init_system_classes_data();
			ducc_load_system_classes_data();
		}
		if(type == "system-daemons") {
			ducc_init_system_daemons_data();
			ducc_load_system_daemons_data();
		}
		if(type == "authentication-login") {
			ducc_init_common();
			ducc_load_common();
			$(document).keypress(function(e) {
  			if(e.which == 13) {
    			ducc_submit_login();
  			}
			});
		}
		if(type == "authentication-logout") {
			ducc_init_common();
			ducc_load_common();
			$(document).keypress(function(e) {
  			if(e.which == 13) {
    			ducc_logout();
  			}
			});
		}
		var table_style = ducc_preferences_get("table_style");
		display_table_style = table_style;
		ducc_timed_loop(type);
	}
	catch(err) {
		ducc_error("ducc_init",err);
	}
}

function ducc_cookies()
{
	try {
		var refreshmode = ducc_appl("refreshmode");
		var c_value = ducc_get_cookie(refreshmode);
		if(c_value == "automatic") {
			document.duccform.refresh[0].checked = false;
			document.duccform.refresh[1].checked = true;
		}
		else if(c_value == "manual") {
			document.duccform.refresh[0].checked = true;
			document.duccform.refresh[1].checked = false;
		}
		else {
			document.duccform.refresh[0].checked = false;
			document.duccform.refresh[1].checked = true;
			c_value = "automatic";
			ducc_put_cookie(refreshmode, c_value);
		}
	}
	catch(err) {
		ducc_error("ducc_cookies",err);
	}		
}

function ducc_appl(name)
{
	try {
		var appl = "ducc:";
		return appl+name;
	}
	catch(err) {
		ducc_error("ducc_appl",err);
	}	
}

function ducc_jobs_max_records() 
{
	try {
		var d_value = "16";
		var x_value = "1";
		var y_value = "4096";
		var jobsmax = ducc_appl("jobsmax");
		//
		var c_value = ducc_get_cookie(jobsmax);
		var r_value = document.form_selectors.maxrecs_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(jobsmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.maxrecs_input.value = c_value;
			//$.jGrowl(" max records: "+c_value);
			return;
		}
		//
		n_value = 1*r_value;
		if(isNaN(n_value)) {
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records, invalid: "+r_value);
			return;
		}
		r_value = 1*r_value;
		x_value = 1*x_value;
		y_value = 1*y_value;
		if(r_value < x_value) {
			$.jGrowl(" max records, too small: "+r_value+" < "+x_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value > y_value) {
			$.jGrowl(" max records, too large: "+r_value+" > "+y_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		//
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(jobsmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records: "+c_value);
			return;
		}
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_jobs_max_records",err);
	}		
}

function ducc_jobs_users() 
{
	try {
		var jobsusers = ducc_appl("jobsusers");
		var d_value = "";
		var c_value = ducc_get_cookie(jobsusers);
		var r_value = document.form_selectors.users_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(jobsusers,c_value);
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(jobsusers,c_value);
			document.form_selectors.users_input.value = c_value;
			$.jGrowl(" users: "+c_value);
			return;
		}
		return;
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_jobs_users",err);
	}	
}

function ducc_jobs_page() 
{
	ducc_jobs_max_records();
	ducc_jobs_users();
	ducc_load_jobs_data();
}

function ducc_services_max_records() 
{
	try {
		var d_value = "16";
		var x_value = "1";
		var y_value = "4096";
		var servicesmax = ducc_appl("servicesmax");
		//
		var c_value = ducc_get_cookie(servicesmax);
		var r_value = document.form_selectors.maxrecs_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(servicesmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.maxrecs_input.value = c_value;
			//$.jGrowl(" max records: "+c_value);
			return;
		}
		//
		n_value = 1*r_value;
		if(isNaN(n_value)) {
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records, invalid: "+r_value);
			return;
		}
		r_value = 1*r_value;
		x_value = 1*x_value;
		y_value = 1*y_value;
		if(r_value < x_value) {
			$.jGrowl(" max records, too small: "+r_value+" < "+x_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value > y_value) {
			$.jGrowl(" max records, too large: "+r_value+" > "+y_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		//
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(servicesmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records: "+c_value);
			return;
		}
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_services_max_records",err);
	}		
}

function ducc_services_users() 
{
	try {
		var servicesusers = ducc_appl("servicesusers");
		var d_value = "";
		var c_value = ducc_get_cookie(servicesusers);
		var r_value = document.form_selectors.users_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(servicesusers,c_value);
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(servicesusers,c_value);
			document.form_selectors.users_input.value = c_value;
			$.jGrowl(" users: "+c_value);
			return;
		}
		return;
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_services_users",err);
	}	
}

function ducc_services_page() 
{
	ducc_services_max_records();
	ducc_services_users();
	ducc_load_services_data();
}

function ducc_reservations_max_records() 
{
	try {
		var d_value = "16";
		var x_value = "1";
		var y_value = "4096";
		var reservationsmax = ducc_appl("reservationsmax");
		//
		var c_value = ducc_get_cookie(reservationsmax);
		var r_value = document.form_selectors.maxrecs_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(reservationsmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.maxrecs_input.value = c_value;
			//$.jGrowl(" max records: "+c_value);
			return;
		}
		//
		n_value = 1*r_value;
		if(isNaN(n_value)) {
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records, invalid: "+r_value);
			return;
		}
		r_value = 1*r_value;
		x_value = 1*x_value;
		y_value = 1*y_value;
		if(r_value < x_value) {
			$.jGrowl(" max records, too small: "+r_value+" < "+x_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		if(r_value > y_value) {
			$.jGrowl(" max records, too large: "+r_value+" > "+y_value);
			document.form_selectors.maxrecs_input.value = c_value;
			return;
		}
		//
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(reservationsmax,c_value);
			document.form_selectors.maxrecs_input.value = c_value;
			$.jGrowl(" max records: "+c_value);
			return;
		}
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_reservations_max_records",err);
	}		
}

function ducc_reservations_users() 
{
	try {
		var reservationsusers = ducc_appl("reservationsusers");
		var d_value = "";
		var c_value = ducc_get_cookie(reservationsusers);
		var r_value = document.form_selectors.users_input.value;
		if(c_value == null) {
			c_value = d_value;
			ducc_put_cookie(reservationsusers,c_value);
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(r_value == "default") {
			document.form_selectors.users_input.value = c_value;
			return;
		}
		if(c_value != r_value) {
			c_value = r_value;
			ducc_put_cookie(reservationsusers,c_value);
			document.form_selectors.users_input.value = c_value;
			$.jGrowl(" users: "+c_value);
			return;
		}
		return;
	}
	catch(err) {
		throw err;
		//ducc_error("ducc_reservations_users",err);
	}	
}

function ducc_reservations_page() 
{
	ducc_reservations_max_records();
	ducc_reservations_users();
	ducc_load_reservations_data();
}

function ducc_refresh_page(type)
{
	var table_style = ducc_preferences_get("table_style");
	if(display_table_style == table_style) {
		ducc_update_page(type);
	}
	else {
		display_table_style = table_style;
		window.location.reload();
	}
}

function ducc_update_page(type)
{
	try {
		if(type == "jobs") {
			ducc_jobs_page();
		}
		if(type == "services") {
			ducc_services_page();
		}
		if(type == "reservations") {
			ducc_reservations_page();
		}
		for (var i=0; i < document.duccform.refresh.length; i++) {
			if (document.duccform.refresh[i].checked) {
				c_value = document.duccform.refresh[i].value;
				if( c_value == "automatic") {
					if(type == "jobs") {
						ducc_load_jobs_data();
					}
					if(type == "services") {
						ducc_load_services_data();
					}
					if(type == "reservations") {
						ducc_load_reservations_data();
					}
					if(type == "job-details") {
						//ducc_load_job_specification_data();
						ducc_load_job_performance_data();
						ducc_load_job_workitems_data();
						ducc_load_job_processes_data();
						ducc_load_job_workitems_count_data();
					}
					if(type == "service-details") {
						//ducc_load_service_registry_data();
						ducc_load_service_deployments_data();
					}
					if(type == "system-machines") {
						ducc_load_machines_data();
					}
					if(type == "system-administration") {
						ducc_load_system_administration_data();
					}
					if(type == "system-daemons") {
						ducc_load_system_daemons_data();
					}
					if(type == "system-classes") {
						ducc_load_system_classes_data();
					}
				}
			}
		}
	}
	catch(err) {
		ducc_error("ducc_update_page",err);
	}			
}

function ducc_refresh_stopped(type) {
	document.getElementById("loading").style.display = 'none';
	document.getElementById("refreshbutton").style.display = 'block';
}

function ducc_refresh_running(type) {
	ducc_refresh_page(type)
	setTimeout(function(){ducc_refresh_stopped(type); type = null},1000);
}

function ducc_refresh_started(type) {
	document.getElementById("refreshbutton").style.display = 'none';
	document.getElementById("loading").style.display = 'block';
	setTimeout(function(){ducc_refresh_running(type); type = null},1);
}

function ducc_refresh(type) {
	setTimeout(function(){ducc_refresh_started(type); type = null},1);
}

function ducc_timed_loop(type) {
	try {
		tid = setTimeout(function(){ducc_timed_loop(type); type = null},30000); // again
		var refreshmode = ducc_appl("refreshmode");
		var c_value = ducc_get_cookie(refreshmode);
		if(c_value == null) {
			c_value = "automatic";
			ducc_put_cookie(refreshmode, c_value);
		}
		if(c_value == "automatic") {
			ducc_refresh(type);
		}
	}
	catch(err) {
		ducc_error("ducc_timed_loop",err);
	}		
}

function ducc_terminate_job(id)
{	
	try {
		$.jGrowl(" Pending termination...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/job-cancel-request"+"?id="+id,
			success : function (data) 
			{
			$.jGrowl(data, { life: 6000 });
			setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_terminate_job",err);
	}	
	return false;
}

function ducc_terminate_service(id)
{	
	try {
		$.jGrowl(" Pending termination...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/service-cancel-request"+"?id="+id,
			success : function (data) 
			{
				$.jGrowl(data, { life: 6000 });
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_terminate_service",err);
	}
	return false;
}

function ducc_service_start(id)
{	
	try {
		$.jGrowl(" Pending start...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/service-start-request"+"?id="+id,
			success : function (data) 
			{
				$.jGrowl(data, { life: 6000 });
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_service_start",err);
	}
	return false;
}

function ducc_service_stop(id)
{	
	try {
		$.jGrowl(" Pending stop...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/service-stop-request"+"?id="+id,
			success : function (data) 
			{
				$.jGrowl(data, { life: 6000 });
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_service_stop",err);
	}
	return false;
}

function ducc_terminate_reservation(id)
{	
	try {
		$.jGrowl(" Pending termination...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/reservation-cancel-request"+"?id="+id,
			success : function (data) 
			{
				$.jGrowl(data, { life: 6000 });
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_terminate_reservation",err);
	}
	return false;
}

function ducc_confirm_accept_jobs()
{
	try {
		var result=confirm("System to accept job submits?");
		if (result==true) {
  			ducc_accept_jobs();
  		}
	}
	catch(err) {
		ducc_error("ducc_confirm_accept_jobs",err);
	}
}

function ducc_accept_jobs(id)
{	
	try {
		$.jGrowl(" Pending jobs submit unblocking...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/jobs-control-request"+"?type=accept",
			success : function (data) 
			{
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_accept_jobs",err);
	}
	return false;
}

function ducc_confirm_block_jobs()
{
	var result=confirm("System to block job submits?");
	if (result==true) {
  		ducc_block_jobs();
  	}
}

function ducc_block_jobs(id)
{	
	try {
		$.jGrowl(" Pending jobs submit blocking...");
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/jobs-control-request"+"?type=block",
			success : function (data) 
			{
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_block_jobs",err);
	}
	return false;
}

function ducc_confirm_terminate_job(id)
{
	try {
		var result=confirm("Terminate job "+id+"?");
		if (result==true) {
  			ducc_terminate_job(id);
  		}
  	}
	catch(err) {
		ducc_error("ducc_confirm_terminate_job",err);
	}
}

function ducc_confirm_terminate_service(id)
{
	try {
		var result=confirm("Terminate service "+id+"?");
		if (result==true) {
  			ducc_terminate_service(id);
  		}
	}
	catch(err) {
		ducc_error("ducc_confirm_terminate_service",err);
	}	
}

function ducc_confirm_service_start(id)
{
	try {
		var result=confirm("Start service "+id+"?");
		if (result==true) {
  			ducc_service_start(id);
  		}
	}
	catch(err) {
		ducc_error("ducc_confirm_service_start",err);
	}	
}

function ducc_confirm_service_stop(id)
{
	try {
		var result=confirm("Stop service "+id+"?");
		if (result==true) {
  			ducc_service_stop(id);
  		}
	}
	catch(err) {
		ducc_error("ducc_confirm_service_stop",err);
	}	
}

function ducc_confirm_terminate_reservation(id)
{
	try {
		var result=confirm("Terminate reservation "+id+"?");
		if (result==true) {
  			ducc_terminate_reservation(id);
  		}
	}
	catch(err) {
		ducc_error("ducc_confirm_terminate_reservation",err);
	}	
}

function ducc_logout()
{
	try {
		$.jGrowl(" Pending logout...");
		$.ajax(
		{
			url : "/ducc-servlet/user-logout",
			success : function (data) 
			{
				setTimeout(function(){window.close();}, 5000);
			}
		});
		setTimeout(function(){window.close();}, 5000);
	}
	catch(err) {
		ducc_error("ducc_logout",err);
	}	
	return false;
}

function ducc_cancel_logout()
{
  	try {
  		window.close();
  	}
	catch(err) {
		ducc_error("ducc_cancel_logout",err);
	}	
}

function ducc_submit_login()
{
	try {
  		var url = document.forms[1].action;
  		var userid = document.forms[1].userid.value
  		var password = document.forms[1].password.value
  		$.jGrowl(" Pending login...");
  		$.ajax({
           type: "POST",
           url: url,
           data: $("#login").serialize(), // serializes the form's elements.
           success: function(data)
           {
               result = data.trim();
               if(result == "success") {
               		//$.jGrowl(" "+result[1]+"="+result[2]);
               		//$.jGrowl(" "+result[3]+"="+result[4]);
               		//ducc_put_cookie(result[1],result[2]);
               		//ducc_put_cookie(result[3],result[4]);
               		$.jGrowl(" "+"login success", { theme: 'jGrowl-success' });
               		setTimeout(function(){window.close();}, 5000);
               }
               else {
               		$.jGrowl(" "+"login failed", { theme: 'jGrowl-error' });
               		$.jGrowl(" "+data, { life: 15000 });
               		setTimeout(function(){window.close();}, 15000);
               }
           }
       	});
  	}
	catch(err) {
		ducc_error("ducc_submit_login",err);
	}		
	return false;
}

function ducc_cancel_login()
{
	try {
  		window.close();
  	}
	catch(err) {
		ducc_error("ducc_cancel_login",err);
	}	
}

function ducc_cancel_submit_reservation()
{
	try {
  		window.close();
  	}
	catch(err) {
		ducc_error("ducc_cancel_submit_reservation",err);
	}	
}

function ducc_confirm_submit_job()
{
	try {
		var result=confirm("Submit?");
		if (result==true) {
  			ducc_submit_job();
  			alert("Request sent");
  			window.close();
  		}
   	}
	catch(err) {
		ducc_error("ducc_confirm_submit_job",err);
	}	 		
}

function ducc_submit_job()
{
	try {
		var e = document.getElementById("description");
		var description = e.value;
		var e = document.getElementById("jvm");
		var jvm = e.value;
		var e = document.getElementById("scheduling_class");
		var scheduling_class = e.value;
		var e = document.getElementById("log_directory");
		var log_directory = e.value;
		var e = document.getElementById("working_directory");
		var working_directory = e.value;
		var e = document.getElementById("driver_jvm_args");
		var driver_jvm_args = e.value;
		var e = document.getElementById("driver_classpath");
		var driver_classpath = e.value;
		var e = document.getElementById("driver_environment");
		var driver_environment = e.value;
		var e = document.getElementById("driver_memory_size");
		var driver_memory_size = e.value;
		var e = document.getElementById("driver_descriptor_CR");
		var driver_descriptor_CR = e.value;
		var e = document.getElementById("driver_descriptor_CR_overrides");
		var driver_descriptor_CR_overrides = e.value;
		var e = document.getElementById("process_jvm_args");
		var process_jvm_args = e.value;
		var e = document.getElementById("process_classpath");
		var process_classpath = e.value;
		var e = document.getElementById("process_environment");
		var process_environment = e.value;
		var e = document.getElementById("process_memory_size");
		var process_memory_size = e.value;
		var e = document.getElementById("process_descriptor_CM");
		var process_descriptor_CM = e.value;
		var e = document.getElementById("process_descriptor_AE");
		var process_descriptor_AE = e.value;
		var e = document.getElementById("process_descriptor_CC");
		var process_descriptor_CC = e.value;
		var e = document.getElementById("process_deployments_max");
		var process_deployments_max = e.value;
		var e = document.getElementById("process_deployments_min");
		var process_deployments_min = e.value;
		var e = document.getElementById("process_thread_count");
		var process_thread_count = e.value;
		var e = document.getElementById("process_get_meta_time_max");
		var process_get_meta_time_max = e.value;
		var e = document.getElementById("process_per_item_time_max");
		var process_per_item_time_max = e.value;
		$.ajax(
		{
			type: 'POST',
			url : "/ducc-servlet/job-submit-request",
			data: {'description':description,
			   'jvm':jvm,
			   'scheduling_class':scheduling_class,
			   'log_directory':log_directory,
			   'working_directory':working_directory,
			   'driver_jvm_args':driver_jvm_args,
			   'driver_classpath':driver_classpath,
			   'driver_environment':driver_environment,
			   'driver_memory_size':driver_memory_size,
			   'driver_descriptor_CR':driver_descriptor_CR,
			   'driver_descriptor_CR_overrides':driver_descriptor_CR_overrides,
			   'process_jvm_args':process_jvm_args,
			   'process_classpath':process_classpath,
			   'process_environment':process_environment,
			   'process_memory_size':process_memory_size,
			   'process_descriptor_CM':process_descriptor_CM,
			   'process_descriptor_AE':process_descriptor_AE,
			   'process_descriptor_CC':process_descriptor_CC,
			   'process_deployments_max':process_deployments_max,
			   'process_deployments_min':process_deployments_min,
			   'process_thread_count':process_thread_count,
			   'process_get_meta_time_max':process_get_meta_time_max,
			   'process_per_item_time_max':process_per_item_time_max,
			  },
			success : function (data) 
			{
				alert('success');
			}
		});
	}
	catch(err) {
		ducc_error("ducc_submit_job",err);
	}		
}

function ducc_cancel_submit_job()
{
  	try {
  		window.close();
  	}
	catch(err) {
		ducc_error("ducc_cancel_submit_job",err);
	}	
}

function ducc_submit_reservation()
{
	try {
		var e = document.getElementById("scheduling_class");
		var scheduling_class = e.options[e.selectedIndex].value;
		var e = document.getElementById("instance_memory_size");
		var instance_memory_size = e.options[e.selectedIndex].value;
		var e = document.getElementById("instance_memory_units");
		var instance_memory_units = e.options[e.selectedIndex].value;
		var e = document.getElementById("number_of_instances");
		var number_of_instances = e.options[e.selectedIndex].value;
		var e = document.getElementById("description");
		var description = e.value;
		var e = document.getElementById("wait_for_result_yes");
		var wait_for_result = e.checked;
		if (wait_for_result) {
			document.getElementById("working_area").style.display = 'block';
			document.getElementById("submit_button").disabled = 'disabled';
			
			$.ajax(
			{
				type: 'POST',
				async: false,
				url : "/ducc-servlet/reservation-submit-request",
				data: {'scheduling_class':scheduling_class,'instance_memory_size':instance_memory_size,'instance_memory_units':instance_memory_units,'number_of_instances':number_of_instances,'description':description},
				success : function (data) 
				{
					$.jGrowl(data, { life: 15000 });
					setTimeout(function(){window.close();}, 15000);
				}
			});
			setTimeout(function(){window.close();}, 15000);
			
			document.getElementById("working_area").style.display = 'none';
		}
		else {
			$.jGrowl(" Pending allocation...");
			$.ajax(
			{
				type: 'POST',
				url : "/ducc-servlet/reservation-submit-request",
				data: {'scheduling_class':scheduling_class,'instance_memory_size':instance_memory_size,'instance_memory_units':instance_memory_units,'number_of_instances':number_of_instances,'description':description},
				success : function (data) 
				{
					setTimeout(function(){window.close();}, 5000);
				}
			});
			setTimeout(function(){window.close();}, 5000);
		}
	}
	catch(err) {
		ducc_error("ducc_submit_reservation",err);
	}		
	return false;
}

function ducc_put_cookie(name,value)
{
	try {
		var days = 365*31;
		ducc_put_cookie_timed(name,value,days);
	}
	catch(err) {
		ducc_error("ducc_put_cookie",err);
	}	
}

function ducc_put_cookie_timed(name,value,days) 
{
	try {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
	catch(err) {
		ducc_error("ducc_put_cookie_timed",err);
	}	
}

function ducc_get_cookie(name) 
{
	var cookie = null;
	try {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) {
				cookie = c.substring(nameEQ.length,c.length);
				break;
			}
		}
	}
	catch(err) {
		ducc_error("ducc_get_cookie",err);
	}	
	return cookie;
}

function ducc_remove_cookie(name) 
{
	try {
		ducc_put_cookie(name,"",-1);
	}
	catch(err) {
		ducc_error("ducc_remove_cookie",err);
	}	
}

function ducc_preferences_reset()
{
	try {
		var key = ducc_appl("table_style");
		var value = "scroll";
		//alert("ducc_preferences_reset"+" "+"key:"+key+" "+"value:"+value);
		ducc_put_cookie(key,value);
		var key = ducc_appl("date_style");
		var value = "long";
		//alert("ducc_preferences_reset"+" "+"key:"+key+" "+"value:"+value);
		ducc_put_cookie(key,value);
		var key = ducc_appl("filter_users_style");
		var value = "include";
		//alert("ducc_preferences_reset"+" "+"key:"+key+" "+"value:"+value);
		ducc_put_cookie(key,value);
		var key = ducc_appl("role");
		var value = "user";
		//alert("ducc_preferences_reset"+" "+"key:"+key+" "+"value:"+value);
		ducc_put_cookie(key,value);
		//
		ducc_preferences();
	}
	catch(err) {
		ducc_error("ducc_preferences_reset",err);
	}	
}

function ducc_preferences_set(name,value)
{
	try {
		var key = ducc_appl(name);
		//alert("ducc_preferences_set"+" "+"key:"+key+" "+"value:"+value);
		ducc_put_cookie(key,value);
		ducc_preferences();
	}
	catch(err) {
		ducc_error("ducc_preferences_set",err);
	}		
}

function ducc_preferences_get(name)
{
	try {
		var key = ducc_appl(name);
		var value = null;
		value = ducc_get_cookie(key);
		//alert("ducc_preferences_get"+" "+"key:"+key+" "+"value:"+value);
		return value;
	}
	catch(err) {
		ducc_error("ducc_preferences_get",err);
	}
}

function ducc_preferences_table_style() {
	try {
		var key = ducc_appl("table_style");
		var value = ducc_get_cookie(key);
		//alert("ducc_preferences"+" "+"key:"+key+" "+"value:"+value);
		if(value == "scroll") {
			document.form_preferences.table_style[0].checked = true;
			document.form_preferences.table_style[1].checked = false;
		}
		else if(value == "classic") {
			document.form_preferences.table_style[0].checked = false;
			document.form_preferences.table_style[1].checked = true;
		}
		else {
			value = "scroll";
			ducc_put_cookie(key, value);
			document.form_preferences.table_style[0].checked = true;
			document.form_preferences.table_style[1].checked = false;
		}
	}
	catch(err) {
		ducc_error("ducc_preferences_table_style",err);
	}
}

function ducc_preferences_date_style() {
	try {
		var key = ducc_appl("date_style");
		var value = ducc_get_cookie(key);
		//alert("ducc_preferences"+" "+"key:"+key+" "+"value:"+value);
		if(value == "long") {
			document.form_preferences.date_style[0].checked = true;
			document.form_preferences.date_style[1].checked = false;
			document.form_preferences.date_style[2].checked = false;
		}
		else if(value == "medium") {
			document.form_preferences.date_style[0].checked = false;
			document.form_preferences.date_style[1].checked = true;
			document.form_preferences.date_style[2].checked = false;
		}
		else if(value == "short") {
			document.form_preferences.date_style[0].checked = false;
			document.form_preferences.date_style[1].checked = false;
			document.form_preferences.date_style[2].checked = true;
		}
		else {
			value = "long";
			ducc_put_cookie(key, value);
			document.form_preferences.date_style[0].checked = true;
			document.form_preferences.date_style[1].checked = false;
			document.form_preferences.date_style[2].checked = false;
		}
	}
	catch(err) {
		ducc_error("ducc_preferences_date_style",err);
	}
}

function ducc_preferences_filter_users_style() {
	try {
		var key = ducc_appl("filter_users_style");
		var value = ducc_get_cookie(key);
		//alert("ducc_preferences"+" "+"key:"+key+" "+"value:"+value);
		if(value == "include") {
			document.form_preferences.filter_users_style[0].checked = true;
			document.form_preferences.filter_users_style[1].checked = false;
			document.form_preferences.filter_users_style[2].checked = false;
			document.form_preferences.filter_users_style[3].checked = false;
		}
		else if(value == "include+active") {
			document.form_preferences.filter_users_style[0].checked = false;
			document.form_preferences.filter_users_style[1].checked = true;
			document.form_preferences.filter_users_style[2].checked = false;
			document.form_preferences.filter_users_style[3].checked = false;
		}
		else if(value == "exclude") {
			document.form_preferences.filter_users_style[0].checked = false;
			document.form_preferences.filter_users_style[1].checked = false;
			document.form_preferences.filter_users_style[2].checked = true;
			document.form_preferences.filter_users_style[3].checked = false;
		}
		else if(value == "exclude+active") {
			document.form_preferences.filter_users_style[0].checked = false;
			document.form_preferences.filter_users_style[1].checked = false;
			document.form_preferences.filter_users_style[2].checked = false;
			document.form_preferences.filter_users_style[3].checked = true;
		}
		else {
			value = "include";
			ducc_put_cookie(key, value);
			document.form_preferences.filter_users_style[0].checked = true;
			document.form_preferences.filter_users_style[1].checked = false;
			document.form_preferences.filter_users_style[2].checked = false;
			document.form_preferences.filter_users_style[3].checked = false;
		}
	}
	catch(err) {
		ducc_error("ducc_preferences_filter_users_style",err);
	}
}

function ducc_preferences_role() {
	try {
		var key = ducc_appl("role");
		var value = ducc_get_cookie(key);
		//alert("ducc_preferences"+" "+"key:"+key+" "+"value:"+value);
		if(value == "user") {
			document.form_preferences.role[0].checked = true;
			document.form_preferences.role[1].checked = false;
		}
		else if(value == "administrator") {
			document.form_preferences.role[0].checked = false;
			document.form_preferences.role[1].checked = true;
		}
		else {
			value = "user";
			ducc_put_cookie(key, value);
			document.form_preferences.role[1].checked = true;
			document.form_preferences.role[0].checked = false;
		}
	}
	catch(err) {
		ducc_error("ducc_preferences_role",err);
	}
}

function ducc_preferences()
{
	try {
		ducc_preferences_table_style();
		ducc_preferences_date_style();
		ducc_preferences_filter_users_style();
		ducc_preferences_role();
	}
	catch(err) {
		ducc_error("ducc_preferences",err);
	}	
}
