import { Link } from "react-router-dom";

export default function Header() {

    return (
        <ul className="navList">
            <li>
                <a
                    href="https://fabioavilar.github.io/FabioBassaniPortfolio/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src="/images/SocialNetwork.gif"
                        className="image"
                        alt="logo"
                    />
                </a>
            </li>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/users">Find People</Link>
            </li>
            <li>
                <Link to="/friendships">Friends</Link>
            </li>
            <li>
                <a href="/logout">Log Out</a>
            </li>
        </ul>
    );
}
