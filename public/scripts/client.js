$(document).ready(function () {
  // Toggle new tweet form when 'Write a new tweet' button clicked
  $('.nav__write-new-tweet').on('click', function () {
    $('.new-tweet').slideToggle();
  });

  // Button for scroll to top
  const scrollTopBtn = $('.scroll-top');

  // Show scroll to top button after scrolling down 1/4 of the page
  $(window).scroll(function () {
    if ($(this).scrollTop() > $(this).height() / 4) {
      scrollTopBtn.fadeIn();
    } else {
      scrollTopBtn.fadeOut();
    }
  });

  // Scroll to top when scroll to top button is clicked
  scrollTopBtn.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
    return false;
  });

  // Render tweet using sample data
  const renderTweets = function (tweets) {
    // Clear tweets container
    $('#tweets-container').empty();
    // Loop through tweets and create HTML elements
    for (let tweetData of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweetData);
      // takes return value and appends it to the tweets container
      $('#tweets-container').append($tweet);
    }
  };

  // Escape special chars in a string
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Create HTML for a tweet using the tweet data
  const createTweetElement = function (tweet) {
    const { user, content, created_at } = tweet;

    const $tweet = $(`
    <article class ="article-tweet">
      <header>
        <div class="tweet-profile">
          <img src="${user.avatars}" alt="#" />
          <h6>${user.name}</h6>
        </div>
        <div class="tweet-username">
          <h6><a href="#">${user.handle}</a></h6>
        </div>
      </header>
      <section class="tweet-text">
        <p>${escape(content.text)}</p>
      </section>
      <footer>
        <div class="tweet-date">${timeago.format(created_at)}</div>
        <div class="tweet-icons">
          <a href="#"><i class="fa-solid fa-flag"></i></a>
          <a href="#"><i class="fa-solid fa-retweet"></i></a>
          <a href="#"><i class="fa-solid fa-heart"></i></a>
        </div>
      </footer>
    </article>
  `);

    return $tweet;
  };

  // Load tweets from server and render them
  const loadTweets = function () {
    $.ajax('/tweets', { method: 'GET', dataType: 'json' })
      .then(function (tweets) {
        renderTweets(tweets);
      })
      .catch(function (error) {
        console.log(`Error fetching tweets: ${error}`);
      });
  };

  loadTweets();

  // Submit new tweet form
  $('#tweet-form').submit(function (event) {
    event.preventDefault();

    const $tweetContent = $('#tweet-text');
    $('.error').slideUp();

    // Check if tweet content is too long or empty
    if ($tweetContent.val().length > 140) {
      $('.error')
        .text('Tweet is too long! Limit is 140 characters')
        .slideDown();
    } else if (!$tweetContent.val()) {
      $('.error').text('Tweet is empty!').slideDown();
    } else {
      // Serialize the form data
      const formData = $(this).serialize();

      // submit POST request to server
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formData,
      })
        .then(function (response) {
          loadTweets();

          // Clear tweet input and reset character counter
          $tweetContent.val('');
          $('.counter').text('140');
        })
        .catch(function (error) {
          console.log('Error:', error);
        });
    }
  });
});
