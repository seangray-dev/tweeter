$(document).ready(function () {
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
          <p>
            ${content.text}
          </p>
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

    // serealize the the form data
    const formData = $(this).serialize();

    // submit POST request to server
    $.ajax({
      url: '/tweets',
      nethod: 'POST',
      data: formData,
    })
      .then(function (response) {
        console.log(`Res: ${response}`);
      })
      .catch(function (error) {
        console.log(`Error: ${error}`);
      });
  });
});
