import React from 'react';
import { Link} from 'react-router-dom'

import './../asset/sidebar.css'

const Sidebar = (props)=>{
    console.log('side bar render', props);
    return(
        <div className='side-bar-container'>
            <div className='side-bar-header'>
                <h1 className='side-bar-title'>Tawain</h1>
            </div>
            <div className='side-bar-body'>
                {
                    props.purpose.map( (purpose ,index)=>{
                        return (
                            <div className='dropdown' key={index}>
                                <button  className='dropdown-button'>{purpose}</button>
                                <div className='dropdown-menu'>
                                    {props.city_Name.map( (city_Name ,index) =>{
                                        return  <Link to={ !(city_Name)? `/${purpose}`:`/${purpose}/${city_Name}`} key={index} >  
                                                    <button className='side-bar-item' >
                                                        <p className='side-bar-link'>  
                                                            {!(city_Name)? 'All' : city_Name} 
                                                        </p>     
                                                    </button>
                                                </Link>        
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )    
}
export default React.memo(Sidebar);