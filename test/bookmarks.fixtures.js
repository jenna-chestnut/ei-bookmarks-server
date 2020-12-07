function makeBookmarksArray() {
  return  [
    { 
      id: 1,
      title: 'Salem\'s Portfolio',
      rating: 5,
      url: 'https://www.instagram.com/sweetsaybae/?hl=en',
      desc: 'A truly wonderful work of art, this site is a compilation of some of Salem Chestnut\'s greatest moments - from catching his own tail to mastering a game of basketball. Woof!',
      expanded: false
    },
    {
      id: 2,
      title: 'Jennabot',
      rating: 3,
      url: 'http://www.jennabot.com',
      desc: 'dolorum tempore deserunt',
      expanded: false
    }
  ];    
}

function makeMaliciousBookmark() {
  return {
    id: 1,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    rating: 1,
    url: 'http://www.jennabot.com',
    desc: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
  };
}
  
module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark
};
