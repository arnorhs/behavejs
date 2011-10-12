
/* create this interaction behavior. debug on just for kicks. setting the
   initial state for all buttons of this type */
toggle = new Behave({
    debug: true,
    initialState: "off"
});

/* a button of this type will be able to have these two states: */
toggle.addState('off',{
    classes: ["off"],
    stateOn: function () {
        $(this).html("Click me!! :D");
    }
});

toggle.addState('on',{
    classes: ["on"],
    stateOn: function () {
        $(this).html("I'm OANN!!");
    }
});

/* We define an event for this button */
toggle.addEvent("click", function () {
    $(this).state($(this).state() === "off" ? "on" : "off");
});


/* add any button you like to this behavior - note that we're not really enforcing
   any restrictions on what you add to the collection - could just as well be
   a div or an image or whatever */
$(function(){

    toggle.addCollection($('button'));

});






