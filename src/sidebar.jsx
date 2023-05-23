import React, { useState } from "react";
import './sidebar.css'
const Sidebar = (props) => {
    return (
        <div className='overLay'>
            <div className='content'>
                <div className='popupheader'>
                    <h1 style={{ color: 'black' }}>Filter</h1>
                    <img className='crossIcon' width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/multiply.png" alt="multiply" onClick={() => props.setshowPouup(false)} />
                </div>
                <ul>
                    <li onClick={() => props.setFilter('stargazers_count')} className={`${props.filter == 'stargazers_count' ? 'Active' : ''}`}>STARS</li>
                    <li onClick={() => props.setFilter('watchers_count')} className={`${props.filter == 'watchers_count' ? 'Active' : ''}`}>watchers count</li>
                    <li onClick={() => props.setFilter('score')} className={`${props.filter == 'score' ? 'Active' : ''}`}>score</li>
                    <li onClick={() => props.setFilter('name')} className={`${props.filter == 'name' ? 'Active' : ''}`}>name</li>
                    <li onClick={() => props.setFilter('created_at')} className={`${props.filter == 'created_at' ? 'Active' : ''}`}>created at</li>
                    <li onClick={() => props.setFilter('updated_at')} className={`${props.filter == 'updated_at' ? 'Active' : ''}`}>updatedat</li>
                </ul>
                <hr />
                <ul>
                    <li onClick={() => props.setisAscending(1)} className={`${props.isAscending == 1 ? 'Active' : ''}`}>
                        ascending
                    </li>
                    <li onClick={() => props.setisAscending(0)} className={`${props.isAscending == 0 ? 'Active' : ''}`}>
                        descending
                    </li>
                </ul>
                <div className='filterbtnDiv'>
                    <span onClick={props.applyFilter}>Apply</span><span onClick={props.clearFilter}>Clear</span>
                </div>
            </div>
        </div>)
}

export default Sidebar;