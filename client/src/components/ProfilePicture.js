export default function ProfilePicture({ profile_picture_url, onClick, first_name, last_name, className="image" }) {
    const default_picture = "https://dummyimage.com/100x100/fff/aaa";

    return (
        <img
            className={className}
            onClick={onClick}
            src={profile_picture_url || default_picture}
            alt={`${first_name} ${last_name}`}
        />
    );
}
