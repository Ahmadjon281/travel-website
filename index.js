let left = 9;
$(document).ready(function () {
  $(".left-navbar .list-group-item").click(function () {
    $(".left-navbar .list-group-item").removeClass("active-item");
    $(this).addClass("active-item");
  });
  $(".navbar-toggle-btn .toggle-btn").click(function () {
    $(".main-content .left-side").toggleClass("toggle-left-side");
  });
  $(".search-form").submit(function (e) {
    e.preventDefault();
  });
  $(".vertical-navbar-box .vertical-navbar-item").click(function () {
    $(".vertical-navbar-box .vertical-navbar-item").removeClass("active-item");
    $(this).addClass("active-item");
    if ($(this).index() == 2) {
      $(".cursor-icon").css("top", "4%");
    } else if ($(this).index() == 1) {
      $(".cursor-icon").css("top", "32%");
    } else {
      $(".cursor-icon").css("top", "60%");
    }
  });
  $(".card-slider-buttons .btn").click(function () {
    if ($(this).hasClass("prev-btn")) {
      if (left < 9) {
        left += 36;
        $(".content-slider .wrapper").css("left", `${left}%`);
      }
      console.log(left);
    } else if ($(this).hasClass("next-btn")) {
      left += -36;
      if (left < -220) {
        left = 9;
        $(".content-slider .wrapper").css("left", `83px`);
        return;
      } else if (left <= -207) {
        left += -13;
      }
      $(".content-slider .wrapper").css("left", `${left}%`);
    }
  });
});
