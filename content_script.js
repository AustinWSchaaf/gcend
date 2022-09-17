
console.log('content script');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (message.action === "run" && !isNull('.box-title')) {
        sendResponse('on');
        console.log('run');
        run();
    }
    console.log('hello'); 
    sendResponse('complete'); 
    if (chrome.runtime.lastError) {} 
    return true;
});

function run() {
    
    if (isNull('.box-title')) {
        console.log('UNABLE TO RUN');
        return;
    }
    console.log('RUN');
    var slides = document.querySelectorAll('div[data-slide-rank]');
    console.log(slides.length);
    var i = 0;
    var begin = setInterval(function(){
        if (i < slides.length) load_next_slide();
        else quit();
        i++;
    }, 50);

    function quit() {
        console.log('quiting interval');
        clearInterval(begin);
        process_tutorial();
    }
    function load_next_slide() {
        current_slide_nav = $('.slide-cur').parent(); 
        current_slide_num = current_slide_nav.attr('data-slide'); 
        current_slide_type = $('.tut-slides-bot').attr('data-slide-type');
        next_slide_nav = $('.slide-cur').parent().next();
        next_slide_num = next_slide_nav.attr('data-slide');
        $.post('/cust/tutorial_user_progress/public/ajaxhosts/next-slide.php',{ 'current-slide':current_slide_num,'next-slide':next_slide_num,'slide-type':current_slide_type,'answer':$('input[name="ans"]:checked').val(), 'tutorial' : $('.tut-slides').attr('data-tutorial') }, function(data) {
            $('#slide-wrapper').attr("data-slide",next_slide_num);
            
            //$('.slide-cur').removeClass('viewed');
            $('.slide-cur').removeClass('slide-cur').addClass('completed');
            next_slide_nav.find('div.tut-slides-title').addClass('slide-cur viewed');
            $('#current-slide').html($('.slide-cur').parent().attr('data-slide-rank'));
            
            if(false && slideCount > 29){
                location.reload(1);
            }
        });
    }

    function process_tutorial() {        
        $.ajax({
            url: "/cust/tutorial_user_progress/public/ajaxhosts/process-tutorial-completion.php",
            cache: false
        }).done(function(data) {
            if (data == 'complete') {
                chrome.runtime.sendMessage('off', (response) => {
                    console.log(repsonse);
                    if (chrome.runtime.lastError) {}
                    return true;
                });
                document.location = '/tutorials/complete.html';
            } else if (data === 'lti fail') {
                document.location = '/tutorials/complete.html';
            
            }
            
        });
    }
}

function isNull(name) {
    try {
        var el = document.querySelector(name).textContent;
        return false;
    }catch(e) {
        return true;
    }
}