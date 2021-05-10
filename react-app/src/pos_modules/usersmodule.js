/*
  This module handles users that can log in to the pos system. It can add, update and delete users. 
*/

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// Home made helper libraries
import * as helper from './../helper_functions/guiComponents.js';
import * as sitooApi from './../helper_functions/sitooLib.js';
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
	    loadedFunction: 0,
	    isPopup: false,
	    users: [],
	    userscount: 0, //0 until the load function run. That will get the "totalcount" from API, and compare to length of users array.
	    dataLoaded: false,
	    entriesPerPage: 10,
	    currentPage: 1,
	    numberOfPages: 14,

	};

    }


    componentDidMount() {
	// Trying to fetch users. Starging at 100, and increasing if it's not enough.
	let startvalue = 100;
	this.loadUsersIntoState(startvalue);
	
	// This is to select the first button on startup.
	this.changePage(1);
	

	
    }


    render() {
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
		    <table className="usersTable">
			<thead className="usersTable">
			    <tr className="usersTable">
				<th className="usersTable"><form><input type="checkbox" value={this.state.allSelected} onChange={() => console.log("You clicked a checkbox!")} /></form></th>
				<th className="usersTable">Name</th>
				<th className="usersTable">Email</th>
				<th className="usersTable">Date Created</th>
				<th className="usersTable"></th>
				<th className="usersTable">Date Modified</th>
				<th className="usersTable"></th>
			    </tr>
			</thead>
			<UserRows currentPage={this.state.currentPage} users={this.state.users} perPage={this.state.entriesPerPage} />
			
		    </table>
		    <TableScrollButtons numOfPages={this.state.numberOfPages} currentPage={this.state.currentPage} callbackFunc={this.changePage} />
		    <FuncButtons functions={this.state.installedFuncs} />
		</>
		
		
	    );
	    
	}
	else {
	    return (
		<strong>Loading...</strong>
	    );
	}
    }
    // This functions toggles the popup 
    togglePopup = () => {
	this.setState(previousState => ({isPopup: !previousState.isPopup}));	
    }

    // This function changes the page currently viewed in the table. Number of pages is based on how many entries exists, and how many fit in one page.
    changePage = (p) => {
	if (p<0) {
	    this.setState({currentPage: 1});
	    $(".tableScrollButtons").removeClass('selected');
	    $(".tableScrollButtons.1").addClass('selected');
	}
	else if (p>this.state.numberOfPages) {
	    this.setState({currentPage: this.state.numberOfPages});
	    $(".tableScrollButtons").removeClass('selected');
	    $(".tableScrollButtons." + this.state.numberOfPages).addClass('selected');
	}
	else {
	    this.setState({currentPage: p});
	    console.log('P is: ' + p);
	    $(".tableScrollButtons").removeClass('selected');
	    $(".tableScrollButtons." + p).addClass('selected');
	}
    }

    // This function calls the sitoo API lib that I wrote, and tries to load all users into state.
    // If the number of entries differ from the recived array, it tries again recursively. 
    loadUsersIntoState = (num) => {
	sitooApi.getUsers(num).then(data => {if (data.status >= 200 && data.status < 300) {
	    this.setState({dataLoaded: true,
			   users: data.text.items,
			   userscount: data.text.totalcount});
	}}).then(() => {
	    if (this.state.users.length !== this.state.userscount) {
		this.loadUsersIntoState(this.state.userscount); // Fetching exactly as many users as we need!
	    } else {
		return;
	    }});
    }

}

function UserRows(props) {
    let startAt = props.currentPage * props.perPage;
    let endBefore = startAt + props.perPage;
    let subTable = props.users.slice(startAt, endBefore);


    return(<tbody>
	       {subTable.map((userObj) => {
		   <tr>
		       <td><form><input type="checkbox" /></form></td>
		       <td>{userObj.namefirst + " " + userObj.namelast}</td>
		       <td>{userObj.email}</td>
		       <td>{(userObj) => {let date = new Date(userObj.datecreated*1000);
					  let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
					  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
					 }}
		       </td>
		       
		       <td>{(userObj) => {let date = new Date(userObj.datecreated*1000); 
					  return date.getHours() + ":" + date.getMinutes();
					 }}
		       </td>
		       
		       <td>{(userObj) => {let date = new Date(userObj.datemodified*1000);
					  let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
					  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
					 }}
		       </td>
		       
		       <td>{(userObj) => {let date = new Date(userObj.datemodified*1000); 
					  return date.getHours() + ":" + date.getMinutes();
					 }}
		       </td>
		   </tr>
	       })}
	   </tbody>
	  ); 
}

// This function generates the "toolbox" at the bottom.
function FuncButtons(props) {
    return(<div className="installedFunctions">
	       <ul className="installedFunctions">
		   {props.functions.map((buttonObject, i) => {
		       return(
			   <li key={i} className="installedFunctions">
			       <button className={"installedFunctions " + buttonObject.buttonColor} onClick={() => buttonObject.funcName}>{buttonObject.buttonName}</button>
			   </li>
		       )})}
	       </ul>
	   </div>);
    
}

// This function generates the buttons to select another page.
function TableScrollButtons(props) {
    let a = Array(props.numOfPages).fill(0);
    return(
	<div className="tableScrollButtons">
	    <ul className="tableScrollButtons">
		<li key="left" className="tableScrollButtons left"><button className="tableScrollButtons left" onClick={() => props.callbackFunc(props.currentPage-1)}>&lt;&lt;</button></li>
		{a.map((a, i) => {return(
		    <li key={i+1}className={"tableScrollButtons " + (i + 1)}><button className={"tableScrollButtons " + (i + 1)} onClick={() => props.callbackFunc(i+1)}>{i+1}</button></li>)})}
		<li key={"right"} className="tableScrollButtons right"><button className="tableScrollButtons right" onClick={() => props.callbackFunc(props.currentPage+1)}>&gt;&gt;</button></li>
		
	    </ul>
	    
	</div>
    );

}

function addUser() {}

function editUser() {}

function deleteUsers() {}

