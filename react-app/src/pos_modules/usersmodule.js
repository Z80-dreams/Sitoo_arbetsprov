/*
  This module handles users that can log in to the pos system. It can add, update and delete users. 
  Inside class Users the render method, componentDidMount method and componentDidUpdate method
  Is declared using normal function declarations, as they are already part of React.component.
  The other methods are declared using function expressions instead of function declaration, 
  Due to JavaScript delayd execution, the methods expressed in this way aren't loaded into memory
  until they are needed, and thus lowers the overall memory usage. 
*/

import React from 'react';
import $ from 'jquery';

// Home made helper libraries
import * as helper from './../helper_functions/guiComponents.js';
import * as sitooApi from './../helper_functions/sitooLib.js';
import addUser from './addUser.js';
import editUser from './editUser.js';
import deleteUsers from './deleteUsers.js';
import './userStyle.css';

export default class Users extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    installedFuncs: [{buttonName: 'Add User',
			      funcName: addUser,
			      buttonColor: 'blue',},
			     {buttonName: 'Edit Selected',
			      funcName: editUser,
			      buttonColor: 'blue',},
			     {buttonName: 'Delete Selected',
			      funcName: deleteUsers,
			      buttonColor: 'red',}], // Make sure functions exists below, outside of Class. 
	    loadedFunction: 0, // 0 means none loaded.
	    users: [],
	    userscount: 100, // 100 until the load function run. That will get the "totalcount" from API, and compare to length of users array. 
	    dataLoaded: false,
	    currentPage: 1,
	    numberOfPages: 1, // Set to 1 initially, then change state once all entries has been loaded from the API, and the actual length is known.
	    usersPerPage: 1,
	    checkedUsers: [],
	    messageStack: [],
	    initMessage: 'Loading users from remote source.',


	    
	    // renderTime: [new Date], // This state is only used in testing, when we want to know render times. 

	};

	// uncomment for testing performance.
	// this.state.renderTime.push(new Date);

    }


    componentDidMount() {	
	// This is to select the first button on startup.
	this.changePage(1);

	
    }

    componentDidUpdate() {
	//  Doing some JQuery stuff once the page has rendered. This is to highlight the currently selected page.
	$(document).ready(() => {
	    $('button.tableScrollButtons').removeClass('selected');
	    $('button.tableScrollButtons.' + this.state.currentPage).addClass('selected');
	});
	
	// Run function to calculate number of pages needed.
	this.checkNumberOfPages();

	// If we notice that data loaded-flag is set to false, we try to reload the last known users count.
	if(!this.state.dataLoaded) {
	    this.setState({dataLoaded: true});
	    this.loadUsersIntoState(this.state.userscount);
	    
	}

	
	// Uncomment below to get data about rendering times. Don't forget to uncomment array renderTime in state. 
	// this.state.renderTime.push(new Date);
	// console.log("Rendering took " + (this.state.renderTime[this.state.renderTime.length-1] - this.state.renderTime[this.state.renderTime.length-2]) + " milliseconds.");
	// console.log("Total time spend is " + (this.state.renderTime[this.state.renderTime.length-1] - this.state.renderTime[0]) + " milliseconds.");

    }

    /*************************************************************************
     *                                                                       *
     *         RENDER FUNCTION STARTS HERE...                                *
     *                                                                       *
     *************************************************************************/

    render() {
	// Used to know where to start and end the table.
	let startAtIndex = (this.state.currentPage - 1) * this.state.usersPerPage;
	let endBeforeIndex = startAtIndex + this.state.usersPerPage;
	
	if (this.state.dataLoaded) {
	    
	    
	    return(
		/*  <div className='test-div-users'>
		    Foo Users!
		    <p>
		    <button onClick={this.togglePopup}>Open Popup</button>
		    Popup is {String(this.state.isPopup)}
		    
		    </p>
		    {this.state.isPopup && <helper.popupForm title='This is a title' content='This is content' closeHandle={this.togglePopup} />}
		    </div> */
		<>
		    <table className="usersTable" border="0">
			<thead className="usersTable">
			    <tr key="head "className="usersTable">
				<th className="usersTable checkbox"></th>
				<th className="usersTable name">Name</th>
				<th className="usersTable email">Email</th>
				<th className="usersTable date">Date Created</th>
				<th className="usersTable time"></th>
				<th className="usersTable date">Date Modified</th>
				<th className="usersTable time"></th>
			    </tr>
			</thead>
			<UserRows currentPage={this.state.currentPage} users={this.state.users.slice(startAtIndex, endBeforeIndex)} checkboxCallback={this.handleCheckbox} checked={this.state.checkedUsers} />
			
		    </table>
		    <div className="bottomstuff">
			<TableScrollButtons numberOfPages={this.state.numberOfPages} currentPage={this.state.currentPage} callbackFunc={this.changePage} />
			<FuncButtons functions={this.state.installedFuncs} openHandle={(i) => {
					 this.setState({loadedFunction: i})}} />
		    </div>
		    <InstalledPopups functions={this.state.installedFuncs} loadedFunction={this.state.loadedFunction} closeHandle={() => {this.setState({loadedFunction: 0})}} users={this.state.users} checkedUsers={this.state.checkedUsers} handleDataloading={() => {this.setState({dataLoaded: false})}} addMessage={this.addMsg} />
		    <helper.Messages messages={this.state.messageStack} removeMsg={this.removeMsg} />
		    
		</>	
	    );
	    
	}
	else {
	    return (
		<>
		    <strong>{this.state.initMessage}</strong>
		</>
	    );
	}
    }

    /*************************************************************************
     *                                                                       *
     *         RENDER FUNCTION ENDS HERE...                                  *
     *                                                                       *
     *         NOW STARTS METHODS FOR HANDLING THE TABLE OF USERS...         *
     *                                                                       *
     *************************************************************************/

    checkNumberOfPages = () => {
	// Checking if the number of rows that fits in one page of the table has changed since last render.
	let windowHeight = ($(window).innerHeight() || 500);
	let rowHeight = ($('td.usersTable').first().outerHeight(true) || 27);
	let tableHeaderHeight = ($('th.usersTable').first().outerHeight(true) || 25);
	let toolboxHeight = ($('div.installedFunctions').first().outerHeight(true) || 50);
	let scrollButtonsHeight = ($('div.tableScrollButtons').first().outerHeight(true) || 50);
	let headerHeight = ($('header').first().outerHeight(true) || 50);
	let menuHeight = ($('nav').first().outerHeight(true) || 50);
	
	//Calculating how much space I have, how many rows fit in one page, and how many pages are needed.
	let mainHeight = windowHeight - headerHeight - menuHeight;
	// Set main tag to available space.
	if (mainHeight > 0) {
	    $('main').height(mainHeight);
	}
	// Calcualte available Space
	let availableHeight = mainHeight - scrollButtonsHeight - toolboxHeight - tableHeaderHeight;
	let numRows = Math.floor(availableHeight / rowHeight) - 1;
        // Make sure we don't get negative or 0 number of rows. We don't want division by 0.
	if (numRows < 0) 
	    numRows = 1;
	
	let numPages = Math.floor(this.state.users.length / numRows) + 1;

	// Make sure we get at least one. 
	if (numPages < 1)
	    numPages = 1;



	/* 
	   If numPages matches the current state, setState is not called. This lowers the render-cycles.
	   Without this if statement we would end up with an infinite loop of renders, as render() is automatically
	   called when satate changes, and componentDidUpdate()-hook is called after each render-cycle. 
	   I only need to check numPages, as usersPerPage will update that variable as well. In testing about 5 render cycles
	   are needed before all properties are set correctly. Each render cycle takes around 200 ms in testing. 
	*/
	if (numPages !== this.state.numberOfPages)
	    this.setState({numberOfPages: numPages,
			   usersPerPage: numRows,
			  });
    }

    // This function changes the page currently viewed in the table. Number of pages is based on how many entries exists, and how many fit in one page.
    changePage = (p) => {
	if (p<1) {
	    this.setState({currentPage: 1});
	}
	else if (p>this.state.numberOfPages) {
	    this.setState({currentPage: this.state.numberOfPages});
	}
	else {
	    this.setState({currentPage: p});
	}
    }

    // This function handles the checkboxes
    handleCheckbox = (uidArray, addRemoveFlag) => {
	if(addRemoveFlag === 'add') {
	    this.setState(previousState => {
		return({checkedUsers: [...previousState.checkedUsers, ...uidArray]}); // Use spread operator
	    })
	}
	else if(addRemoveFlag === 'remove')
	{
	    this.setState(previousState => {
		// User filter with negation. If uidArray contains x, it fails and is not filtered out. If uid array does not contain x, it passes the text and is filtered out for keeping.
		return({checkedUsers: previousState.checkedUsers.filter(i => !uidArray.includes(i))}); 
	    })   
	}
    }

    /*************************************************************************
     *                                                                       *
     *         TABLE METHODS END HERE...                                     *
     *                                                                       *
     *         NOW STARTS METHODS FOR HANDLING MESSAGES...                   *
     *                                                                       *
     *************************************************************************/

    removeMsg = (index) => {
	if (this.state.messageStack.length > index && index > -1)
	{
	    this.setState(previousState => ({messageStack: previousState.messageStack.filter((message, i) => {if (i !== index) {return message} else {return false}})}));
	}
	
    }

    addMsg = (obj) => {
	this.setState((oldState) => ({messageStack: [...oldState.messageStack, obj]}))
    }
    


    /*************************************************************************
     *                                                                       *
     *         MESSAGE METHODS END HERE...                                   *
     *                                                                       *
     *         NOW STARTS METHOD FOR HANDLING DATA LOADING...                *
     *                                                                       *
     *************************************************************************/



    // This function calls the sitoo API lib that I wrote, and tries to load all users into state.
    // If the number of entries differ from the recived array, it tries again recursively. 
    loadUsersIntoState = (num) => {
	sitooApi.getUsers(num).then(data => {
	    if (data.status >= 200 && data.status < 300) {
		// I initially wanted to sort all the names in alphabetical order here, but I noticed that
		// the loading time of the page increased significant. I therefore dropped the array sort
		// in faviour of faster loading of the user table.
		
		this.setState({
		    users: data.text.items,
		    userscount: data.text.totalcount,
		});
	    }
	    else {
		helper.showAlert("Could not load users. Error " + data.status + " - " + data.text.message, this.addMsg);
	    }
	}).catch(err => {
	    helper.showAlert("Could not load users. (Are you connected to the Internet?)", this.addMsg);
	    console.error(err)
	}).then(() => {
	    if (this.state.users.length !== this.state.userscount) {
		this.loadUsersIntoState(this.state.userscount); // Fetching exactly as many users as we need!
	    } else {
		return;
	    }});
    }

}

    /*************************************************************************
     *                                                                       *
     *         CLASS USERS END HERE                                          *
     *                                                                       *
     *         NOW STARTS FUNCTIONS OUTSIDE OF CLASS DEFINITON               *
     *                                                                       *
     *         Due to JavaScript delayed execurion, I try to use function    *
     *         expressions rather than function declarations whenever I      *
     *         can, this lowers the memory usage.                            *
     *                                                                       *  
     *************************************************************************/


    /*************************************************************************
     *                                                                       *
     *         FUNCTIONS TO DRAW THE TALBE OF USERS STARTS HERE...           *
     *                                                                       *
     *************************************************************************/

