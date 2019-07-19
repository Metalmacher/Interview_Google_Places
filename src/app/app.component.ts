import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import {restaurants} from '../data/restaurants'

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  googleMapsJs: any;

  autocomplete: any;
  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
  
  place: any; //the place that was clicked from the autocomplete form
  
  places: Array<any> = [];

  @ViewChild('autoInp') input: ElementRef;

  constructor(private zone: NgZone){

  }
  ngAfterViewInit() {
    this.googleMapsJs = google;
    
    this.autocomplete = new this.googleMapsJs.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(this.input.nativeElement),
      { types: ['geocode'] });
    
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', () => {this.fillInAddress(); });
  }

  fillInAddress() {
    this.place = this.autocomplete.getPlace();
    this.zone.run(() => { });
  }

  geolocate(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  GetLocations(){
    let fromLat = this.place.geometry.location.lat();
    let fromLng = this.place.geometry.location.lng();
    let from = new this.googleMapsJs.maps.LatLng(fromLat,fromLng);
  
    this.places = [];
    restaurants.forEach(brand => {
      brand.places.forEach(restaurantPlace => {
        let to = new this.googleMapsJs.maps.LatLng(restaurantPlace.lat,restaurantPlace.lng);
        let dist = this.googleMapsJs.maps.geometry.spherical.computeDistanceBetween(from, to);
        if(dist <= 50000)
        this.places.push({
          "brand": brand.name,
          "lat": restaurantPlace.lat,
          "lng": restaurantPlace.lng,
          "dist":  dist
        });
      });
      this.places.sort((a: any, b: any)=>{
        return a.dist - b.dist;
      });
      
      this.zone.run(() => { });
    });
  }
}
