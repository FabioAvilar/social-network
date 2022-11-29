import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/header";
import PictureProfile from "../components/pictureProfile";
import Profile from "./profile";


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

    return (
        <>
            <BrowserRouter>
                <header>
                    <Header avatar={user.profile_picture_url} setUser={setUser} setModalVisible={setModalVisible} ></Header>
                    <Profile userData={user} setUser={setUser} ></Profile>
                </header>
                {modalVisible && (
                    <PictureProfile modalVisible={modalVisible} setUser={setUser} setModalVisible={setModalVisible} />
                )}

                <h1>Ola Brasil</h1>
                <img src="/images/SocialNetwork.gif" alt="logo" />
            </BrowserRouter>
        </>
    );
};

export default App;
