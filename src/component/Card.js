import React , {useState} from 'react';

import './../asset/card.css';
import  Modal from './Modal';

const Card = (props)=>{
    let [isRender , handleRender] = useState(false);
    console.log('card render')
    return (
        <React.Fragment>  
          <div className='card' onClick={()=>{handleRender(!isRender)}}>
                <div className='card-header'>
                   <h1 className='card-title'>{props.title}</h1>
                </div>
                <div className='card-body'>
                  {props.description}
                </div>  
          </div>
         <Modal
             onClick  = {()=>{handleRender(!isRender)}} 
             isRender = {isRender}
             title    = {props.title}
             description = {props.description}
             picture  = {props.picture} 
             openTime = {props.openTime}
             address = {props.address}
             phone = {props.phone}
         />
         </React.Fragment> 
      )
}

export default React.memo(Card);