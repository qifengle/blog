import React, { Component } from 'react'
import { Avatar, Col, Input } from 'antd';
const InputGroup = Input.Group;
import './index.scss';

class Comment extends Component {
    getRandomColor() {
        var c = '#';
        var cArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < 6; i++) {
            var cIndex = Math.round(Math.random() * 15);
            c += cArray[cIndex];
        }
        return c;
    }
    getRandomName() {
        var c = '';
        var cArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
        var cIndex = Math.round(Math.random() * 15);
        c = cArray[cIndex];
        return c;
    }
    render() {
        console.log(this.props.comment);
        return (
            <div className='comment'>
                <InputGroup size="large">
                    <Col span={2}>
                        <Avatar style={{ backgroundColor: this.getRandomColor() }} size="large">{this.getRandomName()}</Avatar>
                    </Col>
                    <Col span={20}>
                        <div>
                            {/* <span>{this.props.comment.city||''}用户：</span> */}
                            <span>{this.props.comment.time||''}</span>
                        </div>
                        <div>
                            <p >{this.props.comment.comment}</p>
                        </div>
                    </Col>
                    {/* <Col span={8}>
                        <p >{this.props.comment.comment}</p>
                    </Col> */}
                </InputGroup>
            </div>
        )
    }
}

export default Comment