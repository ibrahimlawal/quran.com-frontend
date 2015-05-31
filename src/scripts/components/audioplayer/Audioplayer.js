import React from 'react';
import AudioplayerStore from 'stores/AudioplayerStore';
import AudioplayerTrack from './AudioplayerTrack';
import VersesDropdown from './VersesDropdown';
import AyahsActions from 'actions/AyahsActions';
import {connectToStores} from 'fluxible/addons'
import SurahsStore from 'stores/SurahsStore';
import AyahsStore from 'stores/AyahsStore';
import * as AudioplayerActions from 'actions/AudioplayerActions';
import classNames from 'classnames';

class Audioplayer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playing: false,
      shouldRepeat: false,
      progress: 0,
      currentTime: 0,
      currentAudio: null,
      currentAyah: null
    };
  }

  componentDidMount() {
    if (this.props.ayahs.length > 0 && typeof window !== 'undefined') {
      this.setupAudio();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // When navigating from the index page, there is no ayah set and therefore,
    // should bootstrap it!
    if (!prevProps.currentAyah) {
      return;
    }
    if (prevProps.currentAyah.ayah !== this.props.currentAyah.ayah) {
      this.setupAudio();
    }
  }

  _ayahChanged() {
    // var currentAyah = this.getStore(AyatStore).getAyahs().find((a) => {
    //   return this.getStore(AudioplayerStore).getCurrentAyah()  === a.ayah;
    // });

    // If the ayah is beyond the range
    if (currentAyah === undefined) {
      if (this.getParams().range) {
        var rangeArray = this.getParams().range.split('-');
      } else {
        var rangeArray = [1, 10];
      }

      var range = rangeArray.map(x => parseInt(x)),
          spread = range[1] - range[0],
          fromAyah = this.getStore(AudioplayerStore).getCurrentAyah(),
          toAyah = fromAyah + spread;

      // this.transitionTo(
      //     '/' + this.getParams().surahId + '/' + fromAyah + '-' + toAyah);

      // AyahsActions.getAyahs(this.context.dispatcher, {
      //     surahId: this.getParams().surahId,
      //     from: fromAyah,
      //     to: toAyah,
      //     shouldReplace: true
      // });
      return;

    }

    this.setupAudio(currentAyah);
  }

  changeOffset(fraction) {
    this.setState({
      progress: fraction * 100,
      currentTime: fraction * this.state.currentAudio.duration
    });

    this.state.currentAudio.currentTime = fraction *
      this.state.currentAudio.duration;
  }

  setupAudio() {
    console.log(this.props.currentAyah);
    if (this.state.playing) {
      this.pause();
    }

    // Default current time to zero. This will change
    this.props.currentAudio.currentTime = 0;

    this.props.currentAudio.addEventListener('timeupdate', () => {
      let progress = (this.props.currentAudio.currentTime /
        this.props.currentAudio.duration * 100);
      this.setState({
          progress: progress
      });
    }, false);

    this.props.currentAudio.addEventListener('ended', () => {
      if (this.state.shouldRepeat === true) {
        this.context.executeAction(AudioplayerActions.changeAyah, {
          ayah: this.props.currentAyah.ayah,
          shouldPlay: true
        });
      }
      else {
        this.props.currentAudio.pause();
        this.context.executeAction(AudioplayerActions.changeAyah, {
          ayah: this.props.currentAyah.ayah + 1,
          shouldPlay: true
        });
      }
    }, false);

    this.props.currentAudio.addEventListener('play', () => {
      let currentTime = (
        this.state.progress / 100 * this.props.currentAudio.duration
      );

      this.setState({
        currentTime: currentTime
      });
    }, false);


    if (this.context.getStore(AudioplayerStore).getShouldPlay()) {
      this.play();
    }
  }

  startStopPlayer(e) {
    e.preventDefault();
    console.log('Audio was playing:', this.state.playing);

    if (this.state.playing) {
        this.pause();
    } else {
        this.play();
    }
  }

  pause() {
    this.setState({
        playing: false
    });
    this.props.currentAudio.pause();
  }

  play() {
    this.setState({
        playing: true
    });

    this.props.currentAudio.play();
  }

  repeatSwitch() {
    this.setState({
      shouldRepeat: !this.state.shouldRepeat
    });
  }

  forwardAyah(e) {
    e.preventDefault();
    let wasPlaying = this.state.playing;

    this.pause();

    this.context.executeAction(AudioplayerActions.changeAyah, {
      ayah: this.props.currentAyah.ayah + 1,
      shouldPlay: wasPlaying
    });
  }

  // UI components
  playStopButtons() {
    var icon;
    if (this.state.playing) {
        icon = <i className="ss-icon ss-pause" />;
    } else {
        icon = <i className="ss-icon ss-play" />;
    }
    return (
      <li className="audioplayer-controls">
        <a className="buttons" onClick={this.startStopPlayer.bind(this)} href>
          {icon}
        </a>
      </li>
    );
  }

  forwardButton() {
    return (
      <li className="text-center audioplayer-controls">
        <a className="buttons" onClick={this.forwardAyah.bind(this)}>
          <i className="ss-icon ss-skipforward" />
        </a>
      </li>
    );
  }

  repeatButton() {
    var classes = classNames({
        repeat: this.state.shouldRepeat
    });

    return (
      <li className="text-center audioplayer-repeat">
        <a>
          <input type="checkbox" id="repeat" />
          <label htmlFor="repeat"
                 onClick={this.repeatSwitch}
                 className={classes}>
            <i className="ss-icon ss-repeat" />
          </label>
        </a>
      </li>
    );
  }

  render() {
    var currentAyahId = this.props.currentAyah ?
      this.props.currentAyah.ayah : '';

    return (
      <div className="audioplayer col-md-3 border-right">
        <ul className="list-inline audioplayer-options">
           <VersesDropdown ayahs={this.props.surah ? this.props.surah.ayat : 1}
                           currentAyah={currentAyahId}/>
          {this.playStopButtons()}
          {this.forwardButton()}
          {this.repeatButton()}
        </ul>
        <div className="audioplayer-wrapper">
          <AudioplayerTrack progress={this.state.progress}
                            changeOffset={this.changeOffset}/>
        </div>
      </div>
    );
  }

}

Audioplayer.contextTypes = {
  getStore: React.PropTypes.func.isRequired,
  executeAction: React.PropTypes.func.isRequired
};

Audioplayer = connectToStores(Audioplayer, [SurahsStore, AyahsStore, AudioplayerStore], function(stores, props) {
  return {
    surah: stores.SurahsStore.getSurah(),
    ayahs: stores.AyahsStore.getAyahs(),
    currentAudio: stores.AudioplayerStore.getCurrentAudio(),
    currentAyah: stores.AudioplayerStore.getCurrentAyah()
  }
});

export default Audioplayer;
