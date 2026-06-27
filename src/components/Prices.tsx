'use client'

import { Check } from "lucide-react"
import Link from "next/link"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

export default function Prices(){
    return(
        <div className="prices space">
            <div className="container">
                <div className="title text-center">
                    <span>Our room prices</span>
                    <h2>The Best Room Prices</h2>
                    {/* <p>Experience heritage living with comfort and inclusivity. All room tariffs are inclusive of meals and taxes.</p> */}
                </div>

                <Swiper modules={[Pagination, Autoplay]} autoplay={{delay: 5000, disableOnInteraction: false }} slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                        clickable: true,
                        }}
                        breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 50,
                        },
                        }} className="mySwiper">
                    <SwiperSlide>
                        <div className="price_box">
                            <h3>Heritage Room</h3>
                            <h4><span>₹</span> 6,000 / Night</h4>
                            <div className="note">Note: 5% extra GST </div>
                            <ul>
                                <li><Check /> Rustic charm with 18th-century ambiance</li>
                                <li><Check /> Cozy king-sized bedding for restful stays</li>
                                <li><Check /> Tea/Coffee Maker</li>
                                <li><Check /> Ideal for couples or small families</li>
                            </ul>
                            <Link href="/" className="cta">Read More</Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="price_box two">
                            <h3>Deluxe Room</h3>
                            <h4><span>₹</span> 6,500 / Night</h4>
                            <div className="note">Note: 5% extra GST </div>
                            <ul>
                                <li><Check />  Spacious layout with heritage décor</li>
                            <li><Check />Air-conditioning & power backup </li>
                            <li><Check /> Complimentary toiletries</li>
                            <li><Check />Perfect for families and longer stays</li>
                            </ul>
                            <Link href="/" className="cta">Read More</Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="price_box ">
                            <h3>Super Deluxe Room</h3>
                            <h4><span>₹</span> 7,000 / Night</h4>
                            <div className="note">Note: 5% extra GST </div>
                            <ul>
                                <li><Check /> Royal interiors with antique furnishings</li>
                            <li><Check /> Heritage charm with modern comfort </li>
                            <li><Check /> Scenic views of lawns or fort walls</li>
                            <li><Check /> Hair dryers & ironing facilities on request</li>
                            </ul>
                            <Link href="/" className="cta">Read More</Link>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="price_box two">
                            <h3>Palace Room</h3>
                            <h4><span>₹</span> 7,500 / Night</h4>
                            <div className="note">Note: 5% extra GST </div>
                            <ul>
                                <li><Check /> Generously sized with regal styling</li>
                            <li><Check /> Equipped with Hot/cold water bathrooms</li>
                            <li><Check /> Vintage beds and furnishings</li>
                            <li><Check /> Perfect for indulgent heritage escapes</li>
                            </ul>
                            <Link href="/" className="cta">Read More</Link>
                        </div>
                    </SwiperSlide>
                    
                    
                </Swiper>
            </div>
        </div>
    )
}