# json-logic-vue

[![Demo](https://img.shields.io/badge/-demo-blue)](https://mattsouth.github.io/json-logic-vue/?expr=!flag&context=%5B%7B%22name%22%3A%22flag%22%2C%22values%22%3A%5Bnull%2Cfalse%2Ctrue%5D%7D%5D)

A collection of web components for viewing and evaluating [JsonLogic](https://jsonlogic.com) expressions written in [vue3](https://vuejs.org/) and [bootstrap5](https://getbootstrap.com) with a "sandbox" [demo](https://mattsouth.github.io/json-logic-vue/?expr=!flag&context=%5B%7B%22name%22%3A%22flag%22%2C%22values%22%3A%5Bnull%2Cfalse%2Ctrue%5D%7D%5D).

## Notes

Skeleton created with [Vue CLI](https://cli.vuejs.org/) (v4.5.13).

Useful:

* https://stackoverflow.com/questions/65547199/using-bootstrap-5-with-vue-3
* https://github.com/CarterLi/vue3-ace-editor
* https://stackoverflow.com/questions/62023604/where-to-find-or-how-to-set-htmlwebpackplugin-options-title-in-project-created-w

## TODO

- [x] mock up demo
- [x] ignore context variables not used in the expression
- [x] edit context values
- [ ] sortable evaluation table
- [x] new expression button
- [x] share with url
- [x] deploy to github pages
- [ ] autocomplete in the text editor
- [ ] validation in the json editor
- [ ] autocomplete in the json editor
- [ ] visual editor (frame-based?)

### Frame based editors

Getting the usability of a visual expression editor right is tricky, especially one that can support beginners and experts.  Some interesting ideas are here:

* https://microbit.org/news/2022-02-24/introducing-strype-a-framebased-editor/
* https://www.greenfoot.org/frames/
