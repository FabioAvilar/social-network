import { Link } from "react-router-dom";

export default function Header() {
    const logOut = () => {
        fetch("/api/logout", {
            method: "POST",
        }).then(location.reload());
    };

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
                <Link to="/users">Find People</Link>
            </li>
            <li>
                <Link to="/" onClick={logOut}>
                    Log Out
                </Link>
            </li>
        </ul>
    );
}
