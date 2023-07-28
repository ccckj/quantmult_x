
/**
 * @fileoverview Example to compose HTTP request
 * and handle the response.
 *
 */

// const url = "https://example.com/";
// const method = "POST";
// const headers = {"Field": "test-header-param"};
// const data = {"info": "abc"};

// const myRequest = {
//     url: url,
//     method: method, // Optional, default GET.
//     headers: headers, // Optional.
//     body: JSON.stringify(data) // Optional.
// };

// $task.fetch(myRequest).then(response => {
//     // response.statusCode, response.headers, response.body
//     console.log(response.body);
//     $notify("Title", "Subtitle", response.body); // Success!
//     $done();
// }, reason => {
//     // reason.error
//     $notify("Title", "Subtitle", reason.error); // Error!
//     $done();
// });




const $tool = new Tool()
const consoleLog = false;

if (!$tool.isResponse) {
    let headers = $request.headers
    headers['User-Agent'] = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.3 Mobile/15E148 Safari/604.1"
    $done({});
}



function Tool() {
    _node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    _isSurge = typeof $httpClient != "undefined"
    _isQuanX = typeof $task != "undefined"
    this.isSurge = _isSurge
    this.isQuanX = _isQuanX
    this.isResponse = typeof $response != "undefined"
    this.notify = (title, subtitle, message) => {
        if (_isQuanX) $notify(title, subtitle, message)
        if (_isSurge) $notification.post(title, subtitle, message)
        if (_node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    this.write = (value, key) => {
        if (_isQuanX) return $prefs.setValueForKey(value, key)
        if (_isSurge) return $persistentStore.write(value, key)
    }
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isSurge) return $persistentStore.read(key)
    }
    this.get = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.get(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    this.post = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.post(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request.post(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    _status = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
}
