

const page = () => {
  return (
    <div className="contact space">
        <div className="container">
            <div className="title text-center">
                <h2>Hotel Mud Fort</h2>
                <p>Query & Information</p>
            </div>
            <div className="row justify-content-between g-5">
                <div className="col-md-7">
                    <input type="text" name="name" className="form-control mb-4" placeholder="Full name" />
                    <input type="email" name="email" className="form-control mb-4" placeholder="Email address" />
                    <input type="phone" name="phone" className="form-control mb-4" placeholder="Phone number" />
                    <textarea name="comment" className="form-control mb-4" placeholder="Enter your Query" id=""></textarea>
                    <button type="submit" className="cta">Submit</button>
                </div>
                <div className="col-md-5">
                    <div className="address">
                        <h3>Address & Contact</h3>
                        <hr />
                        <p><strong>SALES & RESERVATION</strong></p>
                        <p>Mobile: +91 9871587150, +91 9910295370</p>
                        <p>EMail: info@mudfortkuchesar.com</p>

                        <p><strong>MUD FORT KUCHESAR</strong></p>
                        <p>Village Kuchesar Fort, Distt Bulandshahar 245 402 (UP)</p>
                        <p>Email: info@mudfortkuchesar.com</p>
                    </div>
                </div>
            </div>
        </div>
        <iframe
            className="mt-4"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.1213062922243!2d77.93844167555363!3d28.68601768164971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b62b1f5c6345f%3A0xa0be5609564e85a7!2sKuchesar%20Fort%2C%20Rao%20Raj%20Vilas%20%7C%205-star%20hotel%2C%20Luxurious%20wedding%20resort%20%7C%20Wedding%20destination%20%7C%20Siyana%2C%20Bulandshahr!5e0!3m2!1sen!2sin!4v1756631766202!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    </div>
  )
}

export default page