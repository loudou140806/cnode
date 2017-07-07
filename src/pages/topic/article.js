import React, { Component } from 'react';

class Article extends Component {
    componentDidMount() {
        const { fetchTopicAction, state, location } = this.props;
        // fetchTopicAction.fetchTopic({
        //     url: '/api/v1' + location.pathname,
        //     params: {
        //         mdrender: true
        //     }
        // });
    }
    render() {
        return (
            <div className="article">article</div>
        );
    }
}

export default Article;