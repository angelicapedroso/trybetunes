import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addSong, getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';
import OnLoad from './OnLoad';

export default class MusicCard extends Component {
  constructor() {
    super();

    this.state = {
      checkedDisabled: false,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.restoreSong = this.restoreSong.bind(this);
  }

  componentDidMount() {
    this.restoreSong();
  }

  async handleChange() {
    const { musicInfo } = this.props;
    const { checkedDisabled } = this.state;
    this.setState({ loading: true });
    const dataAdd = await addSong(musicInfo);
    const dataRemove = await removeSong(musicInfo);
    if (dataAdd && checkedDisabled) {
      return this.setState({ loading: false, checkedDisabled: false });
    }
    if (dataRemove) {
      return this.setState({ loading: false, checkedDisabled: true });
    }
  }
  // consulta neste repositório para resolução do requisito 11: https://github.com/tryber/sd-016-a-project-trybetunes/pull/54/commits

  async restoreSong() {
    const { trackId } = this.props;
    const data = await getFavoriteSongs();
    if (data.some((music) => music.trackId === trackId)) {
      this.setState({ checkedDisabled: true });
    }
  }

  render() {
    const { trackName, previewUrl, trackId } = this.props;
    const { checkedDisabled, loading } = this.state;
    return (
      <div>
        { loading ? (
          <OnLoad />
        ) : (
          <div>
            <p>{ trackName }</p>
            <audio data-testid="audio-component" src={ previewUrl } controls>
              <track kind="captions" />
              O seu navegador não suporta o elemento
              <code>audio</code>
            </audio>

            <label htmlFor="favorite">
              Favorita
              <input
                type="checkbox"
                name="favorite"
                data-testid={ `checkbox-music-${trackId}` }
                onChange={ this.handleChange }
                checked={ checkedDisabled }
              />
            </label>
          </div>
        ) }
      </div>
    );
  }
}

MusicCard.propTypes = {
  trackName: PropTypes.string.isRequired,
  previewUrl: PropTypes.string.isRequired,
  musicInfo: PropTypes.shape().isRequired,
  trackId: PropTypes.number.isRequired,
};
