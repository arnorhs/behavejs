

/*
    I guess there's a version of this where you allow an option
    for setting a class on the element according to the current
    state.. eg.:
       new Behave({ autoClass: true });
    but currently i haven't implemented...
*/
toggle = new Behave({
    rootClass: "toggle_button",
    debug: true,
    initialState: "off"
});

toggle.addState('off',{
    classes: ["off"],
    disableEvents: ["mouseleave","mouseenter"],
    stateOn: function ($element) {
        $element.html("Click me!! :D");
    }
});

toggle.addState('on',{
    classes: ["on"],
    stateOn: function ($element) {
        $element.html("I'm OANN!!");
    }
});

toggle.addState('working',{
    classes: ["toggle_button", "spinner"],
    disableEvents: [],
    stateOn: function (element) {
        // basically do any html rendering required.. for the state
        // eg. maybe set the disabled state on the button
        element.attr("disabled",true);
    },
    stateOff: function (element) {
        // maybe remove the attribute for disabled...
        element.removeAttr("disabled");
    }
});

toggle.addEvent("mouseenter", function () {
});

toggle.addEvent("mouseleave", function () {
});

toggle.addEvent("click", function () {

    // do code to start ajax request
    if (this.state() === "off") {
        // do ajax requst for toggling on
        // when successful, turn the state on - possibly in some other event
        this.state("on");
    } else {
        // do ajax request for toggling off
        this.state("off");

    }
});


$(function(){

    var $toggle_button = $('<button>Toggle me</button>');
    toggle.addCollection($toggle_button);

    $toggle_button.appendTo('body');


});






