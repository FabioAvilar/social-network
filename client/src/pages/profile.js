import ProfilePicture from "../components/profilePicture";

export default function Profile({ userData }) {
    return (
        <div>
            <ProfilePicture isEditable avatar={userData.profile_picture_url} />
            <div>
                <h2>{`Welcome ${userData.first_name}`}</h2>
            </div>
        </div>
    );
}
