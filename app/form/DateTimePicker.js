import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Container } from './';

const Utils = require('root/app/helper/Global.js');

class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        let { value = '', maxDate = 0 } = this.props.data;
        value = Utils.subtractDate({ year: maxDate })['dateFormat'] || '';
        this.state = {
            value: value
        }
    }

    _callback = () => {
        const { title, id, validation, customFormat } = this.props.data;
        const { callback } = this.props;
        let value = this.state.value;
        if (customFormat)
            value = customFormat(value);

        if (callback)
            callback({ key: id, title: title, value: value, validation: validation });
    }

    _getMinDate = () => {
        const { minDate = -100 } = this.props.data;
        return Utils.subtractDate({ year: minDate, })['dateFormat'] || '-';
    }

    _getMaxDate = () => {
        const { maxDate = 0 } = this.props.data;
        return Utils.subtractDate({ year: maxDate })['dateFormat'] || '-';
    }

    render() {
        const {
            title,
            error = false,
            errorMsg = null,
            dateFormat = 'DD.MM.YYYY',
            disabled = false
        } = this.props.data;

        const {
            containerStyle = {},
            wrapperStyle = {},
            control = false,
        } = this.props;

        if (control)
            this._callback();

        return (
            <Container
                containerStyle={{ ...containerStyle }}
                wrapperStyle={{ ...wrapperStyle }}
                titleShow={true}
                title={title}
                error={error}
                errorMsg={errorMsg}>
                <DatePicker
                    disabled={disabled}
                    style={{ flex: 1, }}
                    date={this.state.value}
                    mode="date"
                    format={dateFormat}
                    minDate={this._getMinDate()}
                    maxDate={this._getMaxDate()}
                    confirmBtnText="Tamam"
                    cancelBtnText="İptal"
                    placeholder=""
                    onDateChange={(date) => { this.setState({ value: date }) }}
                    iconSource={require("../../assets/icons/calendar.png")}
                    customStyles={{
                        dateIcon: {
                            marginRight: 0,
                        },
                        dateInput: {
                            borderWidth: 0,
                            alignItems: 'flex-start'
                        },
                        dateText: {
                            color: '#000000',
                            fontSize: 16,
                        },
                        placeholderText: {
                            color: '#000000',
                            fontSize: 16,
                        }
                    }}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({

});

export { DateTimePicker };