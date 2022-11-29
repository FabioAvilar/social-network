export default function ProfilePicture({avatar, setModalVisible, isEditable}) {
    const default_picture = "https://dummyimage.com/400x400/fff/aaa";

    const handlePictureClick = () => {
        setModalVisible(true);
    };

    return (
        <div onClick={isEditable ? handlePictureClick : undefined}>
            <img src={avatar || default_picture} />
        </div>
    );
}