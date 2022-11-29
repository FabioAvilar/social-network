import { Link } from "react-router-dom";

export default function Header() {
    // const logOut = () => {
    //     fetch("/api/logout", {
    //         method: "POST",
    //     }).then(location.reload());
    // };

    return (
        <nav>
            <Link to={"/"} >
                Log Out
            </Link>
        </nav>
    );
}
