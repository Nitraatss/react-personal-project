// Core
import React, { Component } from "react";
import moment from "moment";

// Components
import Task from "components/Task";
import Spinner from "components/Spinner";

// Instruments
import { getUniqueID } from "instruments/";
import Styles from "./styles.m.css";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Assets
import Checkbox from "theme/assets/Checkbox";

const MAXIMUM_TASK_LENGTH = 50;

export default class Scheduler extends Component {
    state = {
        spinnerState:  false,
        newTaskText:   "",
        previousTasks: {
            filled:    false,
            tasksList: [],
        },
        tasksList: [],
    };

    componentDidMount () {
        this._fetchTasks();
    }

    _fetchTasks = async () => {
        this._changeSpinnerState(true);

        try {
            const recivedTasks = await api.fetchTasks();

            this.setState({
                tasksList: recivedTasks,
            });
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    _changeSpinnerState = (state) => {
        this.setState({
            spinnerState: state,
        });
    };

    _changeTaskCompleteState = async (taskId) => {
        this._changeSpinnerState(true);

        try {
            const updatedTasks = this.state.tasksList;
            const changedTask = [];

            updatedTasks.forEach((task) => {
                if (task.id === taskId) {
                    task.completed = !task.completed;
                    changedTask.push(task);
                }
            });

            if (await api.updateTask(changedTask)) {
                this.setState({
                    tasksList: updatedTasks,
                });
            }
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    _changeTaskFavouriteState = async (taskId) => {
        this._changeSpinnerState(true);

        try {
            const updatedTasks = this.state.tasksList;
            const changedTask = [];

            updatedTasks.forEach((task) => {
                if (task.id === taskId) {
                    task.favorite = !task.favorite;
                    changedTask.push(task);
                }
            });

            if (await api.updateTask(changedTask)) {
                this.setState({
                    tasksList: updatedTasks,
                });
            }
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    _createTask = async (taskText) => {
        this._changeSpinnerState(true);
        try {
            const updatedTasks = this.state.tasksList;

            const newTask = {
                id:        getUniqueID(),
                created:   moment().unix(),
                completed: false,
                favorite:  false,
                message:   taskText,
            };

            const sendedTask = await api.createTask(taskText);

            updatedTasks.push(sendedTask);

            this.setState({
                tasksList: updatedTasks,
            });
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    _updateNewTaskText = (evt) => {
        this.setState({
            newTaskText: evt.target.value,
        });
    };

    _submitForm = (evt) => {
        evt.preventDefault();

        const { newTaskText } = this.state;

        if (!newTaskText.split(" ").join("").length) {
            return null;
        }

        this._createTask(newTaskText);

        this.setState({
            newTaskText: "",
        });
    };

    _submitFormOnEnter = (evt) => {
        const enterKey = evt.key === "Enter";

        if (enterKey) {
            this._submitForm(evt);
        }
    };

    _completeAllTasks = async () => {
        this._changeSpinnerState(true);
        try {
            const updatedTasks = this.state.tasksList;

            updatedTasks.forEach((task) => {
                task.completed = true;
            });

            if (await api.updateTask(updatedTasks)) {
                this.setState({
                    tasksList: updatedTasks,
                });
            }
        } catch ({ message }) {
            console.log(message);
        }
        this._changeSpinnerState(false);
    };

    _searchTasks = (evt) => {
        const searchableTaskMessage = evt.target.value.toLowerCase();
        const currentTasks = this.state.tasksList;

        if (searchableTaskMessage) {
            if (!this.state.previousTasks.filled) {
                this.setState({
                    previousTasks: {
                        filled:    true,
                        tasksList: currentTasks,
                    },
                });
            }

            const findedTasks = currentTasks.filter((task) => {
                const message = task.message.toLowerCase();
                let pos = -1;

                while (
                    (pos = message.indexOf(searchableTaskMessage, pos + 1)) !==
                    -1
                ) {
                    return true;
                }
            });

            this.setState({
                tasksList: findedTasks,
            });
        }

        if (!searchableTaskMessage && this.state.previousTasks.filled) {
            const previuosTasks = this.state.previousTasks.tasksList;

            this.setState({
                tasksList:     previuosTasks,
                previousTasks: {
                    filled:    false,
                    tasksList: [],
                },
            });
        }
    };

    _searchSubmit = (evt) => {
        evt.preventDefault();
    };

    _deleteTask = async (taskId) => {
        this._changeSpinnerState(true);
        try {
            const taskDeleted = api.removeTask(taskId);

            if (taskDeleted) {
                const updatedTasks = this.state.tasksList.filter(
                    (task) => task.id !== taskId
                );

                this.setState({
                    tasksList: updatedTasks,
                });
            }
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    _updateTask = async (taskId, newMessage) => {
        this._changeSpinnerState(true);
        try {
            const updatedTasks = this.state.tasksList;

            if (newMessage.split(" ").join("").length) {
                const changedTask = [];

                updatedTasks.forEach((task) => {
                    if (task.id === taskId) {
                        task.message = newMessage;
                        changedTask.push(task);
                    }
                });

                if (await api.updateTask(changedTask)) {
                    this.setState({
                        tasksList: updatedTasks,
                    });
                }
            } else {
                this._deleteTask(taskId);
            }
        } catch ({ message }) {
            console.log(message);
        }

        this._changeSpinnerState(false);
    };

    render () {
        const { tasksList, newTaskText, spinnerState } = this.state;

        let allTasksCompleted = true;

        tasksList.forEach((task) => {
            if (task.completed === false) {
                allTasksCompleted = false;
            }
        });

        const tasksJSX = tasksList.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _changeTaskCompleteState = { this._changeTaskCompleteState }
                    _changeTaskFavouriteState = { this._changeTaskFavouriteState }
                    _deleteTask = { this._deleteTask }
                    _updateTask = { this._updateTask }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            onChange = { this._searchTasks }
                            onSubmit = { this._searchSubmit }
                            placeholder = 'Поиск'
                            type = 'search'
                        />
                        <Spinner spinnerState = { spinnerState } />
                    </header>
                    <section>
                        <form
                            onKeyDown = { this._submitFormOnEnter }
                            onSubmit = { this._submitForm }>
                            <input
                                maxLength = { MAXIMUM_TASK_LENGTH }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskText }
                                onChange = { this._updateNewTaskText }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{tasksJSX}</ul>
                        </div>
                    </section>
                    <footer>
                        <div>
                            <Checkbox
                                color1 = { "#3b8ef3" }
                                color2 = { "#ffff" }
                                onClick = { this._completeAllTasks }
                                checked = { allTasksCompleted }
                            />
                        </div>
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
