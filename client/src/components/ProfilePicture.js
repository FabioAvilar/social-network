export default function ProfilePicture({ avatar, onClick, first_name, last_name }) {
    const default_picture = "https://dummyimage.com/100x100/fff/aaa";

    return (
        <img
            className="image"
            onClick={onClick}
            src={avatar || default_picture}
            alt={`${first_name} ${last_name}`}
        />
    );
}
