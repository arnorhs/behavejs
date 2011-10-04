
/*
   This is basically the same example as 01, but this one has
   many buttons
*/
button = new Behave({
    rootClass: "toggle_button",
    debug: true,
    initialState: function () {
        return $(this).hasClass('on') ? 'on' : 'off';
    }
});

button.addState('off',{
    classes: ["off"],
    stateOn: function ($element) {
        $element.html("Off");
    }
});

button.addState('on',{
    classes: ["on"],
    stateOn: function ($element) {
        $element.html("I'm OANN!!");
    }
});

button.addState('working',{
    classes: ["working"],
    disableEvents: ["click"],
    stateOn: function ($element) {
        // basically do any html rendering required.. for the state
        // eg. maybe set the disabled state on the button
        $element.html('working...');
        $element.attr("disabled",true);
    },
    stateOff: function ($element) {
        // maybe remove the attribute for disabled...
        $element.removeAttr("disabled");
    }
});

button.addEvent("click", function () {

    var st = ($(this).state()) === "off" ? "on" : "off",
        $element = $(this);
    $element.state('working');
    setTimeout(function(){
        $element.state(st);
    },2000);
});


$(function(){

    button.addCollection($('.row button'));


});






