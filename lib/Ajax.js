"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var privateAttributesOfAjax = new WeakMap();
var privateMethodsOfAjax = {
    _createUrlString: function _createUrlString(instanceOfAjax, url, method, data) {
        if (method.toUpperCase() === "GET" && data && Object.keys(data).length) {
            return url + "?" + Ajax.convertDataToString(data);
        }

        return url;
    },
    _sendRequest: function _sendRequest(instanceOfAjax) {
        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/";
        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "get";
        var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        var request = privateMethodsOfAjax._createRequestObject(instanceOfAjax, privateMethodsOfAjax._createUrlString(instanceOfAjax, url, method, data), method);

        /**
         * If the request is POST then we also bundle the passed data too
         */
        if (method.toUpperCase() === "POST") {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            var token = document.querySelector("meta[name='_csrf']").getAttribute("content");
            var header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");

            request.setRequestHeader(header, token);

            if (data !== null) {
                request.send(Ajax.convertDataToString(data));
            } else {
                request.send();
            }
        } else {
            request.send();
        }
    },
    _createRequestObject: function _createRequestObject(instanceOfAjax, url, method) {
        var request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);

        /**
         * When the request errors
         */
        request.onerror = function () {
            privateAttributesOfAjax.get(instanceOfAjax)._response = request.response;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = privateAttributesOfAjax.get(instanceOfAjax)._failureEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var event = _step.value;

                    event(privateAttributesOfAjax.get(instanceOfAjax)._response);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            privateAttributesOfAjax.get(instanceOfAjax)._status = request.status || 408;
        };

        /**
         * When the request loads
         */
        request.onload = function () {
            privateAttributesOfAjax.get(instanceOfAjax)._status = request.status;
            privateAttributesOfAjax.get(instanceOfAjax)._response = request.responseText;
            if (instanceOfAjax.isSuccess()) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = privateAttributesOfAjax.get(instanceOfAjax)._successEvents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var event = _step2.value;

                        event(privateAttributesOfAjax.get(instanceOfAjax)._response);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else {
                request.onerror();
            }
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = privateAttributesOfAjax.get(instanceOfAjax)._completeEvents[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _event = _step3.value;

                    _event(privateAttributesOfAjax.get(instanceOfAjax)._response);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            privateAttributesOfAjax.get(instanceOfAjax)._complete = true;
        };

        return request;
    }
};

/**
 * A simple AJAX class that creates an AJAX request and has jquery-like methods for handling the response.
 * This class is wrapped in Util.ajax
 *
 * For example:
 * const ajaxRequest = new Ajax(url);
 * ajaxRequest.onSuccess(callbackFunction).onFailure(callbackFunction).onComplete(callbackFunction);
 * @copyright Copyright (C) 2017  Michael Haddon
 * @author Michael Haddon
 * @since 23 Feb 2017
 * @class
 * @memberOf module:Core/Ajax
 * @param {string} [url='/']        ajax endpoint
 * @param {string} [method='get']   http request method to use, get, post, put, delete....
 * @param {Object} [data={}]        if we need to send additional data, like a post, then the data goes in here
 * @returns this
 */
