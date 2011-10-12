
/* setting autoClass to true will cause the name of the state to get added
   as a class to the element */
toggle = new Behave({
    debug: true,
    initialState: "inactive",
    autoClass: true
});

/* Don't need any parameters, the class gets changed automatically */
toggle.addState('inactive');
toggle.addState('active');

/* Define events that just set a state */
toggle.addEvent("focus", function () {
    $(this).state("active");
});
toggle.addEvent("blur", function () {
    $(this).state("inactive");
});


$(function(){
    toggle.addCollection($('input'));
});






