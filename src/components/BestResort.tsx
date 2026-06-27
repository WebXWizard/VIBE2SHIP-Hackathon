'use client'

import Link from "next/link"

export default function BestResort(){
    return(
        <div className="best_resort space">
            <div className="container">
                <div className="row align-items-center justify-content-between g-5">
                    <div className="col-lg-6">
                        <img src="/images/mudfort.jpg" alt="Best Resort" />
                    </div>
                    <div className="col-lg-6">
                        <span>Enjoy your Stay</span>
                        <h2>Welcome to Mudfort Resort</h2>
                        <p>Welcome to The MudFort Kuchesar, an 18th Century heritage resort near Delhi NCR. With over 280 years of royal history, the fort has been lovingly restored into a sanctuary of charm and comfort. Just 75 kms from Delhi, it offers an escape where heritage architecture, rustic beauty, and modern hospitality come together. A perfect escape for family holidays, romantic getaways, and cultural retreats.</p>
                        {/* <ul>
                            <li><Key /> Suite Smart Key</li>
                            <li><BriefcaseConveyorBelt /> Luggage Deposit</li>
                            <li><School /> Room Service</li>
                            <li><BrushCleaning /> Daily Cleaning</li>
                        </ul> */}
                        <Link href="/" className="cta">Read More</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}