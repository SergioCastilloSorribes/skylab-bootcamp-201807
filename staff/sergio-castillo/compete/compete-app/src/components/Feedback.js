import React from 'react'

function showFeedback (props){
    return  <section>
                <h7 className="text-danger">{props.message}</h7>
            </section>
}

export default showFeedback