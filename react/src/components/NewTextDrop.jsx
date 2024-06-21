import PropTypes from 'prop-types'


export default function NewTextDrop({collect, cancel}) {
   
    return (
        <>
            <form
            className="fullscreen grid center padL gapL"
            onSubmit={collect}
          >
            <button
                id="cancelSubmission"
                type="button"
                onClick={cancel}
                className="padM circle grid center colorFG bgNone"
              >
          <i className="fa-solid fa-xmark"></i>
        </button>
            <div className="innerWrap grid center gapM w100">
              <textarea
                name="textInput"
                id="textInput"
                rows={18}
                className="textDropInput"
              ></textarea>
              <button
                id="finishWriting"
                type="submit"
                className="noBorder bgNone padM colorFG mAuto"
              >
                Ready to Drop
              </button>
            </div>
          </form>
            
        </>
    )
}

NewTextDrop.propTypes = {
    collect: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
}