const Square = ({ color, onClick }) => {
    return (
        <div
            className="square"
            style={{ backgroundColor: color }}
            onClick={onClick}
        ></div>
    );
};

export default Square;
