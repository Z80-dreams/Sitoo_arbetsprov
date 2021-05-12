/* 
   This is a library of API-functions. They do all the try-catch work, work async with promises, etc, so that
   I don't have to concert myself with that in the main code. 
   
   Lots of arrow functions here, as I don't want any of them to have any state and only return immutable data. 
   Async .then method is used to wait for respone, and then chain on another thing to do.
*/




// These lines are needed when debugging in node. In browsers fetch, btoa and require is already installed.
//==========================================================================================================
const fetch = require("node-fetch");
const btoa = require("btoa");
const settings = require("../sitoo_settings.json");
//==========================================================================================================

const setUrl = () => settings.corsServer ? settings.corsUrl + ":" + settings.corsPort + "/" + settings.apiBaseUrl : settings.apiBaseUrl ;


/* Base function for GET, PUT and POST, so that I don't have to write the error checking code for each type of user data */
const httpGet = async function(urlstring) {
    let apiPromise = await fetch(urlstring, {method: 'GET',
					     headers: {'Content-Type': 'application/json',
						       'Accept': 'application/json',
						       'Authorization': 'Basic ' + btoa(settings.apiId + ':' + settings.apiPsw),}}).catch();
    
    return await checkResponse(apiPromise);        
}

const httpPut = async function(urlstring, dataPayload) {
    let apiPromise = await fetch(urlstring, {method: 'PUT',
					     headers: {'Content-Type': 'application/json',
						       'Accept': 'application/json',
						       'Authorization': 'Basic ' + btoa(settings.apiId + ':' + settings.apiPsw),},
					     body: JSON.stringify(dataPayload)});

    return await checkResponse(apiPromise);
}

const httpPost = async function(urlstring, dataPayload) {
    let apiPromise = await fetch(urlstring, {method: 'POST',
					     headers: {'Content-Type': 'application/json',
						       'Accept': 'application/json',
						       'Authorization': 'Basic ' + btoa(settings.apiId + ':' + settings.apiPsw),},
					     body: JSON.stringify(dataPayload)});

    return await checkResponse(apiPromise);

}

const httpDelete = async function(urlstring) {
    let apiPromise = await fetch(urlstring, {method: 'DELETE',
					     headers: {'Content-Type': 'application/json',
						       'Accept': 'application/json',
						       'Authorization': 'Basic ' + btoa(settings.apiId + ':' + settings.apiPsw),}});
    
    return await checkResponse(apiPromise);
}


const checkResponse = async function(apiPromise) {
    let data
    if (apiPromise.status >= 200 && apiPromise.status < 300) {
	data = {"status": apiPromise.status,
		"text": await apiPromise.json(),
	       }
    } else {
	data = {"status": apiPromise.status,
		"text": {"message": apiPromise.statusText},
	       }
    }
    return(data);     
}



/* Specific functions for each type of user data, so that I don't have to rembmer the URL */
const getUser = async function(userid) {
    return await httpGet(setUrl() + 'sites/' + settings.siteId + '/users/' + userid + '.json');
};


const getUsers = async function(maxUsersToGet) {
    return await httpGet(setUrl() + 'sites/' + settings.siteId + '/users.json?num=' + maxUsersToGet);
}



const updateUser = async function(userid, userobject) {
    return await httpPut(setUrl() + 'sites/' + settings.siteId + '/users/' + userid + '.json', userobject);
}

const updateUsers = async function(userobjects) {
    return await httpPut(setUrl() + 'sites/' + settings.siteId + '/users.json', userobjects);
}

const deleteUser = async function(userid) {
   return await httpDelete(setUrl() + 'sites/' + settings.siteId + '/users/' + userid + '.json'); 
}

const addUsers = async function(userobjects) {
    return await httpPost(setUrl() + 'sites/' + settings.siteId + '/users.json', userobjects);
}

// uncomment below when testing on web server.
export {getUser, getUsers, updateUser, updateUsers, deleteUser, addUsers};
// Below is just used for testing in node.js, comment when testing on web server.
// module.exports =  {getUser, getUsers, updateUser, updateUsers, deleteUser, addUsers}


