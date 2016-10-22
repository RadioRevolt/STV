
var React = require("react");

module.exports = React.createClass({
	chooseThis: function(e) {
		e.preventDefault();
		this.props.callback(this.props.show);
	},

	getNiceNumber: function(num) {
		if (num < 10)
			return "0" + num;
		return num
	},

	clickLol:function() {
		console.log("LOLASKIS");
	},

	render: function() {
		// console.log(this.props.show.id);
		var startTime = new Date(this.props.show.starttime);
		var endtime = new Date(this.props.show.endtime);
		return (
			<tr onClick={this.chooseThis} style={{cursor: "pointer"}} className={this.props.selected}>
				<td>{this.props.show.title}</td>
				<td>{this.getNiceNumber(startTime.getHours())}:{this.getNiceNumber(startTime.getMinutes())} - {this.getNiceNumber(endtime.getHours())}:{this.getNiceNumber(endtime.getMinutes())}</td>
			</tr>
		);
	}
});
