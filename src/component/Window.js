import  React from 'react';
import {Route, Switch, Link} from 'react-router-dom';

import Welcome from './Welcome'
import Card from './Card';
import Modal from './Modal';
import './../asset/card.css';

export default class Window extends React.Component{
    constructor(props){
        super(props);
        this.window_ref = React.createRef();
        this.detectScrollToBottom = this.detectScrollToBottom.bind(this);
    }
   async detectScrollToBottom(){
        let window = this.window_ref.current;
        if( (window.scrollHeight - window.scrollTop === window.clientHeight) && (window.scrollTop!== 0) ){
            console.log(`Event : Reach Rottom (city :${this.props.city.name} , purpose : ${this.props.purpose} )`);
            await this.props.emitSignal_reachBottom(this.props.purpose, this.props.city.name);
        }
    }
    shouldComponentUpdate(nextProps){
        if( this.props.match.path    ===  nextProps.match.path  && 
            this.props.match.url     ===  nextProps.match.url   && 
            this.props.match.isExact === !nextProps.match.isExact)
            return false;
        return true;    
    }
    async componentDidMount(){
        console.log('window mount');
        this.window_ref.current.addEventListener('scroll', this.detectScrollToBottom);
        console.log(`Event : Filpe To New City (city :${this.props.city.name} , purpose : ${this.props.purpose} ).`);
         await this.props.emitSignal_flipCityPage(this.props.purpose , this.props.city.name); 
    }
    async componentDidUpdate(prevProps){
        console.log('window update');
        if(prevProps.city.name !== this.props.city.name || this.props.purpose !== prevProps.purpose){
            console.log(`Event : Filpe To New City :${this.props.city.name} (${this.props.purpose}) `);
            this.window_ref.current.scrollTop = 0;
            await this.props.emitSignal_flipCityPage(this.props.purpose , this.props.city.name);    
        }
    }
    componentWillUnmount(){
        this.window_ref.current.removeEventListener('scroll', this.detectScrollToBottom);
    }
    render(){
        console.log('window render' , this.props );
        return (
            <div className='card-wrap' ref={this.window_ref}>
                {
                    this.props.purpose === undefined ?
                        <Welcome/> :
                        this.props.city[this.props.purpose].map( (data_arr ,index_outside)=>{
                            if(index_outside <= this.props.count )
                                return data_arr.map( (data ,index_inside) =>{
                                    return <Link className='card-link' to={`${this.props.match.url}/${data.Name}`}key={index_inside + (30* index_outside)} >
                                                <Card 
                                                    title={data.Name} 
                                                    description={ ((!data.DescriptionDetail)? data.Description : data.DescriptionDetail )}                                               
                                                />
                                            </Link>
                                });
                                return null;    
                        })

                }   
                <Switch>
                       { this.props.purpose === undefined ?
                        null : 
                         this.props.city[this.props.purpose].map((data_arr ,index_outside)=>{
                            if(index_outside <= this.props.count )
                                return data_arr.map( (data ,index_inside) =>{
                                    return <Route  
                                            path={`${this.props.match.path}/${data.Name}`}
                                            key={-(index_inside + (30* index_outside))-1}
                                            render={(props)=>{
                                                return  <Modal 
                                                                {...props}
                                                                title={data.Name} 
                                                                description={ ((!data.DescriptionDetail)? data.Description : data.DescriptionDetail )} 
                                                                picture ={data.Picture}
                                                                openTime = {data.OpenTime}
                                                                address = {data.Address}
                                                                phone = {data.Phone}
                                                                key={index_inside + (30* index_outside)}
                                                        /> 
                                        }}
                                    />
                                });
                                return null;    
                        })}
                </Switch>
            </div>
        )
    }
}