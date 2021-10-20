import React from 'react';
import './bootstrap.min.css';
import './icons.min.css';
import './app.min.css';
import $ from 'jquery';
// import { Icon } from '@iconify/react';

export default function MyComponent() {
    return (
        <div className='page-content'>
            <div className='container-fluid'>
                <div className='d-lg-flex mb-4 mike' id='mike'>
                    <div className='chat-leftsidebar card'>
                        <div className='p-3'>
                            <div className='search-box chat-search-box'>
                                <div className='position-relative'>
                                    <input
                                        type='text'
                                        className='form-control bg-light border-light rounded'
                                        placeholder='Search...'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='pb-3'>
                            <div data-simplebar style={{ maxHeight: '470px' }}>
                                <div>
                                    <div>
                                        <ul className='list-unstyled chat-list'></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-100 user-chat mt-4 mt-sm-0 ms-lg-1 chat-rightside '>
                        {/* <div className="user-chat card"> */}
                        <div className='card' style={{ minHeight: '850px' }}>
                            <div className='p-3 px-lg-4 border-bottom contentHeader'>
                                <div className='row'>
                                    {/* <div className="col-md-4 col-6"> */}
                                    <div className='col-md-12 col-12'>
                                        <h5 className='font-size-16 mb-0 text-truncate'>
                                            <a
                                                href='javascript:void(0)'
                                                className='text-dark userName'
                                            />
                                        </h5>
                                        <p className='text-muted text-truncate mb-0 userTime' />
                                    </div>
                                </div>
                            </div>
                            <div className='px-lg-2' id='test'>
                                <div id='ul-convtainer' className='chat-conversation p-3'>
                                    <ul
                                        className='list-unstyled mb-0 userChats '
                                        data-simplebar
                                        style={{ maxHeight: '455px' }}
                                    ></ul>
                                </div>
                            </div>
                            <div className='p-3 chat-input-section'>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control chat-input rounded'
                                                placeholder='Enter Message...'
                                            />
                                        </div>
                                    </div>
                                    <div className='col-auto'>
                                        <button
                                            type='submit'
                                            className='btn btn-primary chat-send w-md waves-effect waves-light'
                                        >
                                            <span className='d-none d-sm-inline-block me-2'>
                                                Send
                                            </span>
                                        </button>
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
}

var clientID = Date.now();
var ws = new WebSocket(`ws://localhost:8002/ws/${clientID}`);
var jsonObj;
// var fillUsers = true;
var handoff = false;
var handoff_checker = false;

$(document).ready(function () {
    // clientID = Date.now();
    // ws = new WebSocket(`ws://localhost:8002/ws/${clientID}`);
    $('.agent-name').text(JSON.parse(localStorage.getItem('agent'))['name']);
    getUsers();
    getAgents();
    $('.user-chat').hide();
    $('.chat-leftsidebar').hide();
    // intervalSet = true;
    // sessionStorage.setItem("fillUsers", "true");
});

function processMessage(event) {
    // if(event.data.split(":")[0].includes(clientID)){
    //     insertUserMessage(event.data.split(": ")[1]);
    // }else{
    //     insertBotMessage(event.data.split(": ")[1]);
    // }
    handoff = true;
    sendAgentWeb(event.data);
}

ws.onmessage = processMessage;

function appendUserToList(user) {
    // user_time = user.time*1000;
    // alert(user_time);
    $(
        ' <li class="list"><a href="javascript:void(0)"><div class="d-flex align-items-start"><div class="flex-shrink-0 me-3 align-self-center"><div class="user-img online"><img src="https://images.all-free-download.com/images/graphiclarge/man_in_the_hat_202625.jpg" class="rounded-circle avatar-xs" alt=""></div></div><div class="flex-grow-1 overflow-hidden"><h5 class="text-truncate font-size-14 mb-1 userName"> ' +
            user.user +
            '  </h5><p class="text-truncate mb-0"> ' +
            user.message +
            '  </p></div><div class="flex-shrink-0"> <span class="timeAgo" style="display:none"> ' +
            user.time * 1000 +
            ' </span><span class="userId" style="display:none"> ' +
            user.user +
            ' </span><div class="font-size-10 time"></div></div></div></a></li>'
    ).appendTo('.chat-list');

    // alert(user.name + "    " + (user.user));
}

function appendUserWebToList(user) {
    $(
        ' <li class="list"><a href="javascript:void(0)"><div class="d-flex align-items-start"><div class="flex-shrink-0 me-3 align-self-center"><div class="user-img online"><img src="https://images.all-free-download.com/images/graphiclarge/man_in_the_hat_202625.jpg" class="rounded-circle avatar-xs" alt=""></div></div><div class="flex-grow-1 overflow-hidden"><h5 class="text-truncate font-size-14 mb-1 userName"> ' +
            user['clientID'][user['clientID'].length - 1].time +
            '  </h5><p class="text-truncate mb-0"> ' +
            user['clientID'][user['clientID'].length - 1].userMessage +
            '  </p></div><div class="flex-shrink-0"> <span class="timeAgo" style="display:none"> ' +
            user['clientID'][user['clientID'].length - 1].time +
            ' </span><span class="userId" style="display:none"> ' +
            user['clientID'][user['clientID'].length - 1].time +
            ' </span><div class="font-size-10 time"></div></div></div></a></li>'
    ).appendTo('.chat-list');
}

//on list item click
function click(l, index) {
    list.forEach((x) => {
        x.classList.remove('active');
    });
    if (l) {
        l.classList.add('active');

        // if(handoff_checker){
        //     // console.log(localStorage.getItem("web_user")['clientID']);
        //     getWebConversations(jsonObj['clientID']);
        //     handoff_checker = false;
        // }else{
        //     getConversations(l.querySelector('.userId').innerText.trim());
        //     handoff_checker = true;
        // }

        getConversations(l.querySelector('.userId').innerText.trim());

        // getWebConversations(JSON.parse(localStorage.getItem("web_user")));
        (userName = l.querySelector('.userName').innerText),
            (userTime = l.querySelector('.time').innerText);

        content.querySelector('.userName').innerHTML = userName;
        content.querySelector('.userTime').innerHTML = userTime;
    }
    $('.chat-send').click(function () {
        msg = $('.chat-input').val();
        if (msg != '') {
            insertMessage();
        }
    });
}

//on list item click
function clickWeb(l, index) {
    list.forEach((x) => {
        x.classList.remove('active');
    });
    if (l) {
        l.classList.add('active');

        if(handoff_checker){
            // console.log(localStorage.getItem("web_user")['clientID']);
            getWebConversations(jsonObj['clientID']);
            handoff_checker = false;
        }else{
            getConversations(l.querySelector('.userId').innerText.trim());
            handoff_checker = true;
        }

        // getWebConversations(jsonObj['clientID']);
        (userName = l.querySelector('.userName').innerText),
            (userTime = l.querySelector('.time').innerText);

        content.querySelector('.userName').innerHTML = userName;
        content.querySelector('.userTime').innerHTML = userTime;
    }
    $('.chat-send').click(function () {
        msg = $('.chat-input').val();
        if (msg != '') {
            insertMessage();
        }
    });
}

function getWebUsers(data) {
    // $('.chat-leftsidebar').show();
    // $('.list').remove();
    // for (i = data.length - 1; i >= 0; i--) {
    //     appendUserToList(data[i]);
    // }
    console.log(data);
    appendUserWebToList(data);

    list = document.querySelectorAll('.list');
    content = document.querySelector('.contentHeader');
    list.forEach((l, i) => {
        l.addEventListener('click', function () {
            click(l, i);
        });
    });

    list.forEach((l, i) => {
        l.addEventListener('mousedown', function (event) {
            if (event.which == 3) {
                alert(
                    "This user's Id is: " + l.querySelector('.userId').innerText.trim()
                );
            }
        });
    });

    setInterval(function () {
        $('.list').each(function () {
            // alert("here: " + $(this).find('.timeAgo').text());
            date_before = $(this).find('.timeAgo').text();
            date_now = Date.now();

            // alert(date_before + "     " + date_now);

            seconds = Math.floor((date_now - date_before) / 1000);
            minutes = Math.floor(seconds / 60);
            hours = Math.floor(minutes / 60);

            days = Math.floor(hours / 24);
            hours = hours - days * 24;
            minutes = minutes - days * 24 * 60 - hours * 60;
            seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

            if (days > 1) {
                $(this)
                    .find('.time')
                    .text(days + ' days ago');
            } else {
                if (hours > 1) {
                    $(this)
                        .find('.time')
                        .text(hours + ' hours ago');
                } else {
                    if (minutes > 1) {
                        $(this)
                            .find('.time')
                            .text(minutes + ' minutes ago');
                    } else {
                        $(this)
                            .find('.time')
                            .text(seconds + ' seconds ago');
                    }
                }
            }
        });
    }, 1000);
}

function getUsers() {
    $.ajax({
        url: 'http://159.138.169.207:82/users',
        headers: {
            'Content-Type': 'application/json',
        },
        type: 'GET',
        success: function (data) {
            $('.chat-leftsidebar').show();
            $('.list').remove();
            for (i = data.length - 1; i >= 0; i--) {
                appendUserToList(data[i]);
            }

            if (handoff) appendUserWebToList(jsonObj);

            list = document.querySelectorAll('.list');
            content = document.querySelector('.contentHeader');
            list.forEach((l, i) => {
                l.addEventListener('click', function () {
                    click(l, i);
                });
            });

            list.forEach((l, i) => {
                l.addEventListener('mousedown', function (event) {
                    if (event.which == 3) {
                        alert(
                            "This user's Id is: " +
                                l.querySelector('.userId').innerText.trim()
                        );
                    }
                });
            });

            setInterval(function () {
                $('.list').each(function () {
                    // alert("here: " + $(this).find('.timeAgo').text());
                    date_before = $(this).find('.timeAgo').text();
                    date_now = Date.now();

                    // alert(date_before + "     " + date_now);

                    seconds = Math.floor((date_now - date_before) / 1000);
                    minutes = Math.floor(seconds / 60);
                    hours = Math.floor(minutes / 60);

                    days = Math.floor(hours / 24);
                    hours = hours - days * 24;
                    minutes = minutes - days * 24 * 60 - hours * 60;
                    seconds =
                        seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

                    if (days > 1) {
                        $(this)
                            .find('.time')
                            .text(days + ' days ago');
                    } else {
                        if (hours > 1) {
                            $(this)
                                .find('.time')
                                .text(hours + ' hours ago');
                        } else {
                            if (minutes > 1) {
                                $(this)
                                    .find('.time')
                                    .text(minutes + ' minutes ago');
                            } else {
                                $(this)
                                    .find('.time')
                                    .text(seconds + ' seconds ago');
                            }
                        }
                    }
                });
            }, 1000);
        },
        error: function (err) {
            console.log('Something wrong happened on fetching users!');
        },
    });
}

function getWebConversations(data) {
    $('.user-chat').show();
    $('.message').remove();
    for (i = 0; i < data.length; i++) {
        insertUserMessage(data[i]['userMessage'], data[i]['time']);
        replies = data[i]['agentMessage'];
        // for (const key in replies) {
        //     insertBotMessage(replies[key].replace(/\n/g, '</br>'));
        // }
        insertBotMessage(replies);
    }
    $('.message').slice(-1)[0].scrollIntoView({ block: 'end' });
}

function getConversations(userId) {
    // alert("========" + userId);
    $.ajax({
        url: 'http://159.138.169.207:82/conversation',
        headers: {
            'Content-Type': 'application/json',
        },
        type: 'GET',
        data: {
            user_id: userId.replace('+', ' '),
        },
        success: function (data) {
            // alert(">>>>>>>>>>>>>" + data);
            $('.user-chat').show();
            $('.message').remove();
            for (i = 0; i < data.length; i++) {
                insertUserMessage(data[i]['message'], data[i]['time']);
                replies = data[i]['replies'];
                for (const key in replies) {
                    insertBotMessage(replies[key].replace(/\n/g, '</br>'));
                }
            }
            $('.message').slice(-1)[0].scrollIntoView({ block: 'end' });
        },
        error: function (err) {
            console.log('Something wrong happened on fetching users!');
        },
    });
}

function insertUserMessage(msg, timeSent) {
    $(
        '<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' +
            msg +
            ' </p><span class="d-inline-block font-size-12 text-muted ms-2"> ' +
            new Date(timeSent).toTimeString().substr(0, 5) +
            ' </span></div></div></div></li>'
    ).appendTo('.userChats');
}

function insertBotMessage(msg) {
    $(
        '<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' +
            msg.replace(/\n/g, '</br>') +
            ' </p></div></div></div></li>'
    ).appendTo('.userChats');
}

function send(text) {
    $.ajax({
        url: 'https://belltro.xyz:5072/web',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            // "From": JSON.parse(localStorage.getItem('agent'))['id'],
            From: '1234567',
            Body: text,
        }),
        success: function (data) {
            processResponse(data);
        },
        error: function (err) {
            console.log('Something wrong happened!');
        },
    });
    // console.log(sessionStorage.getItem("fillUsers"));

    // if (fillUsers) {
    //     console.log(
    //         '-----------------------------------------------------' +
    //             text.substring(text.indexOf(': ') + 1)
    //     );
    //     // alert(text);
    //     const obj = JSON.parse(text.substring(text.indexOf(': ') + 1));
    //     jsonObj = obj;
    //     getWebUsers(obj);
    //     fillUsers = false;
    //     // sessionStorage.setItem("fillUsers", "false");
    // }else{
    //     botMessage(text);
    // }
}

