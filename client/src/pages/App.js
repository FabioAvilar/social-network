import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Modal from "../components/modal";
import ProfilePicture from "../components/ProfilePicture";
import Profile from "./Profile";

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch("/api/users/me")
            .then((response) => response.json())
            .then((user) => {
                if (!user) {
                    history.replaceState({}, "", "/login");
                    return;
                }
                console.log(user);
                setUser(user);
            });
    }, []);

    function onPictureClick() {
        console.log("onPictureClick");
        setModalVisible(true);
    }

    function onClose() {
        console.log("test onclose");
        setModalVisible(false);
    }

    function onUpload(newPictureUrl) {
        console.log("newPictureUrl", newPictureUrl);
        setUser({
            ...user,
            profile_picture_url: newPictureUrl,
        });
        setModalVisible(false);
    }

    function onBioUpdate(newBio) {
        console.log("App:onBioUpdate", onBioUpdate);
        setUser({
            ...user,
            bio: newBio,
        });
    }

    return (
        <BrowserRouter>
            <header className="navHeader">
                <nav className="nav">
                    <Header
                        profile_picture_url={user.profile_picture_url}
                        setUser={setUser}
                        setModalVisible={setModalVisible}
                    ></Header>
                    <ProfilePicture
                        profile_picture_url={user.profile_picture_url}
                        onClick={onPictureClick}
                    />
                </nav>
            </header>

            <Profile
                first_name={user.first_name}
                last_name={user.last_name}
                profile_picture_url={user.profile_picture_url}
                bio={user.bio}
                onBioUpdate={onBioUpdate}
            />
            {modalVisible && <Modal onClose={onClose} onUpload={onUpload} />}
        </BrowserRouter>
    );
};

export default App;
