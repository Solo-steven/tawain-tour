import React  from 'react';

import './../asset/card.css';
//import  Modal from './Modal';

const Card = (props)=>{
    console.log('card render')
    return (
        <React.Fragment>  
          <div className='card'>
                <div className='card-header'>
                   <h1 className='card-title'>{props.title}</h1>
                </div>
                <div className='card-body'>
                  {props.description}
                </div>  
          </div>
         </React.Fragment> 
      )
}

export default React.memo(Card);