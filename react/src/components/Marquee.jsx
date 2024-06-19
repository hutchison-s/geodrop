import PropTypes from 'prop-types'

export default function Marquee({text, text2}) {
    return (
        <div className="infiniteScroll">
        <div className="scrollCar">
          <span className="scrollText">{text}</span>
          {text2 && <span className="scrollText">{text2}</span> }
          <span className="scrollText">{text}</span>
          {text2 && <span className="scrollText">{text2}</span> }
          <span className="scrollText">{text}</span>
          {text2 && <span className="scrollText">{text2}</span> }
          <span className="scrollText">{text}</span>
          {text2 && <span className="scrollText">{text2}</span> }
        </div>
      </div>
    )
}

Marquee.propTypes = {
    text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    text2: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
}