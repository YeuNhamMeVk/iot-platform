$(document).ready(() => {
  $.getJSON('/js/users/user.json', (model) => onJSON(model))
})

function onJSON(model) {
  $.get('/menu.mustache', (view) => {
    const content = Mustache.render(view, model)
    $('#menu').append(content)
  })
}
