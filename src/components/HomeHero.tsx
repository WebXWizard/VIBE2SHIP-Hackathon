'use client'
import { ReactNode } from "react";
import Link from "next/link"
type HeroProps = {
  bgImage: string;
  heading: ReactNode,
  subHeading: string,
  link: string
};

export default function HomeHero({ bgImage, heading, subHeading, link }: HeroProps){
    return(
        <div className="homeHero" style={{backgroundImage: `url(${bgImage})`,}}>
            <div className="container">
                <div className="hero-content">
                    <h2>{heading}</h2>
                    <p>{subHeading}</p>
                    <Link className="cta" href="/">{link}</Link>
                </div>
            </div>
        </div>
    )
}