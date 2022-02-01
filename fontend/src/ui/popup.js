const Popup = props => {
    return (
        <div className="popup-box">
            <div className="box" onClick={props.handleClose}>
                {props.content}
            </div>
        </div>
    );
};

export default Popup