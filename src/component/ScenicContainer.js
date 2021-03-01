import React from 'react';
import axios from 'axios';
import jsSHA from 'jssha';
import {BrowserRouter, Route} from 'react-router-dom';
import './../asset/layout.css';

import ScenicSidebar from './SceneicSidebar'
import ScenicWindow  from './ScenicWindow'
import ScenicWelcome from './ScenicWelcome'

const city_Name=['',  'Taipei','NewTaipei', 'Taoyuan', 'Taichung', 'Tainan',
             'Kaohsiung',  'Keelung','Hsinchu','HsinchuCounty','MiaoliCounty',
             'ChanghuaCounty','NantouCounty','YunlinCounty','ChiayiCounty',
             'Chiayi', 'PingtungCounty','YilanCounty','HualienCounty',
             'TaitungCounty','KinmenCounty','PenghuCounty','LienchiangCounty'];

const app_id  = '2f6bbd7edb8b44998908bec8ac74325c';
const app_key = '4ssuteFAI12Rkb0EyFCouBgELrs';

async function fectSpotData(city_Name , time){
    let spot_data ;    
    let UTCstring = new Date().toUTCString();
    let ShaObj    = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(app_key, 'TEXT');
    ShaObj.update('x-date: ' + UTCstring);
    let HMAC = ShaObj.getHMAC('B64');
    
    await axios({
        method : 'get',
        url :`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot${!city_Name ? city_Name : '/'+city_Name }?$top=30&$skip=${30*(time)}&$format=JSON`,
        headers : {
            'Authorization' : `hmac username="${app_id}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`,
            'X-Date' :  UTCstring,
        }
    }).then((response)=>{
        spot_data = response.data;
    }).catch((err)=>{
        throw err;
    });
    return spot_data;
}

export default class ScenicContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            city_Spot : city_Name.map(city => {return {
                    name : city,
                    spot : [],
                    isEnd : false
                }
            }),
            window_Count : 0
        }
        this.reachBottom     = this.reachBottom.bind(this);
        this.flipCityPage    = this.flipCityPage.bind(this);
        this.requestCitySpot = this.requestCitySpot.bind(this);
    }
    componentDidMount(){
        console.log('Init : container mount. ');
    }
    componentDidUpdate(){
        console.log('container update finish .');
    }
    flipCityPage(){
        this.setState({
            window_Count : 0
        })
    }
    reachBottom(city_Name ){
        for(let city of this.state.city_Spot){
            if(city.name === city_Name){
                if(city.spot.length-1 >= this.state.window_Count+1){
                    this.setState({
                        window_Count : this.state.window_Count+1
                    });
                    return;
                }
                else{
                    this.requestCitySpot(city_Name,this.state.window_Count+1 , true);
                    return;
                }    
            }
        }
    }
    async requestCitySpot(city_Name ,time, isChangeCount = false){
        for(let city of this.state.city_Spot){
            if(city.name === city_Name && city.isEnd){
                console.log(`we got all spot of ${city_Name}.`);
                return ;
            }
        }
        if(city_Name === undefined)
            city_Name="";    
        let spot_data = await fectSpotData(city_Name,time);
        console.log(`request city data of ${city_Name} .`, spot_data);
        if(spot_data.length === 0){
            console.log(`we got all spot of ${city_Name}.`);
            this.setState({
                city_Spot : this.state.city_Spot.map (city_Spot =>{
                    if(city_Name === city_Spot.name){
                        return {
                            ...city_Spot,
                            isEnd : true,
                        }
                    }
                    return city_Spot;
                })
            })
            return;
        }
        this.setState({
            city_Spot : this.state.city_Spot.map(city_Spot =>{
                if(city_Name !== city_Spot.name){
                    return city_Spot;
                }
                city_Spot.spot.push(spot_data);
                return city_Spot;
            }),
            window_Count : ( !(isChangeCount) ? 0 : this.state.window_Count+1 )
        })
    }
    render(){
        console.log('container render');
        return(
            <BrowserRouter>
                <div className='layout-container'>
                    <div className='layout-sidebar'>
                        <ScenicSidebar city_Spot={this.state.city_Spot} />
                    </div>
                    <div className='layout-widnow'>
                        <Route exact path='/' component={ScenicWelcome}/>
                        <Route exact path='/scenicSpot/:city?' 
                            render= {(props)=>{
                                return <ScenicWindow 
                                            count ={this.state.window_Count}
                                            emitSignal_flipCityPage  = {this.flipCityPage}
                                            emitSignal_reachBottom    = {this.reachBottom}
                                            emitSignal_requestCitySpot= {this.requestCitySpot}
                                            city_Spot = {this.state.city_Spot.filter(city_Spot => city_Spot.name === (!(props.match.params.city) ? '' :props.match.params.city ))[0]}
                                        />
                            }}
                        />    
                    </div>
                </div>
            </BrowserRouter>    
        )
    }
}