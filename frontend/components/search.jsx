var React = require("react");
var SearchResultsStore = require("./../stores/search_result_store");
var ApiUtil = require('../util/api_util');

var Search = React.createClass({

  getInitialState: function () {
    return { query: "" };
  },

  componentDidMount: function () {
    this.storeListener = SearchResultsStore.addListener(this._onChange);
  },

  componentWillUnmount: function () {
    this.storeListener.remove();
  },

  _onChange: function () {
    this.setState({results: SearchResultsStore.all()});
  },

  handleInputChange: function (e) {
    var query = e.currentTarget.value;
    this.setState({ query: query }, function () {
      if (query.length > 2) {
        this.search();
      }
    }.bind(this));
  },

  search: function (e) {
    ApiUtil.search(this.state.query, 1);
  },

  nextPage: function () {
    var meta = SearchResultsStore.meta();
    ApiUtil.search(meta.query, meta.page + 1);
  },

  resultLis: function () {
    return SearchResultsStore.all().map(function (result) {
      if (result._type === "Question") {
        return (
          <li key={ result.id }>
            Question: { result.title }
          </li>
        );

      } else if (result._type === "Topic") {
        return (
          <li key={ result.id }>
            Topic: { result.name }
          </li>
        );

      }	else {
        return (
          <li key={ result.id }>
            Profile: { result.username }
          </li>
        );
      }
    }.bind(this));
  },

  render: function () {
    var meta = SearchResultsStore.meta();
    return (
      <article className="search-result-list group">
        <input type="text" onChange={ this.handleInputChange } />
        <button
					className="search-button"
					onClick={ this.search }>
					GO
				</button>

        <nav>
          Displaying page { meta.page } of { meta.total_pages }
          <button onClick={ this.nextPage }>NEXT PAGE</button>
        </nav>

        <ul>
          { this.resultLis() }
        </ul>
      </article>
    );
  }

});

module.exports = Search;