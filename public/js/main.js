function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
const loadStaff = () => {
  $.ajax( {
    type: 'GET',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
    },
    url: 'http://evosup.ru/api/v1.0/staff',
    success: (msg) => {
      document.querySelector('#staff-list').innerHTML = '';
      const staffList = JSON.parse(msg);
      for (let staff of staffList) {
        let insertCode = '<div><b>';
        switch(staff.status) {
          case 1:
            insertCode += 'Currier';
            break;
          case 2:
            insertCode += 'Operator';
            break;
          case 3:
            insertCode += 'Admin';
            break;
        }
        insertCode += '</b><br>';
        insertCode += `<span>${staff.login}</span></div>`;
        document.querySelector('#staff-list').innerHTML += insertCode;
      }
      document.querySelector('#staff').style.display = 'block';
      document.querySelector('#reg-staff input[type=button]').onclick = regStaff;
    }
  });
}
const sendMessage = () => {
  $.ajax( {
    type: 'POST',
    beforeSend: (request) => {
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('accesstoken', accessToken);
      request.setRequestHeader('chatid', selectedChat);
    },
    data: `{"text": "${document.querySelector('#messenger-form textarea').value}"}`,
    url: 'http://evosup.ru/api/v1.0/message',
    success: (msg) => {
      document.querySelector('#messenger-form textarea').value = '';
    }
  });
}
const loadChat = (chatId) => {
  $.ajax( {
    type: 'GET',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
      request.setRequestHeader('chatid', chatId);
    },
    url: 'http://evosup.ru/api/v1.0/chat',
    success: (msg) => {
      document.querySelector('#messages-list').innerHTML = '';
      const messagesList = JSON.parse(msg);
      console.log(messagesList);
      for (let message of messagesList) {
        let insertCode = `<div>`;
        if (message.fromorg != 0) 
          insertCode += `<i>Operator</i>: `;
        else
          insertCode += `<i>${message.username}</i>: `;
        insertCode += `<span>${message.text}</span></div>`;
        document.querySelector('#messages-list').innerHTML += insertCode;
      }
      document.querySelector('#messenger-form').style.display = 'block';
      document.querySelector('#messenger-form input[type=button]').onclick = sendMessage;
    }
  });
}
const loadChatsPreview = () => {
  $.ajax( {
    type: 'GET',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
    },
    url: 'http://evosup.ru/api/v1.0/chatsPreview',
    success: (msg) => {
      document.querySelector('#chats-list').innerHTML = '';
      const chatsList = JSON.parse(msg);
      for (let chat of chatsList) {
        let insertCode = `<div data-from="${chat.from}"><b>`;
        insertCode += chat.username
        insertCode += '</b>: ';
        insertCode += `<span>${chat.text}</span></div>`;
        document.querySelector('#chats-list').innerHTML += insertCode;
      }
      document.querySelectorAll('#chats-list > div').forEach(i => {
        i.onclick = () => {
          selectedChat = i.getAttribute('data-from');
          loadChat(i.getAttribute('data-from'))
        };
      });
      document.querySelector('#messenger').style.display = 'block';
    }
  });
}
let selectedChat = -1;

let accessToken = getCookie('accessToken');

if (accessToken === undefined) {
  document.querySelector('#login').style.display = 'block';
  document.querySelector('#register').style.display = 'block';
  document.querySelector('#login input[type=button]').onclick = () => {
    $.ajax({
      type: 'POST',
      beforeSend: (request) => {
        request.setRequestHeader('login', document.querySelector('#login input[name=login]').value);
        request.setRequestHeader('pass', document.querySelector('#login input[name=password]').value);
      },
      url: 'http://evosup.ru/api/v1.0/login',
      success: (msg) => {
        setCookie('accessToken', msg, {expires: 60 * 60 * 24 * 365});
        location.reload();
      }
    });
  }
  document.querySelector('#register input[type=button]').onclick = () => {
    $.ajax( {
      type: 'POST',
      beforeSend: (request) => {
        request.setRequestHeader('orgName', document.querySelector('#register input[name=orgName]').value);
        request.setRequestHeader('login', document.querySelector('#register input[name=login]').value);
        request.setRequestHeader('pass', document.querySelector('#register input[name=password]').value);
      },
      url: 'http://evosup.ru/api/v1.0/reg',
      success: (msg) => {
        setCookie('accessToken', msg, {expires: 60 * 60 * 24 * 365});
        location.reload();
      }
    });
  }
} else {
  $.ajax( {
    type: 'GET',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
    },
    url: 'http://evosup.ru/api/v1.0/settings',
    success: (msg) => {
      const settingsData = JSON.parse(msg);
      document.querySelector('#settings').style.display = 'block';
      document.querySelector('#settings input[name=balance]').value = settingsData.balance;
      document.querySelector('#settings input[name=orgName]').value = settingsData.title;
      document.querySelector('#settings textarea[name=description]').value = settingsData.description;
      document.querySelector('#settings input[name=botToken]').value = settingsData.botToken;
      document.querySelector('#settings input[type=button]').onclick = sendSettings;
    }
  });
  loadStaff();
  loadChatsPreview();
  setInterval(() => {
    if (selectedChat === -1) {
      loadChatsPreview();
    } else {
      loadChat(selectedChat);
    }
  }, 10000);
}

const sendSettings = () => {
  $.ajax( {
    type: 'POST',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
      request.setRequestHeader('Content-Type', 'application/json');
    },
    data: `{"title": "${document.querySelector('#settings input[name=orgName]').value}",` +
      `"description": "${document.querySelector('#settings textarea[name=description]').value}",` +
      `"botToken": "${document.querySelector('#settings input[name=botToken]').value}"}`,
    url: 'http://evosup.ru/api/v1.0/settings',
    success: (msg) => {
      console.log('ok');
    }
  });
}
const regStaff = () => {
  $.ajax( {
    type: 'POST',
    beforeSend: (request) => {
      request.setRequestHeader('accesstoken', accessToken);
        request.setRequestHeader('login', document.querySelector('#reg-staff input[name=login]').value);
        request.setRequestHeader('pass', document.querySelector('#reg-staff input[name=password]').value);
        request.setRequestHeader('status', document.querySelector('#reg-staff select').value);
    },
    url: 'http://evosup.ru/api/v1.0/regStaff',
    success: (msg) => {
      console.log('ok');
      loadStaff();
    }
  });
}