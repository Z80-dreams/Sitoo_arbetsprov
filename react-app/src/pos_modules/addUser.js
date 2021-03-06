/*
  This file contains the logic for adding users
*/

import React from 'react';
import $ from 'jquery';

// Home made helper libraries
import * as helper from './../helper_functions/guiComponents.js';
import * as sitooApi from './../helper_functions/sitooLib.js';



const addUser = (props) => {
    let tempUser = {};


    const form = () => {
	return(
	    <>
		<form className='popupForm'>
		    <label htmlFor='namefirst' className='popupForm'>First name</label><br/>
		    <input type='text' id='namefirst' className='popupForm' onChange={() => {tempUser.namefirst = $('#namefirst').val()}} /><br/>
		    <label htmlFor='namelast' className='popupForm'>Last name</label><br/>
		    <input type='text' id='namelast' className='popupForm' onChange={() => {tempUser.namelast = $('#namelast').val()}} /><br/>
		    <label htmlFor='email' className='popupForm'>Email</label><br/>
		    <input type='text' id='email' className='popupForm'  onChange={() => {tempUser.email = $('#email').val()}}/><br/>
		</form>
		<div className='formButtons'>
		    <button className='popupForm cancel' onClick={props.closeHandle}>Cancel</button>
		    <button className='popupForm submit' onClick={checkData}>Save</button>
		</div>
	    </>
	);
    }




    const checkData = () => {
	// Checking both names and email using regular expressions.

	// Only allow letters, space and dash (-) in names. unicode is permitted, hence the unicode flag.
	const namepattern = /^[\p{L}\s-]+$/u

	// email address can contain a-z, A-Z, 0-9, period or dash, one or more times,
	// followed by @-sign, followed by a-z, A-Z, 0-9, period or dash, one or ore times,
	// followed by a period and then a-z or A-Z that is two to four characters long
	// Unicode is not permitted in email address (åäö)	
	const emailpattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
	
	let firstnameCheck = namepattern.test(tempUser.namefirst);
	let lastnameCheck = namepattern.test(tempUser.namelast);
	let emailCheck = emailpattern.test(tempUser.email);

	if(firstnameCheck && lastnameCheck && emailCheck) {
	    submitData(tempUser);
	}
	else if (!emailCheck) {
	    helper.showAlert("That's not a valid email address!", props.addMessage);
	}
	else if (!firstnameCheck) {
	    helper.showAlert("Only letters, spaces and dash is allowed in the first name, and it cannot be empty!", props.addMessage);
	}
	else if (!lastnameCheck) {
	    helper.showAlert("Only letters, spaces and dash is allowed in the last name, and it cannot be empty!", props.addMessage);
	}
	else {
	    console.log("Something that shouldn't happen, happened!");
	}
	
    }

    const submitData = (userObj) => {
	sitooApi.addUsers([userObj]).then(response => {

	    if (response.status >= 200 && response.status < 300) {
		if (response.text[0].statuscode >= 200 && response.text[0].statuscode < 300) {
		    helper.showSuccess("User added!", props.addMessage);
		    props.handleDataloading();
		    props.closeHandle();
		}
		else {
		    helper.showAlert("Could not add user. " + response.text[0].errortext, props.addMessage);
		}
		
	    }
	    else {
		helper.showAlert(response.status + " - " + response.text + " (Are you connected to the Internet?)", props.addMessage);
	    }
	}).catch(err => {
	    helper.showAlert("Could not add user. (Are you connected to the Internet?)", props.addMessage);
	    console.error(err);
	    props.handleDataloading();
	    props.closeHandle();
	});
	
    }

    /* =================================================================== */

    return(
	<helper.popupForm title='Add User' content={form()} closeHandle={props.closeHandle} outerProps={props} />
    );      
}

export default addUser;
