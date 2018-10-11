// Core
import React, { Component } from 'react';

// Components
import Task from 'components/Task'

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

const tasksList = [

];

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
              <main>
                <header>
                  <h1>Планировщик задач</h1>
                  <input type="search" placholder="Посик" />
                </header>
                <section>
                  <form>
                    <input type="text" maxLength="50" placholder="Описaние моей новой задачи" />
                    <button type="button">Добавить задачу</button>
                  </form>
                  <div>
                    <ul>
                        <Task />
                    </ul>
                  </div>
                </section>
                <footer>
                  <div>
                    SVG
                  </div>
                  <span className = {Styles.completeAllTasks}>Все задачи выполнены</span>
                </footer>
              </main>
            </section>
        );
    }
}
