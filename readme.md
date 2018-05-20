# instantiation recipes
- You need to include vue.js by importing it from a package repository, or use it standalone via a cdn, e.g. by adding a script tag to your html page:
  - `<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>`
- main vue object (app):
  ```
  new Vue({
    el: '#root'
  });
  ```
- vue component:
  ```
  new Vue.component('my-component-name', {
    ...
  })
  ```

# vue component structure
```js
{
  el,   //root dom element
  data, //(method which returns*) data model
  methods,
  computed, //remember to refer to model elements using "this" !!!
  mounted()
}
```
_* for vue components. for main vue object, you can declare the data object directly._

# Slots - great for static components that mainly encapsulate markup
- Nameless slots
  - A component template like:
  ```
  <div>
    <slot></slot>
  </div>
  ```
  - can be used like: '<thing>this is a thing</thing>`
- Named slots
  - A more complex component with more parts like:
  ```
  <article>
    <div class="header">
      <slot name="title"></slot>
    </div>
    <div class="body">
      <slot>This is the default content<slot>
    </div>
  </article>
  ```
  - can be used in a variety of ways:
  - `<post><h1 slot="title">The Foobar</h1></post>` which will add a 'h1' to the markup / dom, and leave the default slot content
  - `<post><template slot="title">The Foobar</template></post>` which will only pass bare text... usually what you want, and leave the default slot content
  - Or, you you can additionally override the default content in the default slot:
  ```
  <post>
    <template slot="title">The Foobar</template>
    This article is about the latest foobar!
  </post>
  ```

# Inline templates - small fragments of reactivity
Inline templates are used when you need small fragments of 'reactivity' (binding, events etc) without the bloat/overhead of a multiple-use component.
- Generally, don't use these too liberally for frontend apps; creates clutter. But server-side apps really benefit from this (think php-like behavior).
- uses the `inline-template` attribute. This effectively turns the html element in question into a template node, meaning it must have only ONE child tag.
- Example:
  ```
  <widget inline-template>
    <div>
      <p> elapsed time is {{ elapsedTime }}. </p>
      <p> target time is {{ targetTime }}. </p>
    </div>
  </widget>
  ```

# vue directives
- v-model (two-way binding)
- v-for
  - example: `<li v-for="task in tasks">{{ task.taskName }}</li>`
  - or: `<li v-for="task in tasks" v-text="task.taskName"></li>`
- v-text (text value of element - one-way binding)
- v-on (event listeners, eg click)
  - the shorthand for v-on is the '@' symbol. i.e. `v-on:click` is the same as `@click`. Get a vue plugin for your ide so that the syntax doesn't throw your editor off.
  - you can apply values conditionally, eg: `:class="{ 'btn':true, 'toggled':isToggled }"`
- v-bind (for attribute binding)
  - e.g. `<button v-bind:title="btnTitle">Hover over me</button>` ... in which the standard element attribute "title" is bound to a element in the model named 'btnTitle'.
  - the shorthand for v-bind: is the ':' symbol. i.e. `v-bind:attr` and `:attr` are the same.
- v-if
- v-else
- v-show (show this element if true) : only works on dom elements, not components!!
- NOTE: directives can take arguments, eg:
  - `v-on:click` ... "click" is the argument
  - `v-bind:attr` ... bind an element attribute named 'attr'.

## .vue files and vue-loader
Thanks to the **vue-loader** module, you can aggregate all the aspects of a vue component / app into a .vue file...

```
<template>
  ...
</template>

<script>
export default {
  
}
</script>

<style>...</style>
```
**vue-loader** basically turns the above items in the .vue file format into a regular javascript module.
With **vetur** installed, you can do `ctrl+space,t`, `ctrl+space,s` etc to get the above code snippets inserted for you.

# components
- note that since components are not bound to an actual instance, the data attribute needs to be a *function* that returns the data obj, to be called later when the component is instantiated.
- the template must return a single root element (similar to earlier versions of react before Fragments)
- there's a *props* attribute, similar to react. Note:
 - treat ur props as immutables. Rely on *data()* and *computed()* instead if you need to modify something...
 - you don't prefix props, like `this.props.foo`. All props are placed in _this_ scope, so it's `this.foo`. !!
