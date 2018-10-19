// Core
import React, { PureComponent } from "react";
import { string, bool, func } from "prop-types";

// Instruments
import Styles from "./styles.m.css";

// Assets
import Star from "theme/assets/Star";
import Remove from "theme/assets/Remove";
import Edit from "theme/assets/Edit";
import Checkbox from "theme/assets/Checkbox";

const MAXIMUM_TASK_LENGTH = 50;

export default class Task extends PureComponent {
    static propTypes = {
        message:                   string.isRequired,
        favorite:                  bool.isRequired,
        completed:                 bool.isRequired,
        id:                        string.isRequired,
        _changeTaskCompleteState:  func.isRequired,
        _changeTaskFavouriteState: func.isRequired,
        _deleteTask:               func.isRequired,
        _updateTask:               func.isRequired,
    };

    state = {
        inputStatus:            true,
        currentMessage:         this.props.message,
        previousMessageVersion: {
            filled:  false,
            message: "",
        },
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _changeTaskFavouriteState = () => {
        const { id, _changeTaskFavouriteState } = this.props;

        _changeTaskFavouriteState(id);
    };

    _changeTaskCompleteState = () => {
        const { id, _changeTaskCompleteState } = this.props;

        _changeTaskCompleteState(id);
    };

    _deleteTask = () => {
        const { id, _deleteTask } = this.props;

        _deleteTask(id);
    };

    _updateTask = (newMessage) => {
        const { id, _updateTask } = this.props;

        this._changeInputStatus();
        _updateTask(id, newMessage);
    };

    _changeInputStatus = () => {
        const currentInputStatus = this.state.inputStatus;

        this.setState({
            inputStatus: !currentInputStatus,
        });
    };

    _changeTask = (evt) => {
        const { currentMessage } = this.state;

        if (!this.state.previousMessageVersion.filled) {
            this.setState({
                previousMessageVersion: {
                    filled:  true,
                    message: currentMessage,
                },
            });
        }

        this.setState({ currentMessage: evt.target.value });
    };

    _changeTaskOnButton = (evt) => {
        const enterKey = evt.key === "Enter";
        const escapeKey = evt.key === "Escape";

        if (enterKey) {
            this._submitTaskUpdate();
        }

        if (escapeKey) {
            this._cancelTaskUpdate();
        }
    };

    _submitTaskUpdate = () => {
        const { currentMessage } = this.state;

        this._updateTask(currentMessage);
    };

    _cancelTaskUpdate = () => {
        if (this.state.previousMessageVersion.filled) {
            const previousMessage = this.state.previousMessageVersion.message;

            this.setState({
                currentMessage: previousMessage,
            });
        }
        this._changeInputStatus();
    };

    componentDidUpdate () {
        if (!this.state.inputStatus) {
            this.myInp.focus();
        }
    }

    render () {
        const { favorite, completed } = this.props;
        const { currentMessage } = this.state;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.toggleTaskCompletedState }>
                        <Checkbox
                            onClick = { this._changeTaskCompleteState }
                            color1 = { "#3b8ef3" }
                            color2 = { "#ffff" }
                            checked = { completed }
                        />
                    </div>
                    <input
                        disabled = { this.state.inputStatus }
                        maxLength = { MAXIMUM_TASK_LENGTH }
                        ref = { (ip) => this.myInp = ip }
                        type = 'text'
                        value = { currentMessage }
                        onChange = { this._changeTask }
                        onKeyDown = { this._changeTaskOnButton }
                    />
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.toggleTaskFavoriteState }>
                        <Star
                            onClick = { this._changeTaskFavouriteState }
                            checked = { favorite }
                            color1 = { "#3b8ef3" }
                            color3 = { "#3b8ef3" }
                        />
                    </div>
                    <div className = { Styles.updateTaskMessageOnClick }>
                        <Edit
                            color1 = { "#3b8ef3" }
                            onClick = { this._changeInputStatus }
                        />
                    </div>
                    <div>
                        <Remove color1 = { "#3b8ef3" } onClick = { this._deleteTask } />
                    </div>
                </div>
            </li>
        );
    }
}