const UserRows = (props) => {
    
    return(<tbody key='tablebody' className="usersTable">
	       {props.users.map((userObj) => {
		   return(
		       <UserRow key={userObj.userid} userId={userObj.userid} namefirst={userObj.namefirst} namelast={userObj.namelast} email={userObj.email} datecreated={userObj.datecreated} datemodified={userObj.datemodified} checkboxCallback={props.checkboxCallback} checked={props.checked}/>
		   )})}
	   </tbody>
	  ); 
}


const UserRow = (props) => {
    let setparameters = () => {
	if(props.checked.some(uid => {return props.userId === uid})) {
	    props.checkboxCallback([props.userId], 'remove');
	} else {
	    props.checkboxCallback([props.userId], 'add');
	}
    }

    
    return(
	<tr key={props.userId} className="usersTable">
	    <td key={props.userId + "checkbox"} className="usersTable checkbox"><form><input key={props.userId + "checkbox"} type="checkbox" checked={props.checked.some(uid => {return props.userId === uid})} onChange={setparameters} /></form></td>
	    <td key={props.userId + "name"} className="usersTable name">{props.namefirst + " " + props.namelast}</td>
	    <td key={props.userId + "email"} className="usersTable email">{props.email}</td>
	    <DateEntry keyTemplate={props.userId + "created"} date={props.datecreated} />
	    <DateEntry keyTemplate={props.userId + "modified"} date={props.datemodified} />
	</tr>
    );
}

