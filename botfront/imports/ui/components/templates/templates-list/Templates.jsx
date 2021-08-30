import React from "react";
import './bootstrap.min.css';
import './icons.min.css';
import './app.min.css';
import $ from 'jquery';
// import { Icon } from '@iconify/react';

export default function MyComponent() {
    return (  
      <div className="page-content" >
      <div className="container-fluid">
        <div className="d-lg-flex mb-4 mike" id="mike">
          <div className="chat-leftsidebar card">
            <div className="p-3">
              <div className="search-box chat-search-box">
                <div className="position-relative">
                  <input type="text" className="form-control bg-light border-light rounded" placeholder="Search..." />
                </div>
              </div>
            </div>
            <div className="pb-3">
               <div data-simplebar style={{maxHeight: '470px'}}>
                <div>
                  <div>
                    <ul className="list-unstyled chat-list">
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-1 chat-rightside ">
          {/* <div className="user-chat card"> */}
          <div className="card" style={{minHeight: "850px"}}>
            <div className="p-3 px-lg-4 border-bottom contentHeader">
              <div className="row">
              {/* <div className="col-md-4 col-6"> */}
                <div className="col-md-12 col-12">
                  <h5 className="font-size-16 mb-0 text-truncate"><a href="javascript:void(0)" className="text-dark userName" /></h5>
                  <p className="text-muted text-truncate mb-0 userTime" />
                </div>
              </div>
            </div>
            <div className="px-lg-2" id="test">
              <div className="chat-conversation p-3">
                    <ul className="list-unstyled mb-0 userChats " data-simplebar style={{maxHeight: '455px'}}>
                    </ul>
                  </div>
                </div>
                <div className="p-3 chat-input-section">
              <div className="row">
                <div className="col">
                  <div className="position-relative">
                    <input type="text" className="form-control chat-input rounded"  placeholder="Enter Message..." />
                  </div>
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block me-2">Send</span></button>
                </div>
              </div>
            </div>
              </div>

            </div>
          </div>
        </div>
        </div>
      // </div>
    // </div>
    );
};

function initFingerprintJS() {
  const fpPromise = FingerprintJS.load();
  fpPromise.then(fp => fp.get()).then(result => {
    window.sender_id = result.visitorId;
    console.log(window.sender_id);
  }).catch(error => console.error(error));
}

$(document).ready(function () {
  $('.agent-name').text(JSON.parse(localStorage.getItem('agent'))['name']);
  // getUsers();
  setInterval(function () {
    getUsers();
  }, 10000);
  initFingerprintJS();
  $('.user-chat').hide();
  $('.chat-leftsidebar').hide();
});

function appendUserToList(user) {
  $(' <li class="list"><a href="javascript:void(0)"><div class="d-flex align-items-start"><div class="flex-shrink-0 me-3 align-self-center"><div class="user-img online"><img src="https://images.all-free-download.com/images/graphiclarge/man_in_the_hat_202625.jpg" class="rounded-circle avatar-xs" alt=""></div></div><div class="flex-grow-1 overflow-hidden"><h5 class="text-truncate font-size-14 mb-1 userName"> ' + user.name + '  </h5><p class="text-truncate mb-0"> ' + user.message + '  </p></div><div class="flex-shrink-0"> <span class="timeAgo" style="display:none"> ' + user.time + ' </span><span class="userId" style="display:none"> ' + user.user + ' </span><div class="font-size-10 time"></div></div></div></a></li>').appendTo('.chat-list');
} //on list item click


function click(l, index) {
  list.forEach(x => {
    x.classList.remove("active");
  });

  if (l) {
    l.classList.add("active");
    getConversations(l.querySelector(".userId").innerText.trim());
    userName = l.querySelector(".userName").innerText, userTime = l.querySelector(".time").innerText;
    content.querySelector(".userName").innerHTML = userName;
    content.querySelector(".userTime").innerHTML = userTime;
  }
}

