import React from "react";
import { Progress } from "semantic-ui-react";

const ProgresBar = ({ uploadState, percentUploaded }) => {
    return (uploadState === 'uploading' && (
        <Progress
            className='progress__bar'
            percent={percentUploaded}
            progress
            inverted
            indicating
            size='medium'

        />
    ))
};

export default ProgresBar;