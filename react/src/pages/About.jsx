import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import '../styles/about.css'

export default function About() {
    return (
        <main id='aboutPage'>
        <header>
            <Link to='/'><img src={logo} alt="GeoDrop Logo" width='350px' style={{margin: '1rem auto'}}/></Link>
        <h1>About Geodrop</h1>
    </header>

        <section>
            <h2>Our Mission</h2>
            <p>At Geodrop, we&apos;re on a mission to make every pin on the map a story worth sharing. Our platform empowers users to drop pins, share insights, and discover diverse perspectives from around the globe.</p>
        </section>

        <section>
            <h2>What We Offer</h2>
            <ul>
                <li><strong>Drop Your Experiences:</strong> Drop pins on the map to capture and share your favorite spots, travel adventures, and local secrets. Add photos, videos, or notes to personalize your drops and inspire others.</li>
                <li><strong>Discover and Connect:</strong> Dive into a treasure trove of drops created by fellow explorers. From travel tips and cultural insights to personal anecdotes, there&apos;s always something new to explore and connect over.</li>
                <li><strong>Community Spirit:</strong> Join a vibrant community of like-minded travelers, storytellers, and local enthusiasts. Engage in conversations, follow inspiring droppers, and build connections that transcend geographical boundaries.</li>
            </ul>
        </section>

        <section>
            <h2>Our Vision</h2>
            <p>At Geodrop, we envision a world where every location tells a story and connects us through shared experiences. By fostering a global community of storytellers, adventurers, and culture seekers, we aim to inspire curiosity, celebrate diversity, and forge meaningful connections.</p>
        </section>

        <section>
            <h2>Join Us</h2>
            <p>Ready to map out your next adventure or share a local gem? <Link to='/'>Join the Geodrop community</Link> and start dropping, connecting with others, and sharing your world one location at a time. Whether you&apos;re a seasoned traveler or a curious local, Geodrop welcomes you to explore, connect, and share your unique perspective.</p>
        </section>

        <section>
            <h2>Get in Touch</h2>
            <p>Have questions or feedback? We&apos;d love to hear from you! Reach out to us <a href="mailto:hutchison.music@gmail.com">via email</a>. Let&apos;s explore, connect, and share together!</p>
        </section>

    <footer>
        <p>Explore. Connect. Share.</p>
        <p><Link to='/'>Join the Geodrop journey today.</Link></p>
    </footer>
    </main>
    )
}