//################################################################## sendAgentWeb ############################################################
function sendAgentWeb(text) {
    // if (fillUsers) {
    //     console.log(
    //         '-----------------------------------------------------' +
    //             text.substring(text.indexOf(': ') + 1)
    //     );
    //     // alert(text);
    //     json = text.substring(text.indexOf(': ') + 1);
    //     jsons = json.substring(json.indexOf(' ') + 1);
    //     const obj = JSON.parse(text.substring(text.indexOf(': ') + 1));
    //     jsonObj = obj

    //     // Check browser support
    //     if (typeof Storage !== 'undefined') {
    //         console.log(text.substring(text.indexOf(': ') + 1));
    //         // Store
    //         localStorage.setItem('web_user', jsonObj);
    //     } else {
    //         alert('Sorry, your browser does not support Web Storage...');
    //     }
    //     getWebUsers(obj);
    //     fillUsers = false;
    //     handoff = true;
    //     handoff_checker = true;
    //     // sessionStorage.setItem("fillUsers", "false");
    // } else {
    //     botMessage(text);
    // }

    botMessage(text);
}

async function processResponse(data) {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    for (var i = 0; i < data.length; i++) {
        if (data[i]['image']) {
            //check if there are any images
            // msg += '<p class="botResult"><img  width="200" height="124" src="' + data[i].image + '/"></p><div class="clearfix"></div>';
        } else {
            botMessage(data[i].text);
            await timer(3000);
        }
    }
}

function botMessage(msg) {
    if (!msg.includes(clientID)) {
        msg = msg.substring(msg.indexOf(': ') + 1);
        $(
            '<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' +
                msg.replace(/\n/g, '</br>') +
                ' </p></div></div></div></li>'
        ).appendTo('.userChats');
        // jQuery('#ul-convtainer').animate(
        //     { scrollTop: jQuery('.scrolltome').offset().top },
        //     'slow'
        // );
    }
}

function insertMessage() {
    msg = $('.chat-input').val();
    if ($.trim(msg) == '') {
        return false;
    }

    $(
        '<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> ' +
            msg +
            ' </p><span class="d-inline-block font-size-12 text-muted ms-2"> ' +
            new Date().toTimeString().substr(0, 5) +
            ' </span></div></div></div></li>'
    ).appendTo('.userChats');
    $('.chat-input').val(null);

    // if(handoff){
    //     ws.send(msg);
    // }else{
    //     send(msg);
    // }
    ws.send(msg);

    $('.message').slice(-1)[0].scrollIntoView({ block: 'end' });
    $('.userChats').scrollTop($('.userChats').height());
}

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        insertMessage();
        return false;
    }
});

function scrollToBottomOfResults() {
    const terminalResultsDiv = document.getElementById('chats');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

setInterval(function () {
    getUsers();
}, 10000);
