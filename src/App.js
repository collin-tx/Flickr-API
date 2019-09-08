import React, { Component } from 'react';
import './App.css';


export default class App extends Component {
	state = {
		websiteName: 'Flicker API',
		photos: [],
		value: ''
	};

	componentDidMount() {
		if (window.navigator.geolocation) {
			let lon = '';
			let lat = '';
			window.navigator.geolocation.getCurrentPosition((position) => {
				lon = position.coords.longitude;
				lat = position.coords.latitude;
				this.setState({
					lon,
					lat
				})
				this.getPhotos(lon, lat);
			});
		} else {
			console.log('Sorry, the browser does not support geolocation');
		}
	}

	getPhotos = (lon, lat) => {
		const tags = this.state.value || 'landscape'
		const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3ead4128b673c88c60d252edbd81e409&extras=url_n&tags=${tags}&format=json&nojsoncallback=1&lat=${lat}&lon=${lon}&radius=5&per_page=30`;
		fetch(url)
			.then(response => {
				return response.json()
			}).then(data => {
				this.setState({ photos: data.photos.photo})
			})
	}

	handleChange = (e) => {
		this.setState({ 
			value: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.getPhotos(this.state.lon, this.state.lat);
		this.setState({
			value: ''
		})
	}

	displayInfo = (e) => {
		e.target.parentElement.classList.add('hide');
	}

	render() {
		const allPhotos = this.state.photos.map((photo, index) => {
			return (
				<div className="card p-3 m-3 col-md-3" key={photo.id}>
					<img src={photo.url_n} onClick={this.displayInfo} alt="from Flickr" />
				</div>
			)
		})
		return (
			<main className="p-5">
				<h1 className="text-light">{this.state.websiteName}</h1>
				<form onSubmit={this.handleSubmit}>
					<input onChange={this.handleChange} type='text' value={this.state.value} placeholder="search your area..." className="" />
					<button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
				</form>
				<p>(Click on a photo to remove it)</p>
				<div className="row justify-content-md-center">{allPhotos}</div>
			</main>
		);
	}
}
