/*
  This library helps with showing errors, showing success, etc.
*/

import React from 'react';


import './popupStyle.css'

export {popupForm, showAlert, showSuccess, Messages};

const popupForm = (props) => {
    return(
	<div className='shadowBox hidden'>
	    <div className='popupBox'>
		<button className='closeButton' onClick={props.closeHandle}>Close</button>
		<h2 className='popupBox'>{props.title}</h2>
		<div className='popupBox content'>{props.content}</div>
	    </div>
	</div>
	
    )
    
    
}

const showAlert = (text, messageStackUpdater) => {
    messageStackUpdater({messageType: 'alert',
		       premessage: 'Warning! ',
		       messageContent: text});
}

const showSuccess = (text, messageStackUpdater) => {
    messageStackUpdater({messageType: 'success',
		       premessage: 'Note! ',
		       messageContent: text});
}


const Messages = (props) => {
    
    if (props.messages.length > 0) {
	
	return(<div className='messages'>
		   {props.messages.map((messageObj, i) => {
		       return(
			   <div key={i} className={'messageBox ' + messageObj.messageType}>
			       
			       <span className='messageBox'><strong>{messageObj.premessage}</strong>{messageObj.messageContent}</span>
			       <button className='messageCloseButton' onClick={() => props.removeMsg(i)}>&times;</button>
			   </div>);
		   })}
	       </div>

	      );
    } else {
	return("");
    }
}
