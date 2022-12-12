import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);

    function onClick() {
        setShowMenu(!showMenu);
    }

    return (
        <>
            {/* <div>
                <a
                    href="https://fabioavilar.github.io/FabioBassaniPortfolio/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src="/images/SocialNetwork.gif"
                        className="image linkFabio"
                        alt="logo"
                    />
                </a>
            </div> */}
            <div id="nav-menu" className={showMenu ? "menu visible" : "menu"}>
                <button className="button buttonHeader" onClick={onClick}>
                    ☰
                </button>
                <ul className="nav__list navList ">
                    <li>
                        <Link className="nav__link active" to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link className="nav__link" to="/users">
                            Find People
                        </Link>
                    </li>
                    <li>
                        <Link className="nav__link" to="/friendships">
                            Friends
                        </Link>
                    </li>
                    <li>
                        <Link className="nav__link" to="/chat">
                            Chat
                        </Link>
                    </li>
                    <li>
                        <a className="nav__link" href="/logout">
                            Log Out
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