- component names are usually hyphenated, not camelcased. e.g. `my-component`.
- the attribute `inline-template` lets you create a component without a "template" section in the definition... because the template will be taken as whatever appears between the opening and closing tags of the component.

# component styling
- the style tag can be scoped: When a `<style>` tag has the scoped attribute, (i.e. `<style scoped>...</style>`, its CSS will apply to elements of the current component only. This is driven by postcss, under the hood.
- animations and transitions... perhaps bcos of scoped styling, these are finnickier than you'd expect. see: [this reference](https://vuejs.org/v2/guide/transitions.html#Transition-Classes)
- **fontawesome**:
  - `npm i --save @fortawesome/fontawesome`
  - `npm i --save @fortawesome/vue-fontawesome`
  - `npm i --save @fortawesome/fontawesome-free-solid` //this is the free set
  - add the following to your codebase per [instructions at fontawesome... make sure to scroll down to "vue.js example"](https://fontawesome.com/how-to-use/use-with-node-js)
    - in **app.js**:
    ```js
    //WARNING!! do not use require()'s to import! Everything gets hosed... known issue at time of writing.
    import Vue from 'vue'
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
    import fontawesome from '@fortawesome/fontawesome'
    import solid from '@fortawesome/fontawesome-free-solid'
    fontawesome.library.add(solid) // Use any icon from the Solid style
    Vue.component('font-awesome-icon', FontAwesomeIcon) // Use the icon component anywhere in the app
    ```
    - thereafter, in components: `<font-awesome-icon :icon="['fas', 'user']" />`

# events
- `$emit(myCustomEvtName)` will emit a custom event. Example use:
 - Example emitter: `<button @click="$emit('doTheThing')">Do it!</button>`
 - Example listener: `<MyComponent @doTheThing="foo=false"></MyComponent>`
- we can use $emit‘s 2nd parameter to provide a value:
 - Example emitter: `@click="$emit('doSomething', withThisObj)"`
 - Example listener: `@doSomething="foo(withThisObj)"`
- **A SHARED EVENT BUS:** while the above methods are great for parent-child signals, for app-wide and inter-sibling component messaging, you can create a bare vue() instance, which is basically an object totally decoupled from the DOM _but which has vue's awesome event bus_ baked in... and you can just import that instance whenever you want to communicate with everything. example impl:
  - **method 1**: attach to `window` for instant globalness:
    - `window.Event = new vue();`
    - ... `Event.$emit(...)`, `Event.$on(...)` ...
  - **method 2**: create a shared lib:
    - 
    ```
    import Vue from 'vue';
    export const EventBus = new Vue();
    ```
    - then import this instance wherever needed:
    - `import { EventBus } from './event-bus.js';`
    - ... `EventBus.$emit(...)` ...

# life cycle
- mounted()


# vue-cli
```
npm install -g @vue/cli
vue create my-project
cd my-project
npm run serve #for dev
npm run build #for prod
```
There is no 'eject' as such. Prior to version 3, the webpack.config.js file was directly editable.
Now, it is entirely abstracted away. To make modifications, you modify the [vue.js.config](https://github.com/vuejs/vue-cli/blob/dev/docs/config.md) file instead and [modify webpack and other behaviour](https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md) there instead.

# watchers
2-way binding to deeply nested attributes in the 'data' object... basically doesn't work.
For that you will need **deep watchers**. See [here](https://stackoverflow.com/questions/42133894/vue-js-how-to-properly-watch-for-nested-properties) and [here](https://vuejs.org/v2/api/#watch)

# vue instance : properties and methods
When ready for more indepth understanding:
- https://vuejs.org/v2/api/#Instance-Properties
- https://vuejs.org/v2/api/#Instance-Methods-Data
- https://vuejs.org/v2/api/#Instance-Methods-Events
- https://vuejs.org/v2/api/#Instance-Methods-Lifecycle
- https://vuejs.org/v2/api/#Directives