import React, { Component } from 'react'
import Comment from './comment'

class CommentList extends Component {
    static defaultProps = {
        commentList: []
    }
    render() {
        return (
            <div>
                {this.props.comments.map((comment, i) =>
                    <Comment comment={comment} key={i} />
                )}
            </div>
        )
    }
}

export default CommentList