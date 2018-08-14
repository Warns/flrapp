/* STYLES */
'use strict';
var React = require('react-native');
module.exports = {
  // Constants
  API_KEY: '1b9b737f-5582-c8d7-f535-b9750bdeeb90',
  CLIENT: {

    // Here we store all session data.
    // .Auth {}
    // .Login {}

  },

  // FUNCTIONS

  // this is the fetch function you call from outside.
  fetch: function (url, data, callback) {
    if (this.CLIENT.Auth != null) {
      var d = new Date(),
        now = d.getTime(), //- d.getTimezoneOffset() * 60000,
        start = new Date(this.CLIENT.Auth.issue),
        expires = start.getTime() + this.CLIENT.Auth.expires_in * 1000;

      if ((expires - now) / 60 / 60 / 1000 > 6) { // if less that 6 hours is remained renew token.

        console.log("reused current token, expires in: ", (expires - now) / 60 / 60 / 1000);
        this._fetchURL(url, data, callback);

      }
      else {
        console.log('token needs update');
        this._requestAccessToken(url, data, callback);
      }
    }
    else {
      console.log('there was no token');
      this._requestAccessToken(url, data, callback);
    }
  },

  // calls any url and returns the result.
  _fetchURL: function (query, data, callback) {

    var _this = this;

    // if there is token use headers with token info.
    let HEADERS = this.CLIENT.Auth != null ?
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Session': this.CLIENT.Auth.session,
        'Authorization': this.CLIENT.Auth.token_type + ' ' + this.CLIENT.Auth.access_token
      } :
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

    // Logging the outgoing request details.
    _this._log({
      url: query,
      headers: HEADERS,
      body: data,
      method: 'POST',
    });

    fetch(query, {
      method: 'POST',
      headers: HEADERS,
      body: data,
    })
      .then((response) => {
        // login olduktan sonra kişinin session bilgisi headerdan dönüyor. Bu bilgiyi global session bilgisine yazdırmak 
        const header = response.headers || {},
          map = header.map || {},
          session = map.session || ''; console.log('session', session[0]);
        if (session != '' && _this.CLIENT.Auth)
          _this.CLIENT.Auth.session = session[0];
        
        return response.json();
      })
      .then(function (json) {

        // logging the incoming response.
        _this._log(json);
        return callback(json);
      })
      .catch(error => callback('error', error));
  },

  _requestAccessToken: function (url, data, callback) {

    var _this = this;

    this._fetchURL(
      "https://www.flormar.com.tr/webapi/v3/User/getToken",
      JSON.stringify({
        "password": globals.API_KEY,
        "grant_type": "password"
      }),

      // access token result handler
      (answer) => {
        if (answer === 'error') {
          console.log('fatalllll error: could not get access token');
        }
        else {
          if (answer.status == 200) {
            this.CLIENT.Auth = answer.data;
            this.CLIENT.Auth.issue = new Date();

            console.log('token renewed successfully!');
            this._fetchURL(url, data, callback);

            this.refreshSecureStorage();

          }
          else {
            console.log('error getting access token');
          }
        }
      }
    );
  },

  refreshSecureStorage: function () {
    this.setSecureStorage('__USER__', JSON.stringify(this.CLIENT));
  },

  // update this function according to your log service.
  _log: function (data) {

    fetch('http://localhost:8888/log/?v=' + JSON.stringify(data), {
      method: 'POST',
    })
      .then(function (response) { return null; })
      .catch(function (error) { console.log('error', error); });

  },

  // set encrypted local async storage
  setSecureStorage: async function (key, value) {
    try {
      await Expo.SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Error saving data
    }
  },

  // get encrypted local async storage
  getSecureStorage: async function (key, callback) {
    try {
      const value = await Expo.SecureStore.getItemAsync(key);
      if (value !== null) {
        callback(value);
      } else {
        callback('no');
      }
    } catch (error) {
      console.log(error + 'hola');
    }
  },

};