var Ajax = function () {

    /**
     * On construction we immediately start processing the request
     *
     * @constructor
     * @param {string} [url='/']        ajax endpoint
     * @param {string} [method='get']   http request method to use, get, post, put, delete....
     * @param {Object} [data={}]        if we need to send additional data, like a post, then the data goes in here
     * @returns this
     */

    /**
     * The http status code of the request
     *
     * @member module:Core/Ajax.Ajax#_status
     * @type boolean
     * @private
     */

    /**
     * An array of the complete callback functions
     *
     * @member module:Core/Ajax.Ajax#_completeEvents
     * @type AjaxCallback
     * @private
     */


    /**
     * An array of the success callback functions
     *
     * @member module:Core/Ajax.Ajax#_successEvents
     * @type AjaxCallback
     * @private
     */
    function Ajax() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
        var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3.default)(this, Ajax);
        privateAttributesOfAjax.set(this, {});

        _initialiseProps.call(this);

        privateAttributesOfAjax.get(this)._successEvents = [];
        privateAttributesOfAjax.get(this)._failureEvents = [];
        privateAttributesOfAjax.get(this)._completeEvents = [];
        privateAttributesOfAjax.get(this)._complete = false;
        privateAttributesOfAjax.get(this)._status = 200;
        privateAttributesOfAjax.get(this)._response = "";

        privateMethodsOfAjax._sendRequest(this, url.replace(/\/\//g, "/"), method, data);
    }

    /**
     * Converts an object hashmap to a query string
     *
     * @member module:Core/Ajax.Ajax#convertDataToString
     * @method
     * @static
     * @param {Object} data         object to convert
     * @returns string
     */

    /**
     * The text response of the request
     *
     * @member module:Core/Ajax.Ajax#_response
     * @type string
     * @private
     */

    /**
     * Whether or not the request has completed
     *
     * @member module:Core/Ajax.Ajax#_complete
     * @type boolean
     * @private
     */

    /**
     * An array of the failure callback functions
     *
     * @member module:Core/Ajax.Ajax#_failureEvents
     * @type AjaxCallback
     * @private
     */


    (0, _createClass3.default)(Ajax, [{
        key: "onSuccess",


        /**
         * Attach a callback function to be called when the request is completed successfully
         * @member module:Core/Ajax.Ajax#onSuccess
         * @method
         * @param {AjaxCallback} fn         callback function
         * @returns this
         */
        value: function onSuccess(fn) {
            if (this.isSuccess() && privateAttributesOfAjax.get(this)._complete) {
                fn(privateAttributesOfAjax.get(this)._response);
            } else {
                privateAttributesOfAjax.get(this)._successEvents.push(fn);
            }
            return this;
        }

        /**
         * Attach a callback function to be called when the request is completed unsuccessfully
         * @member module:Core/Ajax.Ajax#onFailure
         * @method
         * @param {AjaxCallback} fn         callback function
         * @returns this
         */

    }, {
        key: "onFailure",
        value: function onFailure(fn) {
            if (!this.isSuccess() && privateAttributesOfAjax.get(this)._complete) {
                fn(privateAttributesOfAjax.get(this)._response);
            } else {
                privateAttributesOfAjax.get(this)._failureEvents.push(fn);
            }
            return this;
        }

        /**
         * Attach a callback function to be called when the request is completed, regardless of success or failure
         * @member module:Core/Ajax.Ajax#onFailure
         * @method
         * @param {AjaxCallback} fn         callback function
         * @returns this
         */

    }, {
        key: "onComplete",
        value: function onComplete(fn) {
            if (privateAttributesOfAjax.get(this)._complete) {
                fn(privateAttributesOfAjax.get(this)._response);
            } else {
                privateAttributesOfAjax.get(this)._completeEvents.push(fn);
            }
            return this;
        }

        /**
         * Is the status code of the http response considered valid or not
         * @member module:Core/Ajax.Ajax#isSuccess
         * @method
         * @returns {boolean}
         */


        /**
         * Is the status code of the http response a client error
         * @member module:Core/Ajax.Ajax#isClientError
         * @method
         * @returns {boolean}
         */


        /**
         * Is the status code of the http response a server error
         * @member module:Core/Ajax.Ajax#isServerError
         * @method
         * @returns {boolean}
         */


        /**
         * Create AJAX request object and define its callbacks and properties
         *
         * @member module:Core/Ajax.Ajax#_createRequestObject
         * @method
         * @private
         * @param {string} url       url to request from
         * @param {string} method    method of sending data (get or post)
         * @returns {XMLHttpRequest}
         */

    }], [{
        key: "convertDataToString",
        value: function convertDataToString(data) {
            var stringElements = [];
            for (var elementName in data) {
                if (data.hasOwnProperty(elementName)) {
                    stringElements.push(elementName + "=" + encodeURIComponent(data[elementName]));
                }
            }

            return stringElements.join("&");
        }

        /**
         * Creates a new AJAX request with the AJAX class
         * @member module:Core/Ajax.Ajax#create
         * @method
         * @static
         * @param {string} [url='/']        ajax endpoint
         * @param {string} [method='get']   http request method to use, get, post, put, delete....
         * @param {Object} [data={}]        if we need to send additional data, like a post, then the data goes in here
         * @returns Ajax
         */

    }, {
        key: "createPromise",


        /**
         * Creates a new AJAX request with the AJAX class and wraps it in a Promise
         * @member module:Core/Ajax.Ajax#createPromise
         * @method
         * @static
         * @param {string} [url='/']        ajax endpoint
         * @param {string} [method='get']   http request method to use, get, post, put, delete....
         * @param {Object} [data={}]        if we need to send additional data, like a post, then the data goes in here
         * @returns Promise<string>
         */
        value: function createPromise() {
            var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";

            var _this = this;

            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return new Promise(function (resolve, reject) {
                _this.create(url, method, data).onSuccess(function (response) {
                    resolve(response);
                }).onFailure(function (response) {
                    reject(response);
                });
            });
        }

        /**
         * Creates the url string for the request, appends get data if applicable
         * @member module:Core/Ajax.Ajax#_createUrlString
         * @method
         * @param {string} url              ajax endpoint
         * @param {string} method           http request method
         * @param {Object} data             payload data
         * @private
         */


        /**
         * Sends the request to the url endpoint
         * @member module:Core/Ajax.Ajax#_sendRequest
         * @method
         * @private
         * @param {string} [url='/']        ajax endpoint
         * @param {string} [method='get']   http request method to use, get, post, put, delete....
         * @param {Object} [data={}]        if we need to send additional data, like a post, then the data goes in here
         */

    }]);
    return Ajax;
}(); /*
      *  Copyright (C) 2016-2018  Michael Haddon
      *
      *  This program is free software: you can redistribute it and/or modify
      *  it under the terms of the GNU Lesser General Public License version 3
      *  as published by the Free Software Foundation.
      *
      *  This program is distributed in the hope that it will be useful,
      *  but WITHOUT ANY WARRANTY; without even the implied warranty of
      *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      *  GNU Lesser General Public License for more details.
      *
      *  You should have received a copy of the GNU Lesser General Public License
      *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
      */


