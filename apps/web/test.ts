import markdownit from 'markdown-it'
import TurndownService from 'turndown'


const x = `
### Introduction to Eagle Info Solutions

Eagle Info Solutions is a computer retail and repair company dedicated to providing top-notch technology solutions to various industries, including farming and agriculture.

### Our Services

We offer a range of services that can benefit your business, including computer retail and repair.

### Why Partner with Us

By partnering with Eagle Info Solutions, Mercury Computers Limited can leverage our expertise in technology solutions to enhance your e-commerce platform and improve customer experience.

### Contact Us

To learn more about our services and how we can help Mercury Computers Limited, please visit our website at [www.eagleinfosolutions.com](http://www.eagleinfosolutions.com) or email us at [info@eagleinfosolutions.com](mailto:info@eagleinfosolutions.com).

### Location

You can also visit us at Nalubega complex, Room L28, Opp Watoto Church to discuss how we can work together to drive your business forward.
`

const md = markdownit()
const result = md.render(x);

console.log(result)
console.log("______________________________")

const turndownService = new TurndownService()
const markdown = turndownService.turndown(result)

console.log(markdown)
