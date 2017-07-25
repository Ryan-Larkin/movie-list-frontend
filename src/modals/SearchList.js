import React from 'react';
import onClickOutside from 'react-onclickoutside';

import SearchItem from '../SearchItem';

import './SearchList.css';

export default onClickOutside(class SearchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickOutside = () => {
    this.props.closeSearchModal();
  }

  render() {
    return (
      <div className="search-list" onClick={this.addThisMovie}>
        <div className="search-title">Movies Found</div>

        <div className="search-items scrollbar style-3">
          {
            this.props.searchList.map((fm, index) => (
              <SearchItem
                key={fm.apiID}
                id={fm.index}
                apiID={fm.apiID}
                title={fm.title}
                poster={fm.poster}
                overview={fm.overview}
                updateMovies={this.props.updateMovies}
                closeSearchModal={this.props.closeSearchModal}
                toastAlert={this.props.toastAlert}
              />
            ))
          }
        </div>
      </div>
    );
  }
});
