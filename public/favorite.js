var $n = $('.click').length;
var $i;
var $str;

for($i = 1;$i <= $n; $i++){
    $str = ".star-" + $i;
    console.log($str)
    $($str).click(function() {
        // kalo udah kepencet
        if ($('span').hasClass("fa-star")) {
            console.log("bisa mati")
                $('.click').removeClass('active')
            setTimeout(function() {
                $('.click').removeClass('active-2')
            }, 30)
                $('.click').removeClass('active-3')
                $('.click').removeClass('active-4')
            setTimeout(function() {
                $('span').removeClass('fa-star')
                $('span').addClass('fa-star-o')
            }, 15)
        }
        // kalo belum kepencet
        else {
            console.log("bisa hidup")
            $('.click').addClass('active')
            $('.click').addClass('active-2')
            setTimeout(function() {
                $('span').addClass('fa-star')
                $('span').removeClass('fa-star-o')
            }, 150)
            setTimeout(function() {
                $('.click').addClass('active-3')
            }, 150)
            setTimeout(function() {
                $('.click').addClass('active-4')
            }, 500)
            $('.info').addClass('info-tog')
            setTimeout(function(){            
                $('.info').removeClass('info-tog')
            },1000)
        }
    });
}