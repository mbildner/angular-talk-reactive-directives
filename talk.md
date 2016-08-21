AngularJS: "Not That Bad" ™
===========================



What's Wrong With Angular?
--------------------------

1. Lots of logic in views
1. State management is impossible

Why Do People Love React?
-------------------------

1. Views are simple
1. State management is simple


How can we measure how good or bad a system is?

Rule of One Blob
----------------

The Rule of One Blob states that a developer should be able to drive an application to __all__ its possible states by changing exactly one blob of data.

### Does the Rule of One Blob hold for React?

Yes! _if_ you never use `this.state`

(side note: when using React, __never__ use `this.state`)

React.render(<GreetingBox blobOfState={blobOfState}, mountNode)

### Is it possible in Angular???

Yes! Let's talk about how.

Reactive Directives
===================

Let's copy the principles that React got right and implement them in Angular:

1. All views are part of the same tree
1. All views receive state from __exactly one source__
    (Note: this rule is violated by `this.state`, which is why you should never use it)

Things we are not talking about:

1. "DOM Diffing"
    people love talking about DOM diffing and the magic algorithm that makes React tick. It is in fact an irrelevant implementation detail that you should not care about when you talk about React, and we don't have to care about it when we're building our copycat view UI system in Angular.
1. Flux/Redux
    Right now we're only trying to figure out how to write an easy to reason about view-rendering system.
    We don't care *yet* about how state is managed in this system, only how it's rendered when we get fresh state.
    (__we will talk about this later__)


Implementing Reactive Directives
--------------------------------

1. All views are in the same tree:

    React:
        components all render text, null, or another component

    Angular:
        directives all render text, null, or another directive => never use free-floating controllers


1. All views receive state from __exactly one source__

This is actually a more complicated idea than it sounds.

In React, Views are "basically" just functions.

```JavaScript
var ToolBar = React.createClass({
    render: function(){
        return (
            <nav>
                <a href={this.props.linkToHome}>Home</a>
                <a href={this.props.linkToEmail}>Email</a>
                <a href={this.props.linkToCalendar}>Calendar</a>
            </nav>
         );
    };
});

```

They get all dressed in up in "Classes" because Facebook really likes Object Oriented JavaScript. ¯\_(ツ)_/¯

But the only thing you need to think about here is the render function. In fact, Facebook acknowledges this, and supports the **much better** functional syntax for Components:

```JavaScript
var ToolBar = function (props) {
    return (
        <nav>
            <a href={props.linkToHome}>Home</a>
            <a href={props.linkToEmail}>Email</a>
            <a href={props.linkToCalendar}>Calendar</a>
        </nav>
     );
};

```

(hint, always use this syntax)

Let's do this same thing with directives in Angular:

goal: make directives just a weird way of writing a function invocation that maps properties to strings, nulls, and other directives

State in Directives
-------------------

Out of the box, Angular provides you 5 different ways for directives to receive state, because it hates you:

1. Inherited Scope
1. Scope values (through directive attributes)
1. Services/Factories/Providers
1. Events (why???????)
1. scope watches

### Which one should we use?

Let's propose that we straight up copy the React API:

In React it looks like this:
```HTML
<UserIcon name="Moshe" avatarUrl="avatar.com/moshe" />
```

Adjusting for Angular's obsession with dash-casing it would look like this:
```HTML
<user-icon name="Moshe" avatar-url="avatar.com/moshe" ></user-icon>
```

If we're using this API, then it means we're going with attributes and all other sources of state are out:

1. Inherited Scope
1. ~~Scope values (through directive attributes)~~
1. ~~Services/Factories/Providers~~
1. ~~Events (why???)~~
1. ~~scope watches~~

Fabulous. How does our chosen API measure up against our rules?

1. All views are part of the same tree
    All views are in directives, // where does this rule belong?
    All directives come from the same root directive

1. All views receive state from __exactly one source__
    All directives get state from their props


Great!

Problem: Angular Templates are Static, not Dynamic
--------------------

No matter how hard we try, Angular is not React, and Directives are not actually Components.
Rendering collections is one of the places this mismatch shows through:

In React, templates are evaulated on-demand, at runtime, meaning they can dynamically change.
In Angular, tmeplates are evaulated **exactly one time**, as part of the bootstrap process. That means two things:
1. Angular templates are static, therefore
1. Angular templates must define all their possible states explicitly and in the markup.

