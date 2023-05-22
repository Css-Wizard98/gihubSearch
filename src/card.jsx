import React from 'react';
import './card.css';

const Card = (props) => {
    return (
        <div className='cardBody'>
            <div className="card-container">
                <a className="hero-image-container">
                    <img className="hero-image" src={props.avatar} alt="avatare" />
                </a>
                <main className="main-content">
                    <h1>{props.repo}</h1>
                    <p>{props.description}</p>
                    <div className="flex-row">
                        <div className="coin-base">
                            <h2>{props.star}</h2>
                            <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji" />
                        </div>
                        <div className="time-left">
                            <span className='langName'>{props.language || '---'}</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>)
}

export default Card;