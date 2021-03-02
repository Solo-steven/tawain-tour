import React from 'react';
import './../asset/welcome.css';

const ScenicWelcome = ()=> {
    console.log('welcome redner');
    return (
        <div className='welcome-container'>
            <div className='welcome-card'>
                <div className='welcome-header'>
                    <h1 className='welcome-title'>Tour in Tawain</h1>
                </div>
                <div className='welcome-body'>
                        <p>想旅遊嗎？</p>
                        <p>到左邊按下你想去的個城市</p>
                        <p>就可以看到全部的景點喔！</p>
                </div>
            </div>
        </div>
    )
}

export default ScenicWelcome;