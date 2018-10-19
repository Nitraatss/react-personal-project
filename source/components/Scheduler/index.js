// Core
import React, { Component } from "react";
import moment from "moment";

// Components
import Task from "components/Task";

// Instruments
import { getUniqueID } from "instruments/";
import Styles from "./styles.m.css";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Assets
import Checkbox from "theme/assets/Checkbox";

const MAXIMUM_TASK_LENGTH = 50;

export default class Scheduler extends Component {
    state = {
        newTaskText:   "",
        previousTasks: {
            filled:    false,
            tasksList: [],
        },
        tasksList: [
            {
                id:        getUniqueID(),
                date:      moment().unix(),
                completed: false,
                favorite:  false,
                message:   "Задача1",
            },
            {
                id:        getUniqueID(),
                date:      moment().unix(),
                completed: false,
                favorite:  false,
                message:   "Задача2",
            },
            {
                id:        getUniqueID(),
                date:      moment().unix(),
                completed: true,
                favorite:  true,
                message:   "Задача3",
            },
            {
                id:        getUniqueID(),
                date:      moment().unix(),
                completed: true,
                favorite:  false,
                message:   "Задача4",
            },
            {
                id:        getUniqueID(),
                date:      moment().unix(),
                completed: false,
                favorite:  true,
                message:   "Задача5",
            }
        ],
    };

    _changeTaskCompleteState = (taskId) => {
        const updatedTasks = this.state.tasksList;

        updatedTasks.forEach((task) => {
            if (task.id === taskId) {
                task.completed = !task.completed;
            }
        });

        this.setState({
            tasksList: updatedTasks,
        });
    };

    _changeTaskFavouriteState = (taskId) => {
        const updatedTasks = this.state.tasksList;

        updatedTasks.forEach((task) => {
            if (task.id === taskId) {
                task.favorite = !task.favorite;
            }
        });

        this.setState({
            tasksList: updatedTasks,
        });
    };

    _createTask = (taskText) => {
        const updatedTasks = this.state.tasksList;

        const newTask = {
            id:        getUniqueID(),
            created:   moment().unix(),
            completed: false,
            favorite:  false,
            message:   taskText,
        };

        updatedTasks.push(newTask);

        this.setState({
            tasksList: updatedTasks,
        });
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

    _completeAllTasks = () => {
        const updatedTasks = this.state.tasksList;

        updatedTasks.forEach((task) => {
            task.completed = true;
        });

        this.setState({
            tasksList: updatedTasks,
        });
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

    _deleteTask = (taskId) => {
        const updatedTasks = this.state.tasksList.filter(
            (task) => task.id !== taskId
        );

        this.setState({
            tasksList: updatedTasks,
        });
    };

    _updateTask = (taskId, newMessage) => {
        const updatedTasks = this.state.tasksList;

        if (newMessage.split(" ").join("").length) {
            updatedTasks.forEach((task) => {
                if (task.id === taskId) {
                    task.message = newMessage;
                }
            });

            this.setState({
                tasksList: updatedTasks,
            });
        } else {
            this._deleteTask(taskId);
        }
    };

    render () {
        const { tasksList } = this.state;
        const { newTaskText } = this.state;

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
