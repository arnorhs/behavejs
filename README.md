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

#notes:

Currently this library requires jQuery to be of any use. That could change
in the future, but it is used for event bindings and adding and removing
classes. So basically nothing big.

#Todo:
  - Probably should make the stateOn and stateOff functions be executed in the
    same context as the events and other callbacks in that the "this" value
    should be the element's object - although that would mean we could not
    change to elements that reference the same actual underlying items (like
    when the same button with the same action is placed on multiple locations,
    but that's probably also an issue with the currently executed
    callbacks...)

