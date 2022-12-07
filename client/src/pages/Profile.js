// import ProfilePicture from "../components/ProfilePicture";
import ProfilePicture from "../components/ProfilePicture";
import BioEditor from "../components/BioEditor";

export default function Profile({
    first_name,
    last_name,
    profile_picture_url,
    bio,
    onBioUpdate,
}) {
    return (
        <section className="profile">
            <div className="profileContent">
                <ProfilePicture
                    first_name={first_name}
                    last_name={last_name}
                    profile_picture_url={profile_picture_url}
                    className="profileImage"
                />
                <div className="profileSub">
                    <h2 className="profileTitle">
                        {first_name} {last_name}
                    </h2>
                    <p className="profileBio">{bio}</p>
                </div>
            </div>
            <BioEditor bio={bio} onBioUpdate={onBioUpdate} />
        </section>
    );
}
