import BlogCard from "@/components/BlogCard"

const page = () => {
  return (
    <>
        <div className="space">
            <div className="container">
                <div className="title text-center">
                    <h2>Our Blog</h2>
                </div>


                <div className="row g-5">
                   {[...Array(13)].map((_, i) => (
                        
                        <div className={i === 0 ? "bigBlog" : "col-lg-4 col-md-6"} key={i}>
                            <BlogCard 
                                src="/images/activity2.jpg" 
                                title="Things to do at Unchagoan" 
                                author="By Sean Kelly" 
                                update_date="Updated August 15, 2025"
                                link="/blog/1"
                            />
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default page