( There is sort of a way around this, which we'll talk about if we have time in this presentation, but basically you're SOL on this one. It's a weakness of the framework. )

This leads to two problems:

Rendering Collections in Angular
------------------------
In React, there's nothing special about rendering collections, just render the number of things you want, in the place you want.

```JavaScript
var TodoList = function(props){
    return (
        <ul>
            props.tasks.map(function(task){
                return <Task>{task.title}</Task>;
            })
        </ul>
    );
};

```

In Angular, you'll need to define the collection's rendering relationship ahead of time:

```JavaScript
//...
template: '<ul>'                             +
            '<li ng-repeat="task in tasks>'  +
             '{{ task.title }}'              +
            '</li>'                          +
          '</ul>'

```

Rendering Empty States in Angular
------------------------------

This also means that Angular cannot dynamically change *how* a directive gets rendered. This is super common for empty states.

So this in React:

```JavaScript
var TodoList = function(props){
    if (props.tasks.length === 0) {
        return <h1>Congratulations! You are all done</h1>;
    }

    return (
        <ul>
            props.tasks.map(function(task){
                return <Task>{task.title}</Task>;
            })
        </ul>
    );
};
```

Is not possible in Angular.

Instead, remember, you'll have to define the possibility in markup, which is sad:

```JavaScript
//...
template:
          '<div>'                                                                       +
            '<h1 ng-if="tasks.length === 0">Congratulations! You are all done</h1>'     +
            '<ul>'                                                                      +
                '<li ng-repeat="task in tasks>'                                         +
                 '{{ task.title }}'                                                     +
                '</li>'                                                                 +
            '</ul>'                                                                     +
          '</div>'

```

Again, this is just a weakness of the framework.

Generally, these two tools should be enough for you to build whatever else you need.


Can We Honor *The Rule of One Blob* Now?
========================================

Let's make a tiny application that records our clicks that follows the Rule of One Blob:


// clicks.js/html

Now we have a sweet nested templating system, we can drive it to all of its possible states from one big blob of state. But it doesn't do anything...


Let's wire it up!

We'll use a super basic Flux pattern implementation to make our application record our clicks and show them to us.

First, let's make a directive to programatically wire data from our code into our view
Second, let's make our view elements tell the store that state needs to change
 - note, the view elements cannot change state themselves, all they can do is tell the Store that something happened, and the Store will take responsibility for reconciling events and state

Great, except it doesn't work.

Why not?

Angular is watching a reference to the original array of clicks. If we were to push our new clicks in, instead of concatenating them, angular would be fine.
But that's brittle. It's also ugly, but it means that we would never be able to update our application's state with fresh objects.

Let's make it work!

Why does it work?
// worth talking about scope watches in ng-bind?

By wrapping our data accesses in method calls, we've instructed angular to compare what this function returns to whatever it returned last time.
This is the secret sauce to making one way data flow work in Angular. All the Angular data shenanigans are contained in this thin wrapper between the angular world and the not-necessarily-angular world of data.

Now we have a dynamic application. It obeys the Rule Of One Blob, and it can actually manage user interaction.

Let's make a slightly more complicated TODO list.

Angular Problem #3: Managing Inputs
-----------------------------------

Angular provides the ngModel tool to manage various inputs, and they are awful.

ngModel is the kind of thing that seems amazing at first, but quickly becomes a nightmare when you want control of your application.

It is built on the assumption that you want to use inherited scopes and scope watchers.

Since you don't hate yourself, you no longer use those.

Now What?
---------

`ng-model-options="{getterSetter: true}"`

Angular provides an interface for directives to manage their ngModel slightly differently:

This exposes one method on the scope with two signatures:

```
get modelMethod(): Object?
set modelMethod(String): Void
```

1. When Angular wants to render the input, it will call our getterSetter method with no argument, and render the returned value inside the input
1. When the user changes the input value, it will call our getterSetter method with the input's proposed new value as its single argument, and subsequently try to render the input by using the previous step

This is the hook we need!

The getter will move state from props into the input view
The setter will take inputs and dispatch them into our state management system (in this case the store).
The Store will be responsible for deciding whether the system state changes,
the RootElement will re-render with our entire state tree, and we don't have to think about anything else.

