
var React = require("react");
var $ = require("jquery");

module.exports = React.createClass({

	getInitialState: function() {
		$.ajax({
			url: "http://pappagorg.radiorevolt.no/v1/programmer/list",
			success: function(result) {
				// console.log(result);
				this.setState({
					shows: result
				});
			}.bind(this)
		});
		return {
			selected: "",
			shows: []
		}
	},

	changeShow: function(e) {
		this.setState({
			selected: e.target.value
		});
		console.log("Switched to " + e.target.value);
		this.props.setShow(e.target.value);
		// console.log(e.target.key);
	},

	render: function() {
		return (
			<select onChange={this.changeShow} value={this.state.selected}>
				{
					this.state.shows.map(function(data) {
						return (
							<option value={data.name} key={data.id}>{data.name}</option>
						)
					})
				}
			</select>
		);
	}
});
