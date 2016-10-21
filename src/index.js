
var React = require("react");
var ReactDOM = require("react-dom");

var NewShow = require("./pages/showTemplate.js");


var App = React.createClass({
	render: function() {
		return (
			<div>
				<NewShow />
			</div>
		);
	}
});


ReactDOM.render(
	<App />,
	document.getElementById("application")
);
