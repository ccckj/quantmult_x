
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
    let modifiedHeaders = $request.headers;
    let url = $request.url;
    const newUrl = /^(https?:\/\/(tnc|dm)[\w-]+\.\w+\.com\/.+)(\?)(.+)/;
    const newUrl2 = /^(https?:\/\/.*\.\w{4}okv.com\/.+&.+)(\d{2}\.3\.\d)(.+)/
    if (newUrl.test(url)) {
        url = url.replace(
            newUrl,
            '$1$3' 
          );
        $done({'url':url});
    }
    if (newUrl2.test(url)) {
        url = url.replace(
            newUrl2,
            '$118.0$3' 
          );
        //$done({'url':new_url});
    }

    let queryString = url.split('?')[1];
    let queryParams = queryString.split('&');
    const account_region = /account_region/;
    const region = /1?_region$/; 
    const mcc_mnc = /mcc_mnc/;
    const carrier = /carrier/;
    const tz_offset = /tz_offset/;
    const tz_name = /tz_name/;
    const timezone = /timezone/;
    for(let i = 0; i < queryParams.length; i++) {
        let pair = queryParams[i].split('=');
        if(account_region.test(pair[0])) {
           pair[1] = 'jp';
           queryParams[i] = pair.join('=');
        } else if(region.test(pair[0])) {
          pair[1] = 'JP';
          queryParams[i] = pair.join('=');
        } else if(mcc_mnc.test(pair[0])) {
            pair[1] = '310032'; 
          queryParams[i] = pair.join('=');
        } else if (carrier.test(pair[0])) {
            pair[1] = 'docomo'; 
          queryParams[i] = pair.join('=');
        } else if (tz_offset.test(pair[0])) {
            pair[1] = '32400'; 
          queryParams[i] = pair.join('=');
        } else if (tz_name.test(pair[0])) {
            pair[1] = 'Asia/Toyko'; 
          queryParams[i] = pair.join('=');
        } else if (timezone.test(pair[0])) {
            pair[1] = '9'; 
          queryParams[i] = pair.join('=');
        }
    }
    url = url.split('?')[0] + '?' + queryParams.join('&');

    // modifiedHeaders['User-Agent'] = 'ChinaUnicom4.x/10.0.1 (iPhone; iOS 15.7.1; Scale/2.00)';
    // modifiedHeaders['X-Online-Host'] = modifiedHeaders['Host']; 
    // modifiedHeaders['X-Forwarded-Host'] = modifiedHeaders['Host']; 
    // //modifiedHeaders['Connection'] = 'keep-alive'
    // modifiedHeaders['Host'] = "listen.10155.com";

    $done({'url' : url});

} else {
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
