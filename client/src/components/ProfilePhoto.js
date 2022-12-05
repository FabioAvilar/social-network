export default function ProfilePhoto({
    profile_picture_url,
    onClick,
    first_name,
    last_name,
}) {
    const default_picture = "https://dummyimage.com/100x100/fff/aaa";

    return (
        <img
            className="profileImage"
            onClick={onClick}
            src={profile_picture_url || default_picture}
            alt={`${first_name} ${last_name}`}
        />
    );
}
