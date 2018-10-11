// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Edit from 'theme/assets/Edit';
import Checkbox from 'theme/assets/Checkbox';

export default class Task extends PureComponent {
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

    render () {
        return (
          <li className = { Styles.task }>
            <div className = { Styles.content }>
              <div className = { Styles.toggleTaskCompletedState }>
                <Checkbox />
              </div>
              <input type="text" maxlength="50" value="loled" disabled />
            </div>
            <div className = { Styles.actions }>
              <div className = { Styles.toggleTaskFavoriteState }>
                <Star />
              </div>
              <div className = { Styles.updateTaskMessageOnClick }>
                <Edit />
              </div>
              <div>
                <Remove />
              </div>
            </div>
          </li>
        );
    }
}
