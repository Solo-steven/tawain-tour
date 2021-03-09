import  React from 'react';

import Welcome from './Welcome'
import Card from './Card'
import './../asset/card.css';

export default class Window extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            count : 0
        }
        this.window_ref = React.createRef();
        this.detectScrollToBottom = this.detectScrollToBottom.bind(this);
    }
    async detectScrollToBottom(){
        let window = this.window_ref.current;
        if( (window.scrollHeight-window.scrollTop === window.clientHeight) && (window.scrollTop!== 0) ){
            console.log(`Event : Reach Rottom (city :${this.props.city.name} , purpose : ${this.props.purpose} )`);
           if(this.state.count +1 <= this.props.city[this.props.purpose].length-1){
               this.setState({
                   count: this.state.count+1
               })
               return;
           }
           await this.props.reachBottom(this.props.purpose , this.props.city.name, this.state.count);
        }
    }
    async componentDidMount(){
        console.log('window mount');
        this.window_ref.current.addEventListener('scroll', this.detectScrollToBottom);
        console.log(`Event : Filpe To New City (city :${this.props.city.name} , purpose : ${this.props.purpose} ).`);
        this.window_ref.current.scrollTop = 0;
        await this.props.NewPage(this.props.purpose , this.props.city.name); 
    }
    async componentDidUpdate(prevProps){
        console.log('window update');
        console.log(prevProps.city[this.props.purpose].length ,this.props.city[this.props.purpose].length)
        if(prevProps.city[this.props.purpose].length < this.props.city[this.props.purpose].length){
            console.log('window have new data')
            this.setState({ 
                count : this.state.count+1
            })
            return
        }
        if(prevProps.city.name !== this.props.city.name || this.props.purpose !== prevProps.purpose){
            console.log(`Event : Filpe To New City (city :${this.props.city.name} , purpose : ${this.props.purpose} ).`);
            this.window_ref.current.scrollTop = 0;
            this.setState({ count: 0})
            return;
        }
        if(this.props.city[this.props.purpose].length === 0){
            await this.props.NewPage(this.props.purpose , this.props.city.name); 
            return;
       }

    }
    componentWillUnmount(){
        this.window_ref.current.removeEventListener('scroll', this.detectScrollToBottom);
    }
    render(){
        console.log('window render');
        return (
            <div className='card-wrap' ref={this.window_ref} >
                {
                    this.props.purpose === undefined ? 
                    <Welcome/> :
                    this.props.city[this.props.purpose].map( (data_arr ,index_outside)=>{
                        if(index_outside <= this.state.count )
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
