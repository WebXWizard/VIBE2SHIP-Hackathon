'use client'

import Link from "next/link"
import BlogCard from "./BlogCard"

export default function BlogHome(){

// old blog card
{/* <div className="blog">
    <div className="image">
        <Link href='/'><img src="/images/activity1.jpg" alt="activity" /></Link>
    </div>
    <div className="info"><span>12 Aug 2025</span> <span>Tips & Tricks</span></div>
    <h3><Link href="/">New Chef and Spring Special Menu</Link></h3>
</div> */}

    return(
        <div className="blogs space">
            <div className="container">
                <div className="title text-center">
                    <span>News & Blog</span>
                    <h2>Check Latest Blog</h2>
                </div>
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <BlogCard 
                            src="/images/blog.jpg" 
                            title="New Chef and Spring Special Menu" 
                            author="By Sean Kelly" 
                            update_date="Updated August 15, 2025"
                            link="/blog/1"
                        />
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <BlogCard 
                            src="/images/blog.jpg" 
                            title="Things to do at Unchagoan" 
                            author="By Sean Kelly" 
                            update_date="Updated August 15, 2025"
                            link="/blog/1"
                        />
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <BlogCard 
                            src="/images/blog.jpg" 
                            title="Pre wedding photoshoot" 
                            author="By Sean Kelly" 
                            update_date="Updated August 15, 2025"
                            link="/blog/1"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}