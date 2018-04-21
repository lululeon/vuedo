# vue structure
```js
{
  el,   //root dom element
  data, //data model
  methods,
  computed, //remember to refer to model elements using "this" !!!
  mounted()
}
```

# vue concepts
- vue directives (v-model, v-for, etc)
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

## directives
directives take arguments, eg:
  - `v-on:click` ... "click" is the argument
  - `v-bind:attr` ... bind an element attribute named 'attr'.

## anatomy of a component:
You would create these in a .vue file.

With vetur installed, you can do `ctrl+space,t`, `ctrl+space,s` etc to get the following code snippets inserted for you. Example:
```
<template>
  
</template>

<script>
export default {
  
}
</script>

<style>

</style>
```

# life cycle
- mounted()


# snippets

