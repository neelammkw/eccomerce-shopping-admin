const UserAvatarImgComponent = (props ) => {
return (
    <div className={` userImg ${props.lg===true && 'lg'}`}>
    <span className="rounded-circle mc-review-author">
    <img src={props.img} />
    </span>
    </div>
)
}
export default UserAvatarImgComponent;