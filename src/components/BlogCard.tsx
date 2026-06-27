'use client'

import Link from "next/link"

type BlogCardProps = {
  src: string,
  title: string,
  author: string,
  update_date: string,
  link: string
}

const BlogCard = ({src, title, author, update_date, link}:BlogCardProps) => {
  return (
    <div className="blog_card">
        <div className="image">
            <Link href={link}><img src={src} alt="blog" /></Link>
        </div>
        <div className="content">
            <h2><Link href={link}>{title}</Link></h2>
            <div className="info"><span>{author}</span> | <span>{update_date}</span></div>
        </div>
    </div>
  )
}

export default BlogCard