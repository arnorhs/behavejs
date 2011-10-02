

window.Behave = (function ($) {

    /*
        variables used as constants in strings etc. Having them as variable
        will result in a smaller file size when minimized.

        the BHVOBJ and BHVSTATE are constants used to reference the .data
        name used on to retrieve the state and which behavior this object
        is in.
    */
    var UNDEFINED = "undefined", FUNCTION = "function", OBJECT = "object",
        BHVI = "BHVInstance";

    if (typeof window.$ === UNDEFINED) {
        // maybe output some error?? there is no jquery and it's required for the
        // whoe shebang ...
        return null;
    }

    var isFunction = function (obj) {
      return typeof obj === FUNCTION;
    };




    /*
        BHVInstance is a helper class used for the instance of every
        element. So each element will have an instance of this class
        set to itself.
    */
    function BHVInstance (bhv, $element) {

        this.BHV = bhv;
        this.$element = $element;
        // will be set by .setInitialState anyways
        this.currentState = "";

        // Sanity check - make sure there are no states that have been created
        // that call events that have not been defined...
        // possibly add more stuff?
        if (!this.BHV.eventsAreSane()) return false;

        this.setEvents();
        
        // will set the first state and call any callbacks, add classes
        // etc accordingly
        this.setInitialState();

        $element.data(BHVI, this);
    };

    /* defining all methods in an object-esque notation: */

    BHVInstance.prototype = {
        log: function () {
            if (!this.BHV.options.debug) return;
            Array.prototype.unshift.call(arguments, "Behave>");
            console.log.apply(console, arguments);
        },

        eventIsActive: function (eventName) {
            return this.BHV._states[this.getState()].disableEvents.indexOf(eventName) < 0
        },

        // binds an anonymous function to all the events in this behavior
        // which checks if it's ok to call it and then does a callback to the
        // appropriate event handler.. maybe it shoudln't be anonymous?
        setEvents: function () {

            // maybe for isolation purposes, this should rather be doing something like
            // this.BHV.getEvents() or something.. fuck it..
            // setting self is needed to be able to reference it from the callback
            // function... since we won't have control over how that one gets called
            // we could pass it through as an event parameter, but that could possibly
            // override some params the user is using and will be overly syntaxy
            var evs = this.BHV._events, self = this;

            for (var i in evs) {
                // we need to wrap this so that the value of i will be maintained unique
                // and not updated as we go further, or else it will always be the newest
                // version (last element of the object)
                // an alternative, since we're using jquery would be to use $.each on the
                // event list above..
                (function(){
                    var eventName = i;
                    self.$element.bind(eventName, function (e) {
                        var active = self.eventIsActive(eventName);
                        self.log('called: ',eventName, active ? " (active)" : " (not active)");
                        if (active) {
                            // adding the element to the end of the arguments list
                            // I wish arguments was detected as an array so it would
                            // have arguments.push, but at least it has arguments.length
                            arguments[arguments.length] = self.$element;
                            return evs[eventName].apply(this, arguments);
                        } else {
                            // so that if it's a click or a form submit, and it's disabled
                            // the default action won't be fired.. we're not doing
                            // stopPropagation() though, because there might be some stuff
                            // that's out of our reach that's supposed to get fired..
                            e.preventDefault();
                        }
                    });
                })();
            }
        },

        setInitialState: function (state) {

            // the setState method actually makes the assumption that there is
            // always a previous state, so we'll have to manually do the same steps
            // as that one does here
            this.currentState = this.BHV.getInitialState();

            // get the state properties
            var stateProps = this.BHV._states[this.currentState];

            // set classes to the initial state
            this.classes("addClass",this.currentState);

            // call the callback from stateOn
            this.callCallback(stateProps.stateOn);

        },

        inStates: function (states) {
            // assuming states is always an array
            return states.indexOf(this.getState()) >= 0;
        },

        getState: function () {
            return this.currentState;
        },

        state: function (stateName) {
            // if no state provided or it was empty..
            if (typeof stateName === UNDEFINED || !stateName) {
                return this.getState();
            } else {
                return this.setState(stateName);
            }
        },

        /*
            .setState

            This function will:
              - change the current state
              - bind or unbind events accordingly
              - switch classes accordingly
              - call callbacks if there are any
        */
        setState: function (newState) {
            
            this.log("settings state to: "+newState);

            // check if this state is even on our list of valid states
            if (typeof this.BHV._states[newState] === UNDEFINED) {
                // probably output an error at some point...
                return false;
            }

            // get the state properties for both the new and old state
            var oldStateProps = this.BHV._states[this.currentState];
            var newStateProps = this.BHV._states[newState];

            // call the callback for stateOff
            this.callCallback(oldStateProps.stateOff);

            // swich classes from the old to new
            this.switchClasses(this.currentState, newState);

            // call the callback from stateOn
            this.callCallback(newStateProps.stateOn);

            // and finally actually set the state to the current one
            this.currentState = newState;

        },

        // only used in .setState
        callCallback: function (func) {
            if (isFunction(func)) {
                this.log("calling callback: ",func);
                // calling the callback with the element as the parameter
                func.call(this, this.$element);
            }
        },

        // where "func" is either jQuery's addClass or removeClass
        // only used in .setState
        classes: function (func, stateName) {
            var classes = this.BHV._states[stateName].classes;
            // basically same as calling element.addClass(classnames) or element.removeClass(classnames)
            this.$element[func](classes.join(" "));
        },
        // only used in .setState
        switchClasses: function (fromState,toState) {
            this.classes("removeClass",fromState);
            this.classes("addClass",toState);
        }
    };




    /*
        This is the main class. Accepts a few parameters etc..
    */
    function BHV (options) {
        /* define the states */

        this.options = $.extend({},{
          // default options
          debug: false,
          initialState: null,
          rootClass: ""
        },options);

        // our "private" vars
        this._states = {};
        this._events = {};
        // jQuery collections will be collected here:
        this._$collections = [];
        // current object is null for now
        this._current_object = null;

    }

    /* define all prototype functions in object notation */
    BHV.prototype = {

        eventsAreSane: function () {

            // Loop through all states and make sure there are no event disablers
            // that have been set to events that have not been defined - else they will get
            // triggered when the states get loaded
            for (var i in this._states) {
                var st = this._states[i];
                var evs = st.disableEvents;
                for (var k = 0; k < evs.length; k++) {
                    if (typeof this._events[evs[k]] === "undefined") {
                        // should maybe echo or print out.. ??
                        this.log('events are NOT sane: ', evs[k], ' is nowhere to be found...');
                        return false;
                    }
                }
            }
            return true;
        },


        getInitialState: function () {

            if (this.options.initialState) return this.options.initialState;

            // a pretty hacky way to get the first state if none has been
            // defined (also make sure that if it gets called again, that we've
            // already set it
            for (var i in this._states) {
                return this.options.initialState = this._states[i];
            }

        },

        /*
           Possible "settings":

              classes       a set of classes that will be applied to the object
                            when it has this state

              disableEvents which events will be disabled when it reaches this
                            state

              stateOn       callback function that will be called when the object
                            reaches this state

              stateOff      callback function that will be called when the object
                            exits this state
        */

        addState: function (state,settings) {

            if (typeof this._states[state] !== UNDEFINED) {
                // state has already been defined
                return false;
            }

            // we could also extend some default object, but
            // I think it won't be needed..
            this._states[state] = $.extend({},{
                classes: [],
                disableEvents: [],
                stateOn: null,
                stateOff: null
            },settings);

            return true;
        },

        // basically the same as addState - just accepts an object instead
        // maybe this could be overloaded to only have to use one method for
        // both cases... not sure
        addStates: function (states) {
            for (var i in states) {
                this.addState(i, states[i]);
            }
            return true;
        },

        addEvent: function (eventName, handler) {
            // todo: add a check for type of eventName?
            if (!isFunction(handler)) {
                return false;
            }

            if (typeof this._events[eventName] !== UNDEFINED) {
                // event name has already been defined
                return false;
            }

            this._events[eventName] = handler;
        },


        // this requires a jQuery collection at this point...
        addCollection: function ($collection) {

            // check maybe to make sure the collection is a jQuery object. if it
            // isn't then make it one? currently ignoring...

            // should we check on this object's data param or should we check on
            // the current collection array if this has already been added?

            // when this function completes, each element should have an instance of
            // BHVInstance added to a data property. So if that data property has been
            // defined and is of that particular type, we don't want to run it again.
            // todo: find a better way of determining if this is a BHVInstance object than
            // using the .currentState property (ugly hack)
            if (typeof $collection.data(BHVI) === "object" && $collection.data(BHVI).currentState !== UNDEFINED) {
                return false;
            }

            // create the object for this thing using the current BHV object and a reference to the
            // element itself - it will take care of adding the object to the element itself:
            var instance = new BHVInstance(this, $collection);

            // append this object to our collection - so we have a reference to the instance
            // and the instace has a reference to this object - cross reference
            this._$collections.push($collection);

            // don't know if this will ever be used.. who knows:
            return true;

        }
    };



    // highly dubious bit.. modifying jQuery to add a reference to the 
    // .state() function.. :S
    // this is basically a proxy function
    // does not return "this" so it's not chainable
    $.fn.state = function () {

        // bhvi
        var bhvi = this.data(BHVI);

        // try to see if the object is of the right type..
        if (typeof bhvi === UNDEFINED || bhvi.currentState === UNDEFINED) {
            // essentially the function fails
            return false;
        }
        // call the original object's function with the parameters passed to this one
        return bhvi.state.apply(bhvi, arguments);

    }

    // highly dubious bit.. modifying jQuery to add a reference to the 
    // .state() function.. :S
    // this is basically a proxy function
    // does not return "this" so it's not chainable
    $.fn.inStates = function () {

        // bhvi
        var bhvi = this.data(BHVI);

        // try to see if the object is of the right type..
        if (typeof bhvi === UNDEFINED || bhvi.currentState === UNDEFINED) {
            // essentially the function fails
            return false;
        }
        // call the original object's function with the parameters passed to this one
        return bhvi.inStates.apply(bhvi, arguments);

    }

    return BHV;

})(jQuery);