/**
 * Callback method
 * @callback AjaxCallback
 * @param {string} response
 * @memberOf module:Core/Util
 */


Ajax.create = function () {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Ajax(url, method, data);
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.isSuccess = function () {
        return _this2._status >= 200 && _this2._status < 400;
    };

    this.isClientError = function () {
        return _this2._status >= 400 && _this2._status < 500;
    };

    this.isServerError = function () {
        return _this2._status >= 500 && _this2._status < 600;
    };
};

exports.default = Ajax;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BamF4LmpzIl0sIm5hbWVzIjpbIl9jcmVhdGVVcmxTdHJpbmciLCJ1cmwiLCJtZXRob2QiLCJkYXRhIiwidG9VcHBlckNhc2UiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiQWpheCIsImNvbnZlcnREYXRhVG9TdHJpbmciLCJfc2VuZFJlcXVlc3QiLCJyZXF1ZXN0Iiwic2V0UmVxdWVzdEhlYWRlciIsInRva2VuIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiaGVhZGVyIiwic2VuZCIsIl9jcmVhdGVSZXF1ZXN0T2JqZWN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwib25lcnJvciIsInJlc3BvbnNlIiwiZXZlbnQiLCJzdGF0dXMiLCJvbmxvYWQiLCJyZXNwb25zZVRleHQiLCJpc1N1Y2Nlc3MiLCJyZXBsYWNlIiwiZm4iLCJwdXNoIiwic3RyaW5nRWxlbWVudHMiLCJlbGVtZW50TmFtZSIsImhhc093blByb3BlcnR5IiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwiam9pbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY3JlYXRlIiwib25TdWNjZXNzIiwib25GYWlsdXJlIiwiX3N0YXR1cyIsImlzQ2xpZW50RXJyb3IiLCJpc1NlcnZlckVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErS0lBLG9CLDRDQUFpQkMsRyxFQUFhQyxNLEVBQWdCQyxJLEVBQWU7QUFDekQsWUFBS0QsT0FBT0UsV0FBUCxZQUFELElBQW9DRCxJQUFwQyxJQUE2Q0UsT0FBT0MsSUFBUCxDQUFZSCxJQUFaLEVBQWtCSSxNQUFuRSxFQUE0RTtBQUN4RSxtQkFBVU4sR0FBVixTQUFpQk8sS0FBS0MsbUJBQUwsQ0FBeUJOLElBQXpCLENBQWpCO0FBQ0g7O0FBRUQsZUFBT0YsR0FBUDtBQUNILEs7QUFXRFMsZ0Isd0NBQTRFO0FBQUEsWUFBL0RULEdBQStEO0FBQUEsWUFBNUNDLE1BQTRDO0FBQUEsWUFB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QUF6QixFQUErQnNDLFNBQS9CLENBQXlDLFVBQUNsQixRQUFELEVBQXNCO0FBQzNEZSw0QkFBUWYsUUFBUjtBQUNILGlCQUZELEVBRUdtQixTQUZILENBRWEsVUFBQ25CLFFBQUQsRUFBc0I7QUFDL0JnQiwyQkFBT2hCLFFBQVA7QUFDSCxpQkFKRDtBQUtILGFBTk0sQ0FBUDtBQU9IOztBQUVEOzs7Ozs7Ozs7OztBQWlCQTs7Ozs7Ozs7Ozs7O0tBdkxKOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTs7Ozs7Ozs7QUF5QnFCZixJLENBcUdWZ0MsTSxHQUFTO0FBQUEsUUFBQ3ZDLEdBQUQ7QUFBQSxRQUFvQkMsTUFBcEI7QUFBQSxRQUE0Q0MsSUFBNUMsdUVBQTRELEVBQTVEO0FBQUEsV0FDWixJQUFJSyxJQUFKLENBQVNQLEdBQVQsRUFBY0MsTUFBZCxFQUFzQkMsSUFBdEIsQ0FEWTtBQUFBLEM7Ozs7O1NBK0hoQnlCLFMsR0FBWTtBQUFBLGVBQ1IsT0FBS2UsT0FBTCxJQUFnQixHQUFoQixJQUF1QixPQUFLQSxPQUFMLEdBQWUsR0FEOUI7QUFBQSxLOztTQVNaQyxhLEdBQWdCO0FBQUEsZUFDWixPQUFLRCxPQUFMLElBQWdCLEdBQWhCLElBQXVCLE9BQUtBLE9BQUwsR0FBZSxHQUQxQjtBQUFBLEs7O1NBU2hCRSxhLEdBQWdCO0FBQUEsZUFDWixPQUFLRixPQUFMLElBQWdCLEdBQWhCLElBQXVCLE9BQUtBLE9BQUwsR0FBZSxHQUQxQjtBQUFBLEs7OztrQkF0UENuQyxJO0FBdVNwQiIsImZpbGUiOiJBamF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTYtMjAxOCAgTWljaGFlbCBIYWRkb25cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDNcbiAqICBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG4vLyBAZmxvd1xuXG4vKipcbiAqIENhbGxiYWNrIG1ldGhvZFxuICogQGNhbGxiYWNrIEFqYXhDYWxsYmFja1xuICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkNvcmUvVXRpbFxuICovXG50eXBlIEFqYXhDYWxsYmFjayA9IChyZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkO1xuXG4vKipcbiAqIEEgc2ltcGxlIEFKQVggY2xhc3MgdGhhdCBjcmVhdGVzIGFuIEFKQVggcmVxdWVzdCBhbmQgaGFzIGpxdWVyeS1saWtlIG1ldGhvZHMgZm9yIGhhbmRsaW5nIHRoZSByZXNwb25zZS5cbiAqIFRoaXMgY2xhc3MgaXMgd3JhcHBlZCBpbiBVdGlsLmFqYXhcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqIGNvbnN0IGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXgodXJsKTtcbiAqIGFqYXhSZXF1ZXN0Lm9uU3VjY2VzcyhjYWxsYmFja0Z1bmN0aW9uKS5vbkZhaWx1cmUoY2FsbGJhY2tGdW5jdGlvbikub25Db21wbGV0ZShjYWxsYmFja0Z1bmN0aW9uKTtcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChDKSAyMDE3ICBNaWNoYWVsIEhhZGRvblxuICogQGF1dGhvciBNaWNoYWVsIEhhZGRvblxuICogQHNpbmNlIDIzIEZlYiAyMDE3XG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJPZiBtb2R1bGU6Q29yZS9BamF4XG4gKiBAcGFyYW0ge3N0cmluZ30gW3VybD0nLyddICAgICAgICBhamF4IGVuZHBvaW50XG4gKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nZ2V0J10gICBodHRwIHJlcXVlc3QgbWV0aG9kIHRvIHVzZSwgZ2V0LCBwb3N0LCBwdXQsIGRlbGV0ZS4uLi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT17fV0gICAgICAgIGlmIHdlIG5lZWQgdG8gc2VuZCBhZGRpdGlvbmFsIGRhdGEsIGxpa2UgYSBwb3N0LCB0aGVuIHRoZSBkYXRhIGdvZXMgaW4gaGVyZVxuICogQHJldHVybnMgdGhpc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBamF4IHtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIHRoZSBzdWNjZXNzIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICAgICAqXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjX3N1Y2Nlc3NFdmVudHNcbiAgICAgKiBAdHlwZSBBamF4Q2FsbGJhY2tcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zdWNjZXNzRXZlbnRzOiBBamF4Q2FsbGJhY2tbXTtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiB0aGUgZmFpbHVyZSBjYWxsYmFjayBmdW5jdGlvbnNcbiAgICAgKlxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I19mYWlsdXJlRXZlbnRzXG4gICAgICogQHR5cGUgQWpheENhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmFpbHVyZUV2ZW50czogQWpheENhbGxiYWNrW107XG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICAgICAqXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjX2NvbXBsZXRlRXZlbnRzXG4gICAgICogQHR5cGUgQWpheENhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY29tcGxldGVFdmVudHM6IEFqYXhDYWxsYmFja1tdO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoZSByZXF1ZXN0IGhhcyBjb21wbGV0ZWRcbiAgICAgKlxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I19jb21wbGV0ZVxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jb21wbGV0ZTogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBUaGUgaHR0cCBzdGF0dXMgY29kZSBvZiB0aGUgcmVxdWVzdFxuICAgICAqXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjX3N0YXR1c1xuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zdGF0dXM6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgdGV4dCByZXNwb25zZSBvZiB0aGUgcmVxdWVzdFxuICAgICAqXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjX3Jlc3BvbnNlXG4gICAgICogQHR5cGUgc3RyaW5nXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcmVzcG9uc2U6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIE9uIGNvbnN0cnVjdGlvbiB3ZSBpbW1lZGlhdGVseSBzdGFydCBwcm9jZXNzaW5nIHRoZSByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3VybD0nLyddICAgICAgICBhamF4IGVuZHBvaW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFttZXRob2Q9J2dldCddICAgaHR0cCByZXF1ZXN0IG1ldGhvZCB0byB1c2UsIGdldCwgcG9zdCwgcHV0LCBkZWxldGUuLi4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtkYXRhPXt9XSAgICAgICAgaWYgd2UgbmVlZCB0byBzZW5kIGFkZGl0aW9uYWwgZGF0YSwgbGlrZSBhIHBvc3QsIHRoZW4gdGhlIGRhdGEgZ29lcyBpbiBoZXJlXG4gICAgICogQHJldHVybnMgdGhpc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nID0gYC9gLCBtZXRob2Q6IHN0cmluZyA9IGBnZXRgLCBkYXRhOiA/T2JqZWN0ID0ge30pIHtcbiAgICAgICAgdGhpcy5fc3VjY2Vzc0V2ZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl9mYWlsdXJlRXZlbnRzID0gW107XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlRXZlbnRzID0gW107XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N0YXR1cyA9IDIwMDtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2UgPSBgYDtcblxuICAgICAgICB0aGlzLl9zZW5kUmVxdWVzdCh1cmwucmVwbGFjZSgvXFwvXFwvL2csIGAvYCksIG1ldGhvZCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYW4gb2JqZWN0IGhhc2htYXAgdG8gYSBxdWVyeSBzdHJpbmdcbiAgICAgKlxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I2NvbnZlcnREYXRhVG9TdHJpbmdcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhICAgICAgICAgb2JqZWN0IHRvIGNvbnZlcnRcbiAgICAgKiBAcmV0dXJucyBzdHJpbmdcbiAgICAgKi9cbiAgICBzdGF0aWMgY29udmVydERhdGFUb1N0cmluZyhkYXRhOiBPYmplY3QpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBzdHJpbmdFbGVtZW50cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnROYW1lIGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGVsZW1lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHN0cmluZ0VsZW1lbnRzLnB1c2goYCR7ZWxlbWVudE5hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFbZWxlbWVudE5hbWVdKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHJpbmdFbGVtZW50cy5qb2luKGAmYCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBBSkFYIHJlcXVlc3Qgd2l0aCB0aGUgQUpBWCBjbGFzc1xuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I2NyZWF0ZVxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt1cmw9Jy8nXSAgICAgICAgYWpheCBlbmRwb2ludFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdnZXQnXSAgIGh0dHAgcmVxdWVzdCBtZXRob2QgdG8gdXNlLCBnZXQsIHBvc3QsIHB1dCwgZGVsZXRlLi4uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT17fV0gICAgICAgIGlmIHdlIG5lZWQgdG8gc2VuZCBhZGRpdGlvbmFsIGRhdGEsIGxpa2UgYSBwb3N0LCB0aGVuIHRoZSBkYXRhIGdvZXMgaW4gaGVyZVxuICAgICAqIEByZXR1cm5zIEFqYXhcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlID0gKHVybDogc3RyaW5nID0gYC9gLCBtZXRob2Q6IHN0cmluZyA9IGBnZXRgLCBkYXRhOiA/T2JqZWN0ID0ge30pOiBBamF4ID0+XG4gICAgICAgIG5ldyBBamF4KHVybCwgbWV0aG9kLCBkYXRhKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgQUpBWCByZXF1ZXN0IHdpdGggdGhlIEFKQVggY2xhc3MgYW5kIHdyYXBzIGl0IGluIGEgUHJvbWlzZVxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I2NyZWF0ZVByb21pc2VcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdXJsPScvJ10gICAgICAgIGFqYXggZW5kcG9pbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nZ2V0J10gICBodHRwIHJlcXVlc3QgbWV0aG9kIHRvIHVzZSwgZ2V0LCBwb3N0LCBwdXQsIGRlbGV0ZS4uLi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2RhdGE9e31dICAgICAgICBpZiB3ZSBuZWVkIHRvIHNlbmQgYWRkaXRpb25hbCBkYXRhLCBsaWtlIGEgcG9zdCwgdGhlbiB0aGUgZGF0YSBnb2VzIGluIGhlcmVcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlPHN0cmluZz5cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlUHJvbWlzZSh1cmw6IHN0cmluZyA9IGAvYCwgbWV0aG9kOiBzdHJpbmcgPSBgZ2V0YCwgZGF0YTogP09iamVjdCA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlKHVybCwgbWV0aG9kLCBkYXRhKS5vblN1Y2Nlc3MoKHJlc3BvbnNlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pLm9uRmFpbHVyZSgocmVzcG9uc2U6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgdXJsIHN0cmluZyBmb3IgdGhlIHJlcXVlc3QsIGFwcGVuZHMgZ2V0IGRhdGEgaWYgYXBwbGljYWJsZVxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I19jcmVhdGVVcmxTdHJpbmdcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICAgICAgICAgICAgYWpheCBlbmRwb2ludFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgICAgICAgICAgIGh0dHAgcmVxdWVzdCBtZXRob2RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgICAgICAgICBwYXlsb2FkIGRhdGFcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jcmVhdGVVcmxTdHJpbmcodXJsOiBzdHJpbmcsIG1ldGhvZDogc3RyaW5nLCBkYXRhOiA/T2JqZWN0KSB7XG4gICAgICAgIGlmICgobWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09IGBHRVRgKSAmJiBkYXRhICYmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dXJsfT8ke0FqYXguY29udmVydERhdGFUb1N0cmluZyhkYXRhKX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyB0aGUgcmVxdWVzdCB0byB0aGUgdXJsIGVuZHBvaW50XG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjX3NlbmRSZXF1ZXN0XG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt1cmw9Jy8nXSAgICAgICAgYWpheCBlbmRwb2ludFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdnZXQnXSAgIGh0dHAgcmVxdWVzdCBtZXRob2QgdG8gdXNlLCBnZXQsIHBvc3QsIHB1dCwgZGVsZXRlLi4uLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT17fV0gICAgICAgIGlmIHdlIG5lZWQgdG8gc2VuZCBhZGRpdGlvbmFsIGRhdGEsIGxpa2UgYSBwb3N0LCB0aGVuIHRoZSBkYXRhIGdvZXMgaW4gaGVyZVxuICAgICAqL1xuICAgIF9zZW5kUmVxdWVzdCh1cmw6IHN0cmluZyA9IGAvYCwgbWV0aG9kOiBzdHJpbmcgPSBgZ2V0YCwgZGF0YTogP09iamVjdCA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLl9jcmVhdGVSZXF1ZXN0T2JqZWN0KHRoaXMuX2NyZWF0ZVVybFN0cmluZyh1cmwsIG1ldGhvZCwgZGF0YSksIG1ldGhvZCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSByZXF1ZXN0IGlzIFBPU1QgdGhlbiB3ZSBhbHNvIGJ1bmRsZSB0aGUgcGFzc2VkIGRhdGEgdG9vXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09IGBQT1NUYCkge1xuICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGBDb250ZW50LVR5cGVgLCBgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbWV0YVtuYW1lPSdfY3NyZiddYCkuZ2V0QXR0cmlidXRlKGBjb250ZW50YCk7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBtZXRhW25hbWU9J19jc3JmX2hlYWRlciddYCkuZ2V0QXR0cmlidXRlKGBjb250ZW50YCk7XG5cbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRva2VuKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnNlbmQoQWpheC5jb252ZXJ0RGF0YVRvU3RyaW5nKGRhdGEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSByZXF1ZXN0IGlzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHlcbiAgICAgKiBAbWVtYmVyIG1vZHVsZTpDb3JlL0FqYXguQWpheCNvblN1Y2Nlc3NcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtBamF4Q2FsbGJhY2t9IGZuICAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB0aGlzXG4gICAgICovXG4gICAgb25TdWNjZXNzKGZuOiBBamF4Q2FsbGJhY2spOiBBamF4IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdWNjZXNzKCkgJiYgdGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2Nlc3NFdmVudHMucHVzaChmbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHJlcXVlc3QgaXMgY29tcGxldGVkIHVuc3VjY2Vzc2Z1bGx5XG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjb25GYWlsdXJlXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSB7QWpheENhbGxiYWNrfSBmbiAgICAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgdGhpc1xuICAgICAqL1xuICAgIG9uRmFpbHVyZShmbjogQWpheENhbGxiYWNrKTogQWpheCB7XG4gICAgICAgIGlmICghdGhpcy5pc1N1Y2Nlc3MoKSAmJiB0aGlzLl9jb21wbGV0ZSkge1xuICAgICAgICAgICAgZm4odGhpcy5fcmVzcG9uc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZmFpbHVyZUV2ZW50cy5wdXNoKGZuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCBpcyBjb21wbGV0ZWQsIHJlZ2FyZGxlc3Mgb2Ygc3VjY2VzcyBvciBmYWlsdXJlXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjb25GYWlsdXJlXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSB7QWpheENhbGxiYWNrfSBmbiAgICAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgdGhpc1xuICAgICAqL1xuICAgIG9uQ29tcGxldGUoZm46IEFqYXhDYWxsYmFjayk6IEFqYXgge1xuICAgICAgICBpZiAodGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlRXZlbnRzLnB1c2goZm4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElzIHRoZSBzdGF0dXMgY29kZSBvZiB0aGUgaHR0cCByZXNwb25zZSBjb25zaWRlcmVkIHZhbGlkIG9yIG5vdFxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I2lzU3VjY2Vzc1xuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1N1Y2Nlc3MgPSAoKTogYm9vbGVhbiA9PlxuICAgICAgICB0aGlzLl9zdGF0dXMgPj0gMjAwICYmIHRoaXMuX3N0YXR1cyA8IDQwMDtcblxuICAgIC8qKlxuICAgICAqIElzIHRoZSBzdGF0dXMgY29kZSBvZiB0aGUgaHR0cCByZXNwb25zZSBhIGNsaWVudCBlcnJvclxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I2lzQ2xpZW50RXJyb3JcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNDbGllbnRFcnJvciA9ICgpOiBib29sZWFuID0+XG4gICAgICAgIHRoaXMuX3N0YXR1cyA+PSA0MDAgJiYgdGhpcy5fc3RhdHVzIDwgNTAwO1xuXG4gICAgLyoqXG4gICAgICogSXMgdGhlIHN0YXR1cyBjb2RlIG9mIHRoZSBodHRwIHJlc3BvbnNlIGEgc2VydmVyIGVycm9yXG4gICAgICogQG1lbWJlciBtb2R1bGU6Q29yZS9BamF4LkFqYXgjaXNTZXJ2ZXJFcnJvclxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1NlcnZlckVycm9yID0gKCk6IGJvb2xlYW4gPT5cbiAgICAgICAgdGhpcy5fc3RhdHVzID49IDUwMCAmJiB0aGlzLl9zdGF0dXMgPCA2MDA7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgQUpBWCByZXF1ZXN0IG9iamVjdCBhbmQgZGVmaW5lIGl0cyBjYWxsYmFja3MgYW5kIHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBtZW1iZXIgbW9kdWxlOkNvcmUvQWpheC5BamF4I19jcmVhdGVSZXF1ZXN0T2JqZWN0XG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICAgICB1cmwgdG8gcmVxdWVzdCBmcm9tXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAgICBtZXRob2Qgb2Ygc2VuZGluZyBkYXRhIChnZXQgb3IgcG9zdClcbiAgICAgKiBAcmV0dXJucyB7WE1MSHR0cFJlcXVlc3R9XG4gICAgICovXG4gICAgX2NyZWF0ZVJlcXVlc3RPYmplY3QodXJsOiBzdHJpbmcsIG1ldGhvZDogc3RyaW5nKTogWE1MSHR0cFJlcXVlc3Qge1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHJlcXVlc3Qub3BlbihtZXRob2QudG9VcHBlckNhc2UoKSwgdXJsLCB0cnVlKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiB0aGUgcmVxdWVzdCBlcnJvcnNcbiAgICAgICAgICovXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc3BvbnNlID0gcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgdGhpcy5fZmFpbHVyZUV2ZW50cykge1xuICAgICAgICAgICAgICAgIGV2ZW50KHRoaXMuX3Jlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IHJlcXVlc3Quc3RhdHVzIHx8IDQwODtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hlbiB0aGUgcmVxdWVzdCBsb2Fkc1xuICAgICAgICAgKi9cbiAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSByZXF1ZXN0LnN0YXR1cztcbiAgICAgICAgICAgIHRoaXMuX3Jlc3BvbnNlID0gcmVxdWVzdC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1N1Y2Nlc3MoKSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgdGhpcy5fc3VjY2Vzc0V2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICBldmVudCh0aGlzLl9yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgdGhpcy5fY29tcGxldGVFdmVudHMpIHtcbiAgICAgICAgICAgICAgICBldmVudCh0aGlzLl9yZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfVxufTsiXX0=