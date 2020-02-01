import React, { PureComponent } from 'react'
import { Card, CardText }from 'react-md'; 
import YouTube from 'react-youtube';
import "./_video.css";

import {
  CardTitle,
  Media,
  MediaOverlay
} from 'react-md';

class Home extends PureComponent {
  /*
  constructor(props) {
    super(props)
  }
  */
  _onReady(event) {
     event.target.mute();
  }

  _onEnd(event) {
    event.target.playVideo();
  }

  render() {

    const videoOptions = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        controls: 0,
        rel: 0,
        showinfo: 0
      }
    };
    return (
      <Media>
        <div className="video-background">
          <div className="video-foreground">
            <YouTube
              videoId="uUerzMEhqdw"
              opts={videoOptions}
              className="video-iframe"
              onReady={this._onReady}
              onEnd={this._onEnd}
            />
          </div>
          <MediaOverlay style={{height:"100%"}}>
            <Card className="md-cell md-cell--12 md-text-container" style={{position:"relative", top:"20%"}}>
            <CardTitle title="Home" />
            <CardText>
              <p>
                This is HomePage!!
              </p>
            </CardText>
          </Card>
          </MediaOverlay>
        </div>
      </Media>
    )
  }
}

export default Home;
