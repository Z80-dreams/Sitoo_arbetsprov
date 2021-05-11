/* 
   This is the javascript file for the index page.
   Here I fill add one class for the main page. Other stuff will go in separate
   files and will be imported. 
   I don't want to use classes for these sub-elements, as I 
   want the main page-class to handle the state of the app. 
   The other components should be state-less. 
   I will also try to write code for immutable date, and then only change 
   the data through the API.
*/
import React, { Component, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'; 
import logo from './site-logo.svg';
import './main-style.css';
import * as helper from './helper_functions/guiComponents.js';

// Installed modules that lives in other files.
const Users = lazy (() => import('./pos_modules/usersmodule.js'));
const Vendors = lazy (() => import('./pos_modules/vendorsmodule.js'));
const Products = lazy (() => import('./pos_modules/productsmodule.js'));


/* 
   This class renders the main wisdow. It also keeps track of which modules are installed and which one is loaded.
   To install more modules into the POS-system, just add them in the "installedModules"-array. The name-property
   is what will be seen in the main navbar, the module-property should be the name of the class in which the module
   lives. Don't forget to import the modules above as well!
*/
class Window extends React.Component {
    constructor(props) {
	super(props); 
	
	this.state = {
	    installedModules: [{
		name: 'Users',
		module: <Users />,
	    },{
		name: 'Products',
		module: <Products />,
	    },{
		name: 'Manufacturers',
		module: <Vendors />,
	    }],

	    loadedModule: 0,
	    
	};
    }


    /*
      Here I just run some things that are supposed to run one time and one time only, after render is done. This is mainly to make navbar look nicer.
      JQuery is super handy for doing these kind of things really quickly!
    */
    componentDidMount() {
	$('#navButton' + this.state.loadedModule).addClass('selected');
    }

    render() {
	let mainContent = [this.state.installedModules[this.state.loadedModule].module];
	return(
	    <div className='app-window'>
		<div className="topstuff">
		    <header className='app-header'>
			<img src={logo} alt='site logo' className='app-logo'/>
		    </header>
		    {this.NavBuilder()}
		</div>
		<main>
		    <Suspense fallback={<div>Loading...</div>}>
			{this.state.installedModules[this.state.loadedModule].module}
		    </Suspense>
		</main>
	    </div>
	); 
    }

    
    /*
      This method builds the nav-bar, based on installed modules. Just add another module and it will appear in the navbar!
      Side note: I REALLY love the .map()-function. I use it a lot when programming in Lisp as well. 
    */
    NavBuilder() {
	return(
	    <nav className='main-navbar'>
		<ul className='main-navbar'>    
		    {this.state.installedModules.map((navObj, i) => {
			return(
			    <li key={i} className='main-navbar'>
				<button id={'navButton' + i} className='main-navbar' onClick={() => {this.setState({loadedModule: i});
												     $('button.main-navbar').removeClass('selected');
												     $('#navButton' + i).addClass('selected');}}>
				    {navObj.name}
				</button>
			    </li>)
		    })}
		</ul>
	    </nav>
	)
    }

    
    
    

}



// ========================================

ReactDOM.render(<Window />, document.getElementById("root"));
