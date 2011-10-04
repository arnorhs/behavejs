behave as I say, UI element


Behave.js is basically a statemachine for handling UI element states.

Todo:
  - Probably should make the stateOn and stateOff functions be executed in the
    same context as the events and other callbacks in that the "this" value
    should be the element's object - although that would mean we could not
    change to elements that reference the same actual underlying items (like
    when the same button with the same action is placed on multiple locations,
    but that's probably also an issue with the currently executed
    callbacks...)



