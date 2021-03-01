import  React from 'react';

import Card from './Card'
import './../asset/card.css';

/**
 *   Window 負責的部分 ： 
 *      1. 判斷是否scroll to bottom . 是的話呼叫emitSingal_reachBottom.
 *      2. 判斷url是變化 . 是的話呼叫emitSingal_flipCityPage.
 */

export default class ScenicWindow extends React.Component{
    constructor(props){
        super(props);
        this.window_ref = React.createRef();
        this.detectScrollToBottom = this.detectScrollToBottom.bind(this);
    }
    detectScrollToBottom(){
        let window = this.window_ref.current;
        if( (window.scrollHeight-window.scrollTop === window.clientHeight) && (window.scrollTop!== 0) ){
            console.log('Event : window to bottom');
            this.props.emitSignal_reachBottom(this.props.city_Spot.name);
        }
    }
    async componentDidMount(){
        console.log('window mount');
        if(this.props.city_Spot.spot.length ===0){
            console.log(`Event : new city :${this.props.city_Spot.name} `);
            await this.props.emitSignal_requestCitySpot(this.props.city_Spot.name , 0);
        }
        this.window_ref.current.addEventListener('scroll', this.detectScrollToBottom);
    }
    async componentDidUpdate(prevProps){
        console.log('window update');
        if(prevProps.city_Spot.name !== this.props.city_Spot.name){
            console.log(`Event : new city :${this.props.city_Spot.name} `);
            this.window_ref.current.scrollTop = 0;
            if(this.props.city_Spot.spot.length ===0)
                await this.props.emitSignal_requestCitySpot(this.props.city_Spot.name , 0);
            else 
              this.props.emitSignal_flipCityPage();    
        }
    }
    componentWillUnmount(){
        this.window_ref.current.removeEventListener('scroll', this.detectScrollToBottom);
    }
    render(){
        console.log('window render');
        return (
            <div className='card-wrap' ref={this.window_ref}>
                { 
                   ( this.props.city_Spot.spot.length===0 ? null :
                        this.props.city_Spot.spot.map( (spot_arr ,index)=>{
                                if(index <= this.props.count )
                                    return spot_arr.map( (spot ,index) =>{
                                        return <Card title={spot.Name} context={spot.DescriptionDetail} key={index}/>
                                    });
                                return null;    
                            })
                        )
                }
            </div>
        )
    }
}