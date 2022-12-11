import { Link } from "react-router-dom";

export default function Header() {





    
    // MENU SHOW HAMBURGUER
    const showMenu = (toggleId, navId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId);

        if (toggle && nav) {
            toggle.addEventListener("click", () => {
                nav.classList.toggle("show");
            });
        }
    };
    showMenu("nav-toggle", "nav-menu");

    // REMOVE MENU MOBILE
    const navLink = document.querySelectorAll(".nav__link");

    function linkAction() {
        // Active Link
        navLink.forEach((n) => n.classList.remove("active"));
        this.classList.add("active");

        // REMOVE MENU
        const nav__menu = document.getElementById("nav-menu");
        nav__menu.classList.remove("show");
    }

    navLink.forEach((n) => n.addEventListener("click", linkAction));





    return (
        <>
            <div id="nav-menu" className="">
                <ul className="nav__list navList ">
                    <li>
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
                    </li>
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

            {/* <div className="nav__toggle" id="nav-toggle">
                <img className="icon" src="../images/menuHamburguer.png" />
            </div> */}
        </>
    );
}