const DateEntry = (props) => {
    let date = new Date(props.date*1000);
    let day = ('0000' + date.getFullYear()).slice(-4) + "-" + ('00' + date.getMonth()).slice(-2) + "-" + ('00' + date.getDate()).slice(-2);
    let time = ('00' + date.getHours()).slice(-2) + ":" + ('00' + date.getMinutes()).slice(-2);

    return(
	<>
	    <td key={props.keyTemplate + "day"} className="usersTable date">{day}</td>
	    <td key={props.keyTemplate + "time"} className="usersTable time">{time}</td>
	</>
    );
}

// This function generates the buttons to select another page in the table.
const TableScrollButtons = (props) => {

    let a = Array(props.numberOfPages).fill(0);
    return(
	<div className="tableScrollButtons">
	    <ul className="tableScrollButtons">
		<li key="left" className="tableScrollButtons left"><button className="tableScrollButtons left" onClick={() => props.callbackFunc(props.currentPage-1)}>&lt;&lt;</button></li>
		{a.map((a, i) => {return(
		    <li key={i+1}className={"tableScrollButtons " + (i + 1)}>
			<button className={"tableScrollButtons " + (i + 1)} onClick={() => props.callbackFunc(i+1)}>
			    {i+1}
			</button>
		    </li>)})}
		<li key={"right"} className="tableScrollButtons right"><button className="tableScrollButtons right" onClick={() => props.callbackFunc(props.currentPage+1)}>&gt;&gt;</button></li>
		
	    </ul>
	    
	</div>
    );

}

    /*************************************************************************
     *                                                                       *
     *         FUNCTIONS TO DRAW THE TALBE OF USERS ENDS HERE...             *
     *                                                                       *
     *         NOW STARTS FUNCTIONS TO HANDLE PLUGINS.                       *
     *         I.E. ADD USER, EDIT USER AND DELETE USERS.                    *
     *                                                                       *
     *************************************************************************/

// This function generates the "toolbox" at the bottom.
const FuncButtons = (props) => {
    return(<div className="installedFunctions">
	       <ul className="installedFunctions">
		   {props.functions.map((buttonObject, i) => {
		       return(
			   <li key={i} className="installedFunctions">
			       <button className={"installedFunctions " + buttonObject.buttonColor} onClick={() => props.openHandle(i+1)}>
				   {buttonObject.buttonName}
			       </button>
			   </li>
		       )})}
	       </ul>
	   </div>);
    
}

// This one makes sure that the popups appear when buttons are called. They are 1-indexed, as index 0 denote popup closed. That's why I need to check loadedFunction-1.
const InstalledPopups = (props) => {
    if (props.loadedFunction > 0) {
	return React.createElement(props.functions[props.loadedFunction-1].funcName, { users: props.users,
										       checkedUsers: props.checkedUsers,
										       closeHandle: props.closeHandle,
										       handleDataloading: props.handleDataloading,
										       addMessage: props.addMessage,}, null);
    } else {
	return "";
    }
}





