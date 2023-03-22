$(document).ready(function () {
  $('.write-new-tweet').on('click', function () {
    $('.new-tweet').slideToggle();
  });

  // Button for scroll to top
  const scrollTopBtn = $('.scroll-top');

  $(window).scroll(function () {
    if ($(this).scrollTop() > $(this).height() / 4) {
      scrollTopBtn.fadeIn();
    } else {
      scrollTopBtn.fadeOut();
    }
  });

  scrollTopBtn.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
    return false;
  });

  const data = [
    {
      user: {
        name: 'Newton',
        avatars: 'https://i.imgur.com/73hZDYK.png',
        handle: '@SirIsaac',
      },
      content: {
        text: 'If I have seen further it is by standing on the shoulders of giants',
      },
      created_at: 1461116232227,
    },
    {
      user: {
        name: 'Descartes',
        avatars: 'https://i.imgur.com/nlhLi3I.png',
        handle: '@rd',
      },
      content: {
        text: 'Je pense , donc je suis',
      },
      created_at: 1461113959088,
    },
  ];

  const renderTweets = function (tweets) {
    // loop through tweets
    for (let tweetData of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweetData);
      // takes return value and appends it to the tweets container
      $('#tweets-container').append($tweet);
    }
  };

  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function (tweet) {
    const { user, content, created_at } = tweet;

    // set default avatar image if missing
    const avatar =
      user && user.avatars ? user.avatars : 'https://i.imgur.com/nlhLi3I.png';

    const name = user && user.name ? user.name : 'Sean Gray';
    const handle = user && user.handle ? user.handle : '@SGRAY';
    const tweetContent =
      content && content.text ? content.text : $('#tweet-text').val();

    const $tweet = $(`
    <article class ="article-tweet">
      <header>
        <div class="tweet-profile">
          <img src="${escape(avatar)}" alt="#" />
          <h6>${escape(name)}</h6>
        </div>
        <div class="tweet-username">
          <h6><a href="#">${escape(handle)}</a></h6>
        </div>
      </header>
      <section class="tweet-text">
        <p>${escape(tweetContent)}</p>
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

  renderTweets(data);

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

  // new tweet event listener
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
          // Append new tweet to page
          const $newTweet = createTweetElement(response);
          $('#tweets-container').prepend($newTweet);

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
