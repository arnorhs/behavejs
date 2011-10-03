var examples = {
  "example-1": {
      title: "Example 1"
  }
};

// find the current url
var url = document.location.href.split('?');
url = url.length > 1 ? url[1] : 'example-1';
if (typeof examples[url] === "undefined") {
    url = "example-1";
}

example = examples[url]

// when dom loads, add the appropriate script/css
$(function(){
    $('<script src="'+url+'.js"></script><style> @import "'+url+'.css"; </style>').appendTo('body');
    document.title = examples[url]["title"];

});



