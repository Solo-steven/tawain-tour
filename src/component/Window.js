import  React from 'react';

import Welcome from './Welcome'
import Card from './Card'
import './../asset/card.css';

export default class Window extends React.Component{
    constructor(props){
        super(props);
        this.window_ref = React.createRef();
        this.detectScrollToBottom = this.detectScrollToBottom.bind(this);
    }
    detectScrollToBottom(){
        let window = this.window_ref.current;
        if( (window.scrollHeight - window.scrollTop === window.clientHeight) && (window.scrollTop!== 0) ){
            console.log(`Event : Reach Rottom (city :${this.props.city.name} , purpose : ${this.props.purpose} )`);
            this.props.emitSignal_reachBottom(this.props.purpose, this.props.city.name);
        }
    }
    async componentDidMount(){
        console.log('window mount');
        this.window_ref.current.addEventListener('scroll', this.detectScrollToBottom);
        console.log(`Event : Filpe To New City (city :${this.props.city.name} , purpose : ${this.props.purpose} ).`);
        this.props.emitSignal_flipCityPage(this.props.purpose , this.props.city.name); 
    }
    async componentDidUpdate(prevProps){
        console.log('window update');
        if(prevProps.city.name !== this.props.city.name || this.props.purpose !== prevProps.purpose){
            console.log(`Event : Filpe To New City :${this.props.city.name} `);
            this.window_ref.current.scrollTop = 0;
            this.props.emitSignal_flipCityPage(this.props.purpose , this.props.city.name);    
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
                    this.props.purpose === undefined ?
                        <Welcome/> :
                        this.props.city[this.props.purpose].map( (data_arr ,index_outside)=>{
                            if(index_outside <= this.props.count )
                                return data_arr.map( (data ,index_inside) =>{
                                    return <Card 
                                                title={data.Name} 
                                                description={ ((!data.DescriptionDetail)? data.Description : data.DescriptionDetail )} 
                                                picture ={data.Picture}
                                                openTime = {data.OpenTime}
                                                address = {data.Address}
                                                phone = {data.Phone}
                                                key={index_inside + (30* index_outside)}
                                            />
                                });
                                return null;    
                        })
                }
            </div>
        )
    }
}