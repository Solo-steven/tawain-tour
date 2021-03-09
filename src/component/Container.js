import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './../asset/layout.css';

import Sidebar from './Sidebar'
import Window  from './Window'
import fetchData from '../pure function/fetch'

const purpose   = ['ScenicSpot', 'Hotel' , 'Restaurant'];
const city_Name = [
                ''              , 'Taipei'         , 'NewTaipei'    , 'Taoyuan'       ,  'Taichung'    , 'Tainan',
                'Kaohsiung'      , 'Keelung'        , 'Hsinchu'      , 'HsinchuCounty' , 'MiaoliCounty',
                'ChanghuaCounty' , 'NantouCounty'   , 'YunlinCounty' , 'ChiayiCounty'  ,
                'Chiayi'         , 'PingtungCounty' , 'YilanCounty'  , 'HualienCounty' ,
                'TaitungCounty'  , 'KinmenCounty'   , 'PenghuCounty' , 'LienchiangCounty'
            ];

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
        }
       this.NewPage = this.NewPage.bind(this);
       this.reachBottom = this.reachBottom.bind(this);
    }
    componentDidMount(){
        console.log('Init : container mount. ');
    }
    componentDidUpdate(){
        console.log('container update finish .');
    }
   async NewPage(purpose , city_Name){
            if(purpose===undefined)
                return;
            let data = await fetchData(purpose, city_Name, 0);
                this.setState({
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
   async reachBottom(purpose , city_Name , count){
       if(purpose === undefined )
         return; 
       for(let target_city of this.state.city){
           if(target_city.name === city_Name){
              if(target_city[`${purpose}_isEnd`]){
                  console.log('reach to buttom - city data array is lenght enough.');
                  return
              }
              let data = await fetchData(purpose , city_Name, count+1);
              console.log('finisd fetch')
              if(data.length === 0){
                target_city[`${purpose}_isEnd`]=true;
                console.log('reach to bottom - no data can fetch.');
                return ;
              }   
              this.setState({
                  city : this.state.city.map(city=>{
                      if(city.name === city_Name){
                          city = JSON.parse(JSON.stringify(city))
                          city[purpose].map(d =>{
                              return  d 
                          });
                          city[purpose].push(data)
                          return  city
                      }
                      return city;
                  })
              })
              console.log('reach to bottom - city get new data .' ,data)
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
                                                city_Name ={props.match.params.city}
                                                NewPage ={this.NewPage}
                                                reachBottom = {this.reachBottom}
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