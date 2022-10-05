import React, { Component } from 'react';
import { MyFooter } from './common/Footer/MyFooter';
import { MyNavbar } from './common/NavBar/MyNavbar';
import { LandingPage } from './landingPage/LandingPage';
import { SalesHistory } from './HistoryPage/SalesHistory';
import { ShoppingHistory } from './HistoryPage/ShoppingHistory';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreationCard } from './CreationProductService/CreationCard';
import { Registration } from './RegistrationPage/Registration';
import { ProductServiceGallery } from './productServiceGallery/ProductServiceGallery';
import { Profile } from './profilePage/Profile2';
import { ENV } from './env';
import { Map } from './map/Map';

toast.configure();

function App(): JSX.Element {
    return (
        <Router>
            <div>
                <ToastContainer />
                <MyNavbar
                    items={[
                        { name: 'Home', link: new URL(`${ENV.SITE_URL}`) },
                        { name: 'Products', link: new URL(`${ENV.SITE_URL}/productsGallery`), onlyLogged: true },
                        {
                            name: 'New Product',
                            link: new URL(`${ENV.SITE_URL}/productCreation`),
                            onlyLogged: true,
                        },
                        { name: 'About', link: new URL(`${ENV.SITE_URL}#about`) },
                        { name: 'Map', link: new URL(`${ENV.SITE_URL}/map`) },
                        { name: 'FAQ', link: new URL(`${ENV.SITE_URL}#frequently-question`) },
                    ]}
                />
                <Switch>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                    <Route exact path="/shopping">
                        <ShoppingHistory />
                    </Route>
                    <Route exact path="/sales">
                        <SalesHistory />
                    </Route>
                    <Route path="/registration">{/* registration */}</Route>
                    <Route path="/productCreation">
                        <CreationCard siteAbsoluteUrl={new URL(ENV.SITE_URL)} />
                    </Route>
                    <Route path="/productsGallery">
                        <ProductServiceGallery />
                    </Route>
                    <Route path="/map">
                        <Map />  
                    </Route>
                    <Route path="/myProfile">
                        <Profile />
                    </Route>
                </Switch>
                <MyFooter />
            </div>
        </Router>
    );
}

export default App;
