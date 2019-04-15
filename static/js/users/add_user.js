$('button#submit').click(() => {
  $.post('/js/users/add_user', $('form#user_form').serialize(), (data) => {
    if (data === 'ok') {
      window.location.href = '#users/all.html'
    }
  },
  'json'
  )
})
