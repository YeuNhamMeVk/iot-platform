$(document).ready(() => {
  $.getJSON('/js/users/test.json', (model) => onJSON(model))
})

function onJSON(model) {
  $.get('/html/users/user_template.mustache', (view) => {
    $.each(model, (index, item) => {
      const content = Mustache.render(view, item)
      $('#content').append(content)
    })
  })
}
