import React,{useEffect, useState} from "react";
import { FormControl, MenuItem, Select,Card,CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from "./Table";
import {sortData} from "./util";
import Linegraph from "./LineGraph"; 
import "leaflet/dist/leaflet.css";


export default function App() {
  const[countries, setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[CountryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]= 
  useState({lat:34.80746,lng:-40.4796});
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[ casesType,setCasesType]=useState("cases");
 
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
           
          }));

const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);
    const onCountryChange = async(e)=>{ 
      const countryCode = e.target.value;

      const url = countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setCountry(countryCode);
          setCountryInfo(data);

          setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
         setMapZoom(4);
        });
    };
  
  
   
  return ( 
    <div className="app">
      <div className="app__left">
       <div className ="app__header">
      <h1> COVID-19 TRACKER</h1>  
    <FormControl className="app__dropdown"> 
     <Select variant= "outlined" onChange={onCountryChange} value={country}>
      < MenuItem value= "worldwide" >Worldwide </MenuItem>
      {
          countries.map(country=>(
            <MenuItem value= {country.value}>{country.name}</MenuItem>
          ))
  }
     </Select>
        
    </FormControl>
     </div>
          
          

    <div className="app__stats">
      <InfoBox
isRed
       active={casesType=="cases"}
      onClick={e=>setCasesType("cases")}
      title="Coronavirus cases" 
      cases={CountryInfo.todayCases} 
      total={(CountryInfo.cases)}/>

      <InfoBox 

      active={casesType=="recovered"}
      onClick={e=>setCasesType("recovered")}
      title="Recovered " 
      cases={(CountryInfo.todayRecovered)} 
      total={(CountryInfo.recovered)} />

      <InfoBox 
      isRed
      active={casesType=="deaths"}
      onClick={e=>setCasesType("deaths")}
      title="Deaths" 
      cases={(CountryInfo.todayDeaths)} 
      total={(CountryInfo.deaths)}/>
      </div>
   
   
    <Map casesType={casesType}
    countries={mapCountries}
    center={mapCenter}
    zoom={mapZoom}
    />   
    </div> 
    
    
 <Card className="app__right">
   <CardContent>
     <h3>Live Cases By Country</h3>
      <Table countries={tableData}/>
   
           <h3 className="app__graphtitle">Worldwide new {casesType}</h3>
    <Linegraph className="app__graph" casesType={casesType}/>   
    
  
    </CardContent>
  </Card> 
  </div>
  
          );
          
}
