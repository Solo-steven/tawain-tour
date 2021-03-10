import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './../asset/layout.css';

import Sidebar from './Sidebar'
import Window  from './Window'
import fetchData from '../pure function/fetch'

const purpose   = ['ScenicSpot', 'Hotel' , 'Restaurant'];
const city_Name = ['',  'Taipei','NewTaipei', 'Taoyuan', 'Taichung', 'Tainan',
             'Kaohsiung',  'Keelung','Hsinchu','HsinchuCounty','MiaoliCounty',
             'ChanghuaCounty','NantouCounty','YunlinCounty','ChiayiCounty',
             'Chiayi', 'PingtungCounty','YilanCounty','HualienCounty',
             'TaitungCounty','KinmenCounty','PenghuCounty','LienchiangCounty'];

export default class Container extends React.Component{
    constructor(props){
        super(props);
        this.state={
            city : city_Name.map(city => {return {
                    name : city,
                    ScenicSpot : [],
                    ScenicSpot_isEnd : false,
                    Hotel : [],
                    Hotel_isEnd : false,
                    Restaurant : [],
                    Restaurant_isEnd :false, 
                }
            }),
            window_Count : 0
        }
        this.reachBottom     = this.reachBottom.bind(this);
        this.flipCityPage    = this.flipCityPage.bind(this);
    }
    componentDidMount(){
        console.log('Init : container mount. ');
    }
    componentDidUpdate(){
        console.log('container update finish .');
    }
    async flipCityPage(purpose , city_Name){
        if(purpose === undefined)
            return;
        let target_city , data;
        for(let single_city of this.state.city){
            if(single_city.name === city_Name){
                target_city = single_city;
                break;
            }
        }
        if(target_city[purpose].length === 0){
            data = await fetchData(purpose, city_Name, 0);
            this.setState({
                window_Count : 0,
                city : this.state.city.map(city =>{
                    if(city.name === city_Name){
                        city[purpose].push(data);
                        return  city
                    }
                    return city;
                })
            });
            console.log("flip tp new city - fetch data first time.", data);
            return;
        }
        this.setState({
            window_Count : 0,
        });
        console.log("flip tp new city - reset count.");
        return
    }
    async reachBottom(purpose, city_Name ){
        if(purpose === undefined)
            return;
        for(let city of this.state.city){
            if(city.name === city_Name){
                if(city[purpose].length-1 >= this.state.window_Count+1){
                    this.setState({
                        window_Count : this.state.window_Count+1
                    });
                    console.log('reach to buttom - city data array is lenght enough.');
                    return
                }
                if(!(city[`${purpose}_isEnd`])){
                    let data = await fetchData(purpose, city_Name ,this.state.window_Count+1);
                    if(data.length ===0){
                        this.setState({
                            city : this.state.city.map(city =>{
                                if(city.name === city_Name){
                                    city[`${purpose}_isEnd`] = true;
                                    return  city
                                }
                                return city;
                            }),
                        })
                        console.log('reach to bottom - no data can fetch.');
                        return;
                    }
                    this.setState({
                        city : this.state.city.map(city =>{
                            if(city.name === city_Name){
                                city[purpose].push(data);
                                return  city
                            }
                            return city;
                        }),
                        window_Count : this.state.window_Count+1
                    })
                    console.log('reach to bottom - city get new data .' ,data)
                    return;
                }
                console.log('reach to bottom - city data array is fill .');
                return;
            }    
        }
    }
    render(){
        console.log('container render');
        return(
            <BrowserRouter>
                <div className='layout-container'>
                    <div className='layout-sidebar'>
                        <Sidebar city_Name={city_Name} purpose={purpose}/>
                    </div>
                    <div className='layout-widnow'>
                        <Route exact path='/:purpose?/:city?' 
                               render= {(props)=>{
                                    return <Window 
                                                purpose ={props.match.params.purpose}
                                                count ={this.state.window_Count}
                                                emitSignal_flipCityPage  = {this.flipCityPage}
                                                emitSignal_reachBottom    = {this.reachBottom}
                                                city = {this.state.city.filter(city => city.name === (!(props.match.params.city) ? '' :props.match.params.city ))[0]}
                                            />
                                    }}
                            />   
                    </div>
                </div>
            </BrowserRouter>    
        )
    }
}