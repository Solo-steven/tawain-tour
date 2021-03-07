import React from 'react';

import './../asset/modal.css';

const Modal =(props) => {
    console.log('modal render');  
    if(!props.isRender)
        return null;
    return (
        <div className='modal' >
            <div className='modal-dialog'  onClick={props.onClick}>
                <div className='modal-content' onClick={(e) =>{e.stopPropagation();}}>
                    <div className='modal-header'>
                        <h2 className='modal-title'>
                            {props.title}
                        </h2>
                    </div>
                    <div className='modal-body'>
                        <img className='modal-body-img'
                            src={  
                                    Object.entries(props.picture).length === 0 ?
                                    "" : props.picture['PictureUrl1']   
                                }
                            alt='沒有照片'
                            ></img>
                        <div className='modal-body-context'>
                            {props.description}
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <p className='modal-footer-info'>開放時間 ： {props.openTime} </p>
                        <p className='modal-footer-info'>電話 ： {props.phone}   </p>
                        <p className='modal-footer-info'>地址 ： {props.address}   </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Modal);