/*
  This library helps with showing errors, showing success, etc.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './popupStyle.css'

export {popupForm, showError, showSuccess};

const popupForm = (props) => {
    return(
	<div className='shadowBox'>
	    <div className='popupBox'>
		<button className='closeButton' onClick={props.closeHandle}>Close</button>
		<h2>{props.title}</h2>
		    <p>{props.content}</p>
	    </div>
	</div>
	
    )
    
    
}

const showError = (props) => {}

const showSuccess = (props) => {}
