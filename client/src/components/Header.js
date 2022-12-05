import { Link } from "react-router-dom";

export default function Header() {
    return (
        <ul className="navList">
            <li>
                <img
                    src="/images/SocialNetwork.gif"
                    className="image"
                    alt="logo"
                />
            </li>
            <li><Link to="/users" >Find People</Link></li>
            <li>TESTE1</li>
            <li>TESTE2</li>
            <li>TESTE3</li>
        </ul>
    );
}
