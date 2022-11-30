import ProfilePicture from "../components/ProfilePicture";

export default function Profile({ userData }) {
    return (
        <div className="navFoto">
            <ProfilePicture isEditable avatar={userData.profile_picture_url} />
            <div>
                <h2 className="navTitle">{`Name: ${userData.first_name}`}</h2>
            </div>
        </div>
    );
}
