import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Modal from "../components/modal";
import ProfilePicture from "../components/ProfilePicture";
import Profile from "./Profile";
import FindUsers from "../components/FindUsers";
import OtherProfile from "../components/OtherProfile";
import Friends from "./Friends";
import NewComponent from "../components/Socket";

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        async function getUser() {
            // console.log("App:getUser");
            // this is going to be /api/users/me
            const response = await fetch("/api/users/me");
            // console.log("teste do response", response);
            const parsedJSON = await response.json();
            setUser(parsedJSON);
            // console.log("teste do parsedJSON", parsedJSON);
        }
        getUser();
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

    function onBioUpdate(bio) {
        console.log("App:onBioUpdate", onBioUpdate);
        setUser({
            ...user,
            bio: bio,
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
                        first_name={user.first_name}
                        last_name={user.last_name}
                        onClick={onPictureClick}
                    />
                </nav>
                {modalVisible && (
                    <Modal onClose={onClose} onUpload={onUpload} />
                )}
            </header>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Profile
                            first_name={user.first_name}
                            last_name={user.last_name}
                            profile_picture_url={user.profile_picture_url}
                            bio={user.bio}
                            onBioUpdate={onBioUpdate}
                        />
                    }
                />
                <Route path="/users" element={<FindUsers />} />
                <Route path="/user/:id" element={<OtherProfile />} />
                <Route path="/friendships" element={<Friends />} />
                <Route path="/chat" element={<NewComponent />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
