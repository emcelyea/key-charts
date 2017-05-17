//const immutable variable
const name = 'tom';

//let local scope variable
var counter = 5;
for (let i = 0; i < 10; i++) {
	let counter = i;
}
console.log(counter);

//block scoping function definitions
{
	function x() {
		console.log(10);
	};
	x();
	{
		function x() {
			console.log(20);
		};
		x();
	}
}
x();

//closure syntax
var nums = [1, 3, 5, 7].map(n => n + 1);
console.log(nums);

//lexical this
var Car = function () {
	this.sizes = [2, 3, 4, 5];
	this.increment = function () {
		this.sizes = this.sizes.map(v => v + 1);
	};
};
var it = new Car();
console.log(it.sizes);
it.increment();
console.log(it.sizes);

//default parameters
function defaults(x, y = 5) {
	console.log(x + y);
}
defaults(2);
defaults(2, 8);

//extended parameter handling
function params(x, y, ...z) {
	console.log(z);
}
params(1, 2, 4, 5, 6);

//spread operator concat array stuff
var arr1 = [3, 4, 5];
var arr2 = [1, 2, ...arr1];
console.log(arr2);

//string interpolation, syntax for string catenation
var customer = { name: 'tim' };
var message = 'Hey ${customer.name}';
console.log(message);

//easy property assignment
var lastName = "tim";
var obj = { lastName };
console.log(obj.lastName);