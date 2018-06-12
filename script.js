// Scroll to top of page
$(".navbar-brand").click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 500);
});

// Scroll to About Section
$("#about-nav").click(function () {
  $('html, body').animate({
    scrollTop: $("#about").offset().top
  }, 500);
});

// Scroll to Portfolio Section
$("#port-nav").click(function () {
  $('html, body').animate({
    scrollTop: $("#portfolio").offset().top
  }, 500);
});

// Scroll to Contact Section
$("#cont-nav").click(function () {
  $('html, body').animate({
    scrollTop: $("#contact").offset().top
  }, 500);
});
