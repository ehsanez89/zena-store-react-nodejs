import React, { Component } from 'react';
import '../assets/css/style.css';
import '../assets/css/owl-carousel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/flex-slider.css';
import { motion } from 'framer-motion';
import { pageAnimation, fade, titleAnim, slider, sliderContainer } from '../animation';
import GoogleMapReact from 'google-map-react';
import Marker from 'google-map-react';

export interface IMap {}

export interface IMap {
    products: IMap[];
}



const defaultProps = {
    center: {
        lat: 45.764288, lng: 21.209806
    },
    zoom: 11
  };
  const AnyReactComponent = ({ text }) => (
  <div style={{
    color: 'white', 
    background: 'grey',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {text}
  </div>
);
export class Map extends Component {



    public render() {
        return (
    
            <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "" }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <Marker position={{ lat: 45.764288, lng: 21.209806 }} />
            </GoogleMapReact>
          </div>

        );
    }
}
