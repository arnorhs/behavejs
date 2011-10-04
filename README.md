#Behave.js

Behave.js is basically a finite state machine for handling UI element states
in javascript.

Often in projects you start managing states (with or without knowing it) by
using classnames, attributes, etc and by that you are actually using the
dom to handle state. Which becomes really hairy when you need to change your
code or do things in a different way.

A really obvious example for this, which I find myself very often in when
working on larger projects is as the number of your buttons increases etc and
you do ajax calls here and there, you often only want specific events only to
be active in some states and not in others...

Also toggling classes on and off and checking (for an example) what the class
of a particular item is to find out something, like "has this item been added
to the current cart" etc...

This gets to be very cubersome as your projects grow and you have all kinds
of UI elements all over the place, as well as your logic is bound to each
instance of a button.

Instead you define how a particular type of button is supposed to behave and
and then simply decide which buttons should behave that way using some
jQuery selector.

#Installation & usage:

Currently this library requires jQuery to be of any use. That could change
in the future, but it is used for event bindings and adding and removing
classes.

And then it's just a matter of including the main file (development version)
from the /src/ folder or the minified version (production) from the root

No specific jQuery version is needed. Any version from 1.3.2 and above should
work, though admittedly, I have not tested all versions.

The library is only around 3.4KB minified, so it should not add too big of an
overhead to your current project - and hopefully it will save many more
bytes by you having to write less code.

To be frank I haven't really tested this library yet in IE, even though I'd
expect everything to work. But usually when somebody says something like that
they're probably wrong, so I think I'll have to get win running on my machine
or try in somebody else's machine...

#Todo:
  - Probably should make the stateOn and stateOff functions be executed in the
    same context as the events and other callbacks in that the "this" value
    should be the element's object - although that would mean we could not
    change to elements that reference the same actual underlying items (like
    when the same button with the same action is placed on multiple locations,
    but that's probably also an issue with the currently executed
    callbacks...)
  - Adding a "autoClass" option for when you want to automatically add a class
    to the element which is the same as the active state - should reduce the
    need for the "classes" property.
  - Check the support of "throw" across all browsers - we could use that for
    when something's been instantiated wrong. Currently we're just returning
    false...
  - Test in IE.
  - Possibly set up some unit tests for the library.. Would probably need help
    with that.
  - Contemplate some multi-state functionality... Maybe that's just bullshit.
    There are a few approaches and questions and thoughts to consider if we
    take that route:

    Difficulties:
      - states can be defining some of the same classes and disabled
        events
      - when changing states, setting the element's classes will have
        to be something like:
        * remove any classes that are specified from the state that
          got removed
        * make a giant array with no duplicates of all the active
          classes in the current state and add them

      - the best approach might be to maintain a hash of all the
        currently disabled events and current classes and always
        iterating through those each time we change the state..
        fugly.. :/
        need to brush up on some algorithims or some methods of
        doing that efficiently..

