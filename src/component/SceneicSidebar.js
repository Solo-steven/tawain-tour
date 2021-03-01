import React from 'react';
import { Link} from 'react-router-dom'

import './../asset/sidebar.css'

export default class SideBar extends React.Component{
    componentDidMount(){
        console.log('side bar  mount');
    }
    shouldComponentUpdate(){
        return false;
    }
    render(){
        console.log('side bar render')
        return(
            <div className='side-bar-container'>
                <div className='side-bar-header'>
                    <h1 className='side-bar-title'>Tawain</h1>
                </div>
                <div className='side-bar-body'>
                    {this.props.city_Spot.map( (city_Spot ,index) =>{
                            return  <Link to={ !(city_Spot.name)? '/scenicSpot':`/scenicSpot/${city_Spot.name}`} key={index} >  
                                        <button className='side-bar-item' >
                                            <p className='side-bar-link'>  
                                                {!(city_Spot.name)? 'All' : city_Spot.name} 
                                            </p>     
                                        </button>
                                    </Link>        
                    })}
                </div>
            </div>
        )
    }    
}
