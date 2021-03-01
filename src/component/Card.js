import React from 'react';

import './../asset/card.css'
export default class Card extends React.Component{
    render(){
        return (
            <div className='card'>
                  <div className='card-header'>
                     <h1 className='card-title'>{this.props.title}</h1>
                  </div>
                  <div className='card-body'>
                    {this.props.context}
                  </div>  
            </div>
        )
    }
}