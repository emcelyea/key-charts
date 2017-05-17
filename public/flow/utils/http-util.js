'use strict';

var HttpUtil = {

	post:function(url, body){
		return new Promise(function (resolve, reject) {
    
	    var request = new XMLHttpRequest();
	    request.open('POST', url);
			request.setRequestHeader("Content-Type", "application/json");

	    request.onload = function () {
	      if (request.readyState === XMLHttpRequest.DONE){
	      	if(request.status == 200) {
	          resolve(JSON.parse(request.responseText));
	        } else {
	          reject(Error(request.statusText));
	        }
	      }
	    };

	    request.onerror = function () {
	      reject(Error('Network Error'));
	    };  
	    request.send(JSON.stringify(body));
		});
	},

	get:function(url){
		return new Promise(function (resolve, reject) {
	    var request = new XMLHttpRequest();
	    request.open('GET', url);

	    request.onload = function () {
	      if (request.readyState === XMLHttpRequest.DONE){
	      	if(request.status == 200) {
	          resolve(JSON.parse(request.responseText));
	        } else {
	          reject(Error(request.statusText));
	        }
	      }
	    };
	    request.onerror = function () {
	      reject(Error('Network Error'));
	    };  
	    request.send();
		});				
	},

	put:function(url, body){
		return new Promise(function (resolve, reject) {
    
	    var request = new XMLHttpRequest();
	    request.open('PUT', url);
			request.setRequestHeader("Content-Type", "application/json");

	    request.onload = function () {
	      if (request.readyState === XMLHttpRequest.DONE){
	      	if(request.status == 200) {
	          resolve(JSON.parse(request.responseText));
	        } else {
	          reject(Error(request.statusText));
	        }
	      }
	    };
	    request.onerror = function () {
	      reject(Error('Network Error'));
	    };  
	    request.send(JSON.stringify(body));
		});		
	},

	delete:function(url){
		return new Promise(function (resolve, reject) {
    
	    var request = new XMLHttpRequest();
	    request.open('DELETE', url);
			request.setRequestHeader("Content-Type", "application/json");

	    request.onload = function () {
	      if (request.readyState === XMLHttpRequest.DONE){
	      	if(request.status == 200) {
	          resolve(JSON.parse(request.responseText));
	        } else {
	          reject(Error(request.statusText));
	        }
	      }
	    };
	    request.onerror = function () {
	      reject(Error('Network Error'));
	    };  
	    request.send();
		});		
	}

}