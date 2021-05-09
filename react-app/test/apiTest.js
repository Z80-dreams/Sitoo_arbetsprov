/* File for doing testing */

const prompt = require('prompt');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const sitooLib = require('../src/helper_functions/sitooLib.js');

prompt.start();


const apiTestingFacility = () => {
clear();
console.log(chalk.yellow(figlet.textSync("API Testing Facility", {font: 'Big'})));
console.log("\
What to you want to test?\n \
1. Get all users\n \
2. Get one user\n \
3. Update user\n \
4. Update two users\n \
5. Create new user\n \
6. Delete user\n \
X. Exit API Testing Facility\n");

readline.question("Action ==> ", result => {switch(result.toUpperCase()) {case '1':
									  sitooLib.getUsers().then(console.log);
									  readline.close();
									  break;
									  case '2':
									  sitooLib.getUser("{102B43C1-476C-7A5E-7F1F-2A8A69E5AF98}").then(console.log);
									  readline.close();
									  break;
									  case '3':
									  console.log('Updating name to Foo.');
									  sitooLib.updateUser("{102B43C1-476C-7A5E-7F1F-2A8A69E5AF98}", {'namefirst': 'Foo'}).then(console.log);
									  readline.close();
									  break;
									  case '4':
									  console.log('Updating name to Bar and Baz.');
									  sitooLib.updateUsers([{'userid': '{102B43C1-476C-7A5E-7F1F-2A8A69E5AF98}', 'namefirst': 'Bar'},
												{'userid': '{11A0594F-1C36-5195-48CD-5953CCE73B74}', 'namefirst': 'Baz'}]).then(console.log);
									  readline.close();
									  break;
									  case '5':
									  console.log('Creating user John McCarthy');
									  sitooLib.addUsers([{'namefirst': 'John',
											     'namelast': 'McCarthy',
											      'email': 'before.email@existed.com'}]).then(console.log);
									  readline.close();
									  break;
									  case '6':
									  console.log('Deleting user!')
									  sitooLib.deleteUser('{334DE9D2-5890-39CA-762F-78A64AAB6182}').then(console.log);
									  readline.close();
									  break;
									  case 'X':
									  console.log("\nGood bye!\n");
									  readline.close();
									  break;
									  default:
									  console.log("That's not a valid selection. Exiting.");
									  readline.close();
									  break;
									 }});
};


apiTestingFacility();





