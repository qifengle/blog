import { Icon, Button } from 'antd';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { getArticleDetail } from './actions';
import './index.scss';
import { Input } from 'antd';
import CommentLists from './commentList'
const { TextArea } = Input;
export const stateKey = 'detail';
let comLists = [];

class ArticleDetail extends Component {

	constructor() {
		super()
		this.state = {
			comment: '',
			commentList: [],
			contentnum: 0
		}
	}
	componentDidMount() {
		let style = document.createElement("link");
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', '/static/syntaxhighlighter/styles/shCoreFadeToGrey.css')
		document.getElementsByTagName('head')[0].appendChild(style);

		if (typeof SyntaxHighlighter == 'undefined') {
			let scriptArr = [
				"shBrushCss.js",
				"shBrushPhp.js",
				"shBrushXml.js",
				"shBrushJScript.js",
				"shBrushPlain.js",
				"shBrushBash.js",
				"shBrushCpp.js"
			];

			let script = document.createElement("script");
			script.setAttribute('src', '/static/syntaxhighlighter/scripts/shCore.js');
			document.getElementsByTagName('head')[0].appendChild(script);

			script.onload = script.onreadystatechange = function () {
				if (!this.readyState || this.readyState == 'complete') {
					SyntaxHighlighter._count = 0;

					scriptArr.forEach((scriptName) => {
						script = document.createElement("script");
						let url = `/static/syntaxhighlighter/scripts/${scriptName}`;

						script.setAttribute('src', url);
						document.getElementsByTagName('head')[0].appendChild(script);

						script.onload = script.onreadystatechange = function () {
							if (!this.readyState || this.readyState == 'complete') {
								SyntaxHighlighter._count++;

								if (SyntaxHighlighter._count >= 7) {
									SyntaxHighlighter.all();
									SyntaxHighlighter.highlight();
								}
							}
						}
					});
				}
			}
		}

		let { id, getDetail } = this.props;
		getDetail(id);
		this.getComent();
	}

	componentWillReceiveProps(nextProps) {
		let { id, getDetail } = this.props;

		if (id != nextProps.id) {
			getDetail(nextProps.id);
		}
	}

	componentDidUpdate() {
		if (typeof SyntaxHighlighter != 'undefined' && SyntaxHighlighter._count == 7) {
			SyntaxHighlighter.highlight();
		}
	}

	getComent() {
		let { id } = this.props;
		fetch('/get-comment?&id=' + id, {
			credentials: 'include'
		}).then((res) => {
			res.json().then((data) => {
				comLists = data;
				this.setState({ commentList: data, contentnum: comLists.length });
			}).catch((error) => {
				this.setState({ error: "Load Failed" });
			})

		}).catch((error) => {
			this.setState({ error: "Load Failed" });
		});
	}

	comment() {
		let { id } = this.props;
		if (this.state.comment != "") {
			fetch('/post-comment?comment=' + this.state.comment + '&id=' + id, {
				credentials: 'include'
			}).then((res) => {
				res.json().then((data) => {
					console.log(data);
					if (data.result == true) {
						comLists.unshift(data);
						this.setState({ commentList: comLists, comment: '', contentnum: comLists.length });
					}
				}).catch((error) => {
					this.setState({ error: "Load Failed" });
				})

			}).catch((error) => {
				this.setState({ error: "Load Failed" });
			});
		}
		else {
			alert("请输入评论");
		}

	}

	handlecommentChange(event) {
		this.setState({
			comment: event.target.value
		})
	}

	render() {
		const { title, body, tag, theme, created_at, updated_at, views, type } = this.props.detail;
		console.log(this.state.commentList);
		return (
			<div className="article-detail">
				<h3 className="blog-title">
					{
						type == 2
							? "[转]"
							: type == 3
								? "[译]"
								: ""
					}
					{title}
				</h3>
				<div className="blog-top">
					<span>
						Last Modified : &nbsp;
						{
							updated_at
								? updated_at
								: created_at
						}
					</span>
					<span className="spliter"></span>
					<span>{theme}</span>
					<span className="spliter"></span>
					<span><Icon type="tag" />&nbsp; {tag}</span>
					<span className="spliter"></span>
					<span>浏览&nbsp; {views}</span>
					<span className="spliter"></span>
					<span>评论&nbsp; {this.state.contentnum}</span>
				</div>
				<div
					className="blog-content"
					dangerouslySetInnerHTML={{ __html: body }}>
				</div>
				<div>
					<span className="commentText">留言&nbsp;</span>
					<TextArea rows={4} value={this.state.comment}
						onChange={this.handlecommentChange.bind(this)} />
					<Button className="commentbtn" onClick={this.comment.bind(this)} type="primary">提交</Button>
				</div>
				<div>
					<span className="commentText">评论&nbsp;</span>
					<CommentLists className="commentbtn" comments={this.state.commentList} />
				</div>
			</div>
		)
	}
}

ArticleDetail.propTypes = {
	getDetail: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		id: state[stateKey].id || null,
		detail: state[stateKey]
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getDetail: (id) => {
			dispatch(getArticleDetail(id))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetail);