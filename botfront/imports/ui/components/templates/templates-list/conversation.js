$(document).ready(function () {
    $('.agent-name').text(JSON.parse(localStorage.getItem('agent'))['name'])
    getUsers()
    getAgents()
    $('.user-chat').hide()
    $('.chat-leftsidebar').hide()
});


function appendUserToList(user) {
    $(' <li class="list"><a href="javascript:void(0)"><div class="d-flex align-items-start"><div class="flex-shrink-0 me-3 align-self-center"><div class="user-img online"><img src="https://images.all-free-download.com/images/graphiclarge/man_in_the_hat_202625.jpg" class="rounded-circle avatar-xs" alt=""></div></div><div class="flex-grow-1 overflow-hidden"><h5 class="text-truncate font-size-14 mb-1 userName"> ' + user.name + '  </h5><p class="text-truncate mb-0"> ' + user.message + '  </p></div><div class="flex-shrink-0"> <span class="timeAgo" style="display:none"> ' + user.time + ' </span><span class="userId" style="display:none"> ' + user.user + ' </span><div class="font-size-10 time"></div></div></div></a></li>').appendTo('.chat-list')
}

//on list item click
function click(l, index) {
    list.forEach(x => { x.classList.remove("active"); });
    if (l) {
        l.classList.add("active");
        getConversations(l.querySelector(".userId").innerText.trim())
        userName = l.querySelector(".userName").innerText,
        userTime = l.querySelector(".time").innerText;
  
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
            $('.chat-leftsidebar').show()
            $('.list').remove()
            for (i = 0; i < data.length; i++) {
                appendUserToList(data[i])
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
                    if (event.which == 3){
                        alert("This user's Id is: "+l.querySelector(".userId").innerText.trim())
                    }
                });
            });


            setInterval(function () {
                $(".list").each(function () {
                    date_before = Date.parse($(this).find('.timeAgo').text());
                    date_now = Date.now();

                    seconds = Math.floor((date_now - (date_before)) / 1000);
                    minutes = Math.floor(seconds / 60);
                    hours = Math.floor(minutes / 60);

                    days = Math.floor(hours / 24);
                    hours = hours - (days * 24);
                    minutes = minutes - (days * 24 * 60) - (hours * 60);
                    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                    if (days > 1) {
                        $(this).find('.time').text(days + " days ago")
                    } else {
                        if (hours > 1) {
                            $(this).find('.time').text(hours + " hours ago")
                        } else {
                            if (minutes > 1) {
                                $(this).find('.time').text(minutes + " minutes ago")
                            } else {
                                $(this).find('.time').text(seconds + " seconds ago")
                            }
                        }
                    }
                })
            }, 1000)
        },
        error: function (err) {
            console.log('Something wrong happened on fetching users!')
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
            $('.user-chat').show()
            $('.message').remove()
            for (i = 0; i < data.length; i++) {
                insertUserMessage(data[i]['message'], data[i]['time'])
                replies = data[i]['replies']
                for (const key in replies) {
                    insertBotMessage(replies[key].replace(/\n/g,"</br>"));
                }
            }
            $('.message').slice(-1)[0].scrollIntoView({block: "end"});
        },
        error: function (err) {
            console.log('Something wrong happened on fetching users!')
        }
    });
}


function insertUserMessage(msg, timeSent){
    $('<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> '+msg+' </p><span class="d-inline-block font-size-12 text-muted ms-2"> '+(new Date(timeSent)).toTimeString().substr(0,5)+' </span></div></div></div></li>').appendTo('.userChats')
}


function insertBotMessage(msg){
    $('<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> '+msg.replace(/\n/g,"</br>")+' </p></div></div></div></li>').appendTo('.userChats')
}

function send(text) {
    $.ajax({
        url: 'https://belltro.xyz:5072/web',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "From": JSON.parse(localStorage.getItem('agent'))['id'],
            "Body": text
        }),
        success: function (data) {
            processResponse(data)

        },
        error: function (err) {
            console.log('Something wrong happened!')
        }
    });
}

async function processResponse(data) {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    for (var i = 0; i < data.length; i++) {
        if (data[i]["image"]) { //check if there are any images
            // msg += '<p class="botResult"><img  width="200" height="124" src="' + data[i].image + '/"></p><div class="clearfix"></div>';
        } else {
            botMessage(data[i].text)
            await timer(3000);
        }
    }
    $('.message').slice(-1)[0].scrollIntoView({block: "end"})
}


function botMessage(msg){
    $('<li class="message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> '+msg.replace(/\n/g,"</br>")+' </p></div></div></div></li>').appendTo('.userChats')
}


function insertMessage() {
    msg = $('.chat-input').val();
    if ($.trim(msg) == '') {
        return false;
    }
    
    $('<li class="right message"><div class="conversation-list"><div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0"> '+msg+' </p><span class="d-inline-block font-size-12 text-muted ms-2"> '+(new Date()).toTimeString().substr(0,5)+' </span></div></div></div></li>').appendTo('.userChats')
    $('.chat-input').val(null);
    send(msg);
    $('.message').slice(-1)[0].scrollIntoView({block: "end"});    
}

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        insertMessage();
        return false;
    }
})


setInterval(function() {
    getUsers()
}, 30000)