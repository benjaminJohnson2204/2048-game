export default function Box(props) {
    return (
        <div className={getStyleFromNumber(props.number)}>
            {props.number}
        </div>
    )
}

function getStyleFromNumber(number) {
    return "box box-" + number.toString();
}