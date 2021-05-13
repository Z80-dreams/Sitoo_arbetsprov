/*
  This file contains the logic for adding users
*/

import React from 'react';

// Home made helper libraries
import * as helper from './../helper_functions/guiComponents.js';
import * as sitooApi from './../helper_functions/sitooLib.js';



const deleteUsers = (props) => {

    
    let tempUsers = props.users.filter((userObj) => {
	return props.checkedUsers.some((uid) =>
	    {
		return uid === userObj.userid;
	    })
    });

    
    
    const form = () => {
	
	if (tempUsers.length > 0 && tempUsers.length < 11) {
	    return(
		<>
		    <div className='popupForm deleteheader'>
			Do you <strong>really</strong> want to delete the users below?<br/>
			This action cannot be undone.
		    </div>
		    <div className='popupForm deleteuserslist'>
			{tempUsers.map((userObj) => {
			    return(
				
				<div key={userObj.userid} className='deleteRow'>
				    <span key={userObj.userid + ".name"} className='popupForm nametodelete'>{userObj.namefirst} {userObj.namelast} </span><span key={userObj.userid + ".email"} className='popupForm emailtodelete'> ({userObj.email})</span><br/>
				</div>
				
			    );
			})
			}
		    </div>
		    <div className='formButtons'>
			<button className='popupForm cancel' onClick={props.closeHandle}>Cancel</button>
			<button className='popupForm submit' onClick={deleteEach}>Save</button>
		    </div>
		</>
	    );
	}
    }

    const deleteEach = () => {
	tempUsers.forEach(
	    (userObj) => {
		submitData(userObj.userid);
	    });
	
    }
    
    const submitData = (uid) => {
	let userObj = props.users.filter((uo) => {
	    return uo.userid === uid;
	})[0]
	console.log(userObj);
	
	sitooApi.deleteUser(uid).then(response => {

	    if (response.status >= 200 && response.status < 300) {
		if (response.text === true) {
		    helper.showSuccess("User " + userObj.namefirst + " " + userObj.namelast + " deleted!", props.addMessage);
		    props.handleDataloading();
		    props.closeHandle();
		}
		else {
		    helper.showAlert("Could not delete user " + userObj.namefirst + " " + userObj.namelast + ". " + response.text.errortext, props.addMessage);
		}
		
	    }
	    else {
		helper.showAlert(response.status + " - " + response.text.message + " (Are you connected to the Internet?)", props.addMessage);
	    }
	}).catch(err => {
	    helper.showAlert("Could not delete user " + userObj.namefirst + " " + userObj.namelast + " (Are you connected to the Internet?)", props.addMessage);
	    console.error(err);
	    props.handleDataloading();
	    props.closeHandle();
	});
	
    }

    /* =================================================================== */
    if (props.checkedUsers.length < 1) {
	return(
	    <helper.popupForm title='Delete User' content={<p>You must select at least one user to delete.</p>} closeHandle={props.closeHandle} outerProps={props} />
	);
    }
    else if (props.checkedUsers.length > 10) {
	return(
	    <helper.popupForm title='Delete User' content={<p className='popupBox'>You can only delete ten user at a time, as safety measure.</p>} closeHandle={props.closeHandle} outerProps={props} />
	);
    }
    else {
	return(
	    <helper.popupForm title='Delete User' content={form()} closeHandle={props.closeHandle} outerProps={props} />
    );
    }
}

export default deleteUsers;
