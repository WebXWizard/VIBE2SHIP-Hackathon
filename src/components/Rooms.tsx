'use client'

import Link from "next/link"
import { Bath, BedDouble, ChevronRight, SquareDashed, Users } from 'lucide-react';

export default function Rooms(){
    return(
        <div className="rooms space">
            <div className="container">
                <div className="title text-center">
                    <h2>Book your stay and<br/>relaxin luxury hotel</h2>
                </div>
                <div className="row g-5">
                    <div className="col-md-4">
                        <div className="room">
                            <img src="/images/room1.jpg" alt="room" />
                            <div className="content">
                                <h3>Royal Suite</h3>
                                <div className="price">
                                    $199 / Night
                                </div>
                                <ul>
                                    <li><SquareDashed /> 90 m2</li>
                                    <li><Users /> 4 Guests</li>
                                    <li><BedDouble /> 3 Beds</li>
                                    <li><Bath /> 3 Bathrooms</li>
                                </ul>
                                <Link href="/rooms/royal-suite" className="cta mt-3">Book Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="room">
                            <img src="/images/room.jpg" alt="room" />
                            <div className="content">
                                <h3>Premier Room</h3>
                                <div className="price">
                                    $199 / Night
                                </div>
                                <ul>
                                    <li><SquareDashed /> 90 m2</li>
                                    <li><Users /> 4 Guests</li>
                                    <li><BedDouble /> 3 Beds</li>
                                    <li><Bath /> 3 Bathrooms</li>
                                </ul>
                                <Link href="/rooms/royal-suite" className="cta mt-3">Discover More</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="room">
                            <img src="/images/room.jpg" alt="room" />
                            <div className="content">
                                <h3>Skyline Suite</h3>
                                <div className="price">
                                    $199 / Night
                                </div>
                                <ul>
                                    <li><SquareDashed /> 90 m2</li>
                                    <li><Users /> 4 Guests</li>
                                    <li><BedDouble /> 3 Beds</li>
                                    <li><Bath /> 3 Bathrooms</li>
                                </ul>
                                <Link href="/rooms/royal-suite" className="cta mt-3">Discover More</Link>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}