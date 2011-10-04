
/*
    This is basically the same example as 01, but this one has
    many buttons and a bit more complex functionality where it
    also has a "working" state for when it's changing it's
    value from one to the other

    Note: just to reiterate the point - this is not the
    actual button definition.. this is just what decides
    how a button of this type works - you can think of it
    as the button's "class"
*/
button = new Behave({
    debug: true,
    // setting the initial state with a callback...
    initialState: function () {
        return $(this).hasClass('on') ? 'on' : 'off';
    }
});

// defined in a shorthand object notation...
button.addStates({
    off: {
        classes: ["off"],
        stateOn: function ($element) {
            $element.html("Off");
        }
    },
    on: {
        classes: ["on"],
        stateOn: function ($element) {
            $element.html("I'm OANN!!");
        }
    },
    // when the button is in the "working" state - then you can't
    // click it and it's diabled.. actually setting the disabled
    // attribute should be enough to disable it, but this is just
    // to explain the behavior
    working: {
        classes: ["working"],
        disableEvents: ["click"],
        stateOn: function ($element) {
            // basically do any html rendering required.. for the state
            // eg. maybe set the disabled state on the button
            $element.html('working...').attr("disabled",true);
        },
        stateOff: function ($element) {
            // maybe remove the attribute for disabled...
            $element.removeAttr("disabled");
        }
    }
});

// when a button of this type is clicked the state will
// be set to a working state and it's value then set to
// that of the opposite to what it currently is
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






