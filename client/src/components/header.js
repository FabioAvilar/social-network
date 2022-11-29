import ProfilePicture from "./profilePicture";

export default function Header({ avatar, setModalVisible }) {
    return (
        <nav>
            <ul>
                <li>Home</li>
                <li>Log Out</li>
                <ProfilePicture
                    isEditable
                    avatar={avatar}
                    setModalVisible={setModalVisible}
                >
                    Log Out
                </ProfilePicture>
            </ul>
        </nav>
    );
}