function getUsers() {
  $.ajax({
    url: 'https://belltro.xyz:5072/users',
    headers: {
      'Content-Type': 'application/json'
    },
    type: 'GET',
    success: function (data) {
      $('.chat-leftsidebar').show();
      $('.list').remove();

      for (i = 0; i < data.length; i++) {
        appendUserToList(data[i]);
      }

      list = document.querySelectorAll(".list");
      content = document.querySelector(".contentHeader");
      list.forEach((l, i) => {
        l.addEventListener("click", function () {
          click(l, i);
        });
      });
      list.forEach((l, i) => {
        l.addEventListener("mousedown", function (event) {
          if (event.which == 3) {
            alert("This user's Id is: " + l.querySelector(".userId").innerText.trim());
          }
        });
      });
      setInterval(function () {
        $(".list").each(function () {
          date_before = Date.parse($(this).find('.timeAgo').text());
          date_now = Date.now();
          seconds = Math.floor((date_now - date_before) / 1000);
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);
          days = Math.floor(hours / 24);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

          if (days > 1) {
            $(this).find('.time').text(days + " days ago");
          } else {
            if (hours > 1) {
              $(this).find('.time').text(hours + " hours ago");
            } else {
              if (minutes > 1) {
                $(this).find('.time').text(minutes + " minutes ago");
              } else {
                $(this).find('.time').text(seconds + " seconds ago");
              }
            }
          }
        });
      }, 1000);
    },
    error: function (err) {
      console.log('Something wrong happened on fetching users!');
    }
  });
}

function getConversations(userId) {
  $.ajax({
    url: 'https://belltro.xyz:5072/conversations',
    headers: {
      'Content-Type': 'application/json'
    },
    type: 'GET',
    data: {
      userId: userId
    },
    success: function (data) {
      $('.user-chat').show();
      $('.message').remove();

      for (i = 0; i < data.length; i++) {
        insertUserMessage(data[i]['message'], data[i]['time']);
        replies = data[i]['replies'];

        for (const key in replies) {
          insertBotMessage(replies[key]);
        }
      }

      $('.message').slice(-1)[0].scrollIntoView({
        block: "end"
      });
    },
    error: function (err) {
      console.log('Something wrong happened on fetching users!');
    }
  });
}

function insertUserMessage(msg, timeSent) {
  $('<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' + msg + ' </p><span class="d-inline-block font-size-12 text-muted ms-2"> ' + new Date(timeSent).toTimeString().substr(0, 5) + ' </span></div></div></div></li>').appendTo('.userChats');
}

function insertBotMessage(msg) {
  $('<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' + msg + ' </p></div></div></div></li>').appendTo('.userChats');
}

function send(text) {
  $.ajax({
    url: 'https://belltro.xyz:5072/web',
    type: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      "From": sender_id,
      "Body": text
    }),
    success: function (data) {
      console.log(data);
      processResponse(data);
    },
    error: function (err) {
      console.log('Something wrong happened!');
    }
  });
}

async function processResponse(data) {
  const timer = ms => new Promise(res => setTimeout(res, ms));

  for (var i = 0; i < data.length; i++) {
    if (data[i]["image"]) {//check if there are any images
      // msg += '<p class="botResult"><img  width="200" height="124" src="' + data[i].image + '/"></p><div class="clearfix"></div>';
    } else {
      botMessage(data[i].text);
      await timer(3000);
    }
  }

  $('.message').slice(-1)[0].scrollIntoView({
    block: "end"
  });
}

function botMessage(msg) {
  $('<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' + msg + ' </p></div></div></div></li>').appendTo('.userChats');
}

function insertMessage() {
  msg = $('.chat-input').val();

  if ($.trim(msg) == '') {
    return false;
  }

  $('<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' + msg + ' </p><span class="d-inline-block font-size-12 text-muted ms-2"> ' + new Date().toTimeString().substr(0, 5) + ' </span></div></div></div></li>').appendTo('.userChats');
  $('.chat-input').val(null);
  send(msg);
  $('.message').slice(-1)[0].scrollIntoView({
    block: "end"
  });
}

$(window).on('keydown', function (e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});
setInterval(function () {
  getUsers();
}, 30000);
