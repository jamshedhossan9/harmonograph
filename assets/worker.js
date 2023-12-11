
self.addEventListener('message', function(e,b){
    // console.log(JSON.stringify(e),e.data);
    setTimeout(function(){
        self.postMessage('draw');
    }, e.data.frequency)
}, false);