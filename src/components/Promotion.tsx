import Link from "next/link"

function Promotion() {
  return (
    <div className="promotion">
        <div className="copy">
            <h2>Up to 60% OFF</h2>
            <p>On hotel booking online</p>
            <Link href="/" className="cta">Book now</Link>
        </div>
    </div>
  )
}

export default Promotion