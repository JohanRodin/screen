/*eslint-disable no-else-return, no-undef, no-use-before-define*/
function time_since(date) {
	//debug
	//return "6 min";	
	//console.log("Incoming date: " + date);
	var tmp_date = new Date(date);
    var seconds = Math.floor((new Date().getTime() - tmp_date.getTime()) / 1000);
    //console.log("Time is: " + seconds);
    var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (seconds < 5){
    	return "just now";
    }
    if (seconds < 60){
    	return seconds + " seconds ago";
    }
    if (seconds < 3600) {
        var minutes = Math.floor(seconds/60);
        if(minutes > 1)
         return minutes + " minutes ago";
        else
         return "1 minute ago";
    }
    if (seconds < 86400) {
    	var hours = Math.floor(seconds/3600);
        if(hours > 1)
          return hours + " hours ago";
        else
          return "1 hour ago";
    }
    //2 days and no more
    if (seconds < 172800) {
    	var days = Math.floor(seconds/86400);
        if(days > 1)
          return days + " days ago";
        else
          return "1 day ago";
    }
    //return new Date(time).toLocaleDateString();
    
      return tmp_date.getDate().toString() + " " + months[tmp_date.getMonth()] + ", " + tmp_date.getFullYear();         
}
	
	
function set_width_100(description) {
	var adj_description = description.replace("width=\"250\"", "width=\"50%\"");
	
	return adj_description;
}

function get_new_tweets() {

  //call ajax.get();

  function processOK(response) {
			//Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript
			console.log("Getting tweets..." + JSON.stringify($(response)));
			$(response).find("channel").each(function () {
				console.log("Channel title      : " + $(this).find("title:first").text()); // only first title, not all title texts
			});	
			var i=0;
			//var n = 6; take all tweets we get
			$(response).find("item").each(function () { // or "item" or whatever suits your feed
				//if (i<n) {
				var el = $(this);
				console.log("------------------------");
				console.log("title      : " + el.find("title").text());
				console.log("link       : " + el.find("link").text());
				console.log("description: " + el.find("description").text());
				console.log("name       : " + el.find("dc\\:creator, creator").text());
				
				var tmp_tweet = el;   // response.query.results.rss.channel.item[i];
          
	          	
    	      	tweets[i] = {
        	    				name: tmp_tweet.find('dc\\:creator, creator').text().substring(2,tmp_tweet.find('dc\\:creator, creator').text().length - 1),
	            				userImage: tmp_tweet.find('link').text(),
	            				handle: tmp_tweet.find('dc\\:creator, creator').text(),
    	        				verified: true,
        	    				timeLapsed: time_since(tmp_tweet.find('dc\\:date, date').text()),
            					description: set_width_100(tmp_tweet.find('description').text()),
            					likes: Math.floor(Math.random() * 100),
            					upVoted: false
          	  				};
          	  	if (tmp_tweet.find("dc\\:creator, creator").text() === '(@IBMCCtr)') {
          	  		tweets[i].userImage = "https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg";
          	  	} else if (tmp_tweet.find('dc\\:creator, creator').text() === '(@ibmsverige)') {
          	  		tweets[i].userImage = "https://pbs.twimg.com/profile_images/1014067993880547329/I2Gb0DQ7_200x200.jpg";
          	  	} else if (tmp_tweet.find('dc\\:creator, creator').text() === '(@IBMWatson)') {	
          	  		tweets[i].userImage = "https://pbs.twimg.com/profile_images/986987176700280833/wzJJCwre_400x400.jpg";
          	  	} else
               		tweets[i].userImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ";
        	
        		console.log('OK, new tweets added: #' + i + ": " + JSON.stringify(tweets[i]));
        		i++;
        		//} // i<n
        	}); // each
			
	/*		
    if (typeof response.query.results.rss.channel.item !== "undefined") {
      if (typeof response.query.results.rss.channel.item[0] !== "undefined") {

        //loop to get the first n tweets into the tweet array
        var n = 6;
        for(var i=0; i<n; i++) {
          var tmp_tweet = response.query.results.rss.channel.item[i];
          if (tmp_tweet.creator !== "(@JohanNRodin)") {
	          console.log('OK, new tweets added: #' + i + ": " + JSON.stringify(tmp_tweet));
    	      tweets[i] = {
        	    name: tmp_tweet.creator.substring(2,tmp_tweet.creator.length - 1),
	            userImage: tmp_tweet.link,
	            handle: tmp_tweet.creator,
    	        verified: true,
        	    timeLapsed: time_since(tmp_tweet.date),
            	description: set_width_100(tmp_tweet.description),
            	likes: Math.floor(Math.random() * 100),
            	upVoted: false
          	  };
          	  if (tmp_tweet.creator === "(@IBMCCtr)") {
          	  	tweets[i].userImage = "https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg";
          	  	} else if (tmp_tweet.creator === "(@ibmsverige)") {
          	  		tweets[i].userImage = "https://pbs.twimg.com/profile_images/1014067993880547329/I2Gb0DQ7_200x200.jpg";
          	  	} else
               		tweets[i].userImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ";
        	}
           }	
		}
    }
    //console.log('OK, new tweets added: ' + JSON.stringify(response.item));
    //set new tweets in tweet list/array
    //tweets = ...
    */
    }    // processOK   
    function processNotOK(err) {
        //not ok call
        console.log('Not OK, no new tweets added: ' + JSON.stringify(err));
    }   
    function invokeAjax() {
    
    	const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
 
    	//feed to parse
		var feed = CORS_PROXY + "http://rssmix.com/<mychannel>/rss.xml";
		var settings = {
          url: feed,
          dataType: "xml",
          method: 'GET',
          beforeSend: function(xhr){xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');},
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          },
          error: processNotOK,
          success: processOK	
      };

		$.ajax(settings);
	}
	/*  outdated since the api is deprecated
    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'http%3A%2F%2Frssmix.com%2Fu%<mychannel>%2Frss.xml\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
        dataType : 'json',
        data: ajaxData,
        error: processNotOK,
        success: processOK
      });
    } */
   
    //console.log();
    //console.log('sending request to twitter api to load all tweets...');
    invokeAjax(); 
}

function scroll_down() {
  console.log("Scrolling in tweets...");
  //two ways comment 1) xor 2)
  // 1) take out last element and shift it in first
  //tweets.unshift(tweets.pop());
  // 2) take the first element and put it last
  var saved_first_tweet = tweets[0];
  tweets.shift();
  tweets.push(saved_first_tweet);
}

const tweets = [
{"name":"green_goddess","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@green_goddess)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Kudos to  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/Gillette\">@<b>Gillette</b></a> as they shift their 30 year old tagline  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/TheBestAManCanGet?src=hash\">#<b>TheBestAManCanGet</b></a> away from a close shave and give it real 21st century meaning:  <a href=\"https://www.adweek.com/brand-marketing/gillette-asks-how-we-define-masculinity-in-the-metoo-era-as-the-best-a-man-can-get-turns-30/\">https://www.adweek.com/brand-marketing/gillette-asks-how-we-define-masculinity-in-the-metoo-era-as-the-best-a-man-can-get-turns-30/&#160;&#8230;</a></p>","likes":11,"upVoted":false},

{"name":"IBMDeutschland","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMDeutschland)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"de\">Die  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/THINK2019?src=hash\">#<b>THINK2019</b></a> ist DIE Gelegenheit, das  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMQ?src=hash\">#<b>IBMQ</b></a> Team zu treffen und  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/QuantumComputing?src=hash\">#<b>QuantumComputing</b></a> hautnah zu erleben. Jetzt anmelden:   <a href=\"https://ibm.co/2D4mn20\">https://ibm.co/2D4mn20&#160;</a>  <a href=\"https://twitter.com/IBMResearch/status/1083770524352892928\">https://twitter.com/IBMResearch/status/1083770524352892928&#160;&#8230;</a></p>","likes":92,"upVoted":false},

{"name":"IBMCCtr","userImage":"https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg","handle":"(@IBMCCtr)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Think Lab Zurich on tour: Our very own Haig Peter at the IBM booth during  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/NRF2019?src=hash\">#<b>NRF2019</b></a> in New York this week discussing AI, blockchain, and other game-changers for retail with clients.We wish everyone a powerful Tuesday, full of inspiration and big ideas. <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmclientcenter?src=hash\">#<b>ibmclientcenter</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmthinklab?src=hash\">#<b>ibmthinklab</b></a>  <a href=\"https://twitter.com/HaigAlexander/status/1084844582968352769\">https://twitter.com/HaigAlexander/status/1084844582968352769&#160;&#8230;</a></p>","likes":18,"upVoted":false},

{"name":"A_Ostertag","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@A_Ostertag)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">85% of  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/retail?src=hash\">#<b>retail</b></a> and 79% of  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/consumer?src=hash\">#<b>consumer</b></a> products companies surveyed plan to  use intelligent automation for supply chain planning by 2021 \nFind out more:  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/NRF2019?src=hash\">#<b>NRF2019</b></a> or   <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a> at  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/EuroCIS?src=hash\">#<b>EuroCIS</b></a> 2019 <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/VeKExuYK8x\">pic.twitter.com/VeKExuYK8x</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw7-YNNXQAEV4Zd.jpg\" width=\"50%\" />","likes":37,"upVoted":false},

{"name":"IBMCCtr","userImage":"https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg","handle":"(@IBMCCtr)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">IBM Client Center Montpellier  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMCCMpl?src=hash\">#<b>IBMCCMpl</b></a> team at Higher Education Conference  <a href=\"https://twitter.com/VasquesXavier/status/1084810073724080128\">https://twitter.com/VasquesXavier/status/1084810073724080128&#160;&#8230;</a></p>","likes":28,"upVoted":false},

{"name":"IBMDeutschland","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMDeutschland)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Nicht verpassen: Live Tech Talk am 17. Januar mit  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/MissAmaraKay\">@<b>MissAmaraKay</b></a> - \"Build an Augmented Reality avatar for the iPhone\"   <a href=\"http://spr.ly/6017E3ckL\">http://spr.ly/6017E3ckL&#160;</a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/Unity?src=hash\">#<b>Unity</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMDeveloper?src=hash\">#<b>IBMDeveloper</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/devtechtalk?src=hash\">#<b>devtechtalk</b></a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/VYUKMY9D67\">pic.twitter.com/VYUKMY9D67</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw4aqw5WkAAyP-8.jpg\" width=\"50%\" />","likes":80,"upVoted":false},

{"name":"IBMResearch","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMResearch)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\"><img alt=\"&#x1F389;\" aria-label=\"Emoji: Party popper\" class=\"Emoji Emoji--forText\" draggable=\"false\" src=\"https://abs.twimg.com/emoji/v2/72x72/1f389.png\" title=\"Party popper\"></img> Congratulations Dr. Chieko Asakawa, for her induction to the National Inventors Hall of Fame, recognizing decades of IBM leadership in accessibility research   <a href=\"https://ibm.co/2AKdpoZ\">https://ibm.co/2AKdpoZ&#160;</a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/XCl2OTEl6G\">pic.twitter.com/XCl2OTEl6G</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw4PcgSW0AATVVI.jpg\" width=\"50%\" />","likes":16,"upVoted":false}
];
/*
const tweets = [
   {
    name: 'IBM CCtr',
    userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg',
    handle: '@IBMCCtr',
    verified: true,
    timeLapsed: '5m',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">The Client Centre London is now open again after our summer maintenance.  Pop in to see us &#38; find out how we can support your next meeting  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMCCLON?src=hash\">#<b>IBMCCLON</b></a></p>',
    likes: 1256,
    upVoted: false
   },
   {
    name: 'IBM CCtr',
    userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg',
    handle: '@IBMCCtr',
    timeLapsed: '2h',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">Marie Th&#233;r&#232;se Mercier  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/MercierTherese\">@<b>MercierTherese</b></a>, regional council of Occitanie region &#38;  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/ADOCC_\">@<b>ADOCC_</b></a> teams at IBM Client Center Montpellier  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmccmpl?src=hash\">#<b>ibmccmpl</b></a> to see IBM Q and engage in quantum computing discussions with  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/OlivierHess1\">@<b>OlivierHess1</b></a> &#38; quantum team <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/pX2TsBbQc5\">pic.twitter.com/pX2TsBbQc5</a></a></p> <img src=\"https://pbs.twimg.com/media/Dl66rxZW0AE-x6S.jpg\" width=\"250\" />',
    likes: 22,
    upVoted: false
   },
   {
    name: 'Philippe Brogi',
    userImage: 'https://pbs.twimg.com/profile_images/1016316220365209600/AcNv8UqO_400x400.jpg',
    handle: '@PhilippeBrogi',
    verified: true,
    timeLapsed: '15m',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">Symposium  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a> BP 2018 : superbe pl&#233;ni&#232;re du 31 ao&#251;t <img alt=\"&#x1F929;\" aria-label=\"Emoji: Star-struck\" class=\"Emoji Emoji--forText\" draggable=\"false\" src=\"https://abs.twimg.com/emoji/v2/72x72/1f929.png\" title=\"Star-struck\"></img> <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMBPSYMP?src=hash\">#<b>IBMBPSYMP</b></a>\nSee you next year ... with Charlie of course ... and some others !  <a href=\"https://twitter.com/zistoor8/status/1035451941474709505\">https://twitter.com/zistoor8/status/1035451941474709505&#160;&#8230;</a></p>',
    likes: 4586,
    upVoted: false
   },
   {
    name: 'IBM CCtr',
    userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg',
    handle: '@IBMCCtr',
    timeLapsed: '2018-08-31T09:59:16Z',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">Nicolas Sekkaki  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/nsekkaki\">@<b>nsekkaki</b></a> General Manager  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a> France fait la s&#233;ance de cl&#244;ture  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMBPsymp?src=hash\">#<b>IBMBPsymp</b></a> IBM BP Symposium France  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMCCMpl?src=hash\">#<b>IBMCCMpl</b></a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/4yQvVbXw3i\">pic.twitter.com/4yQvVbXw3i</a></a></p> <img src=\"https://pbs.twimg.com/media/Dl63yW6WsAAtw1q.jpg\" width=\"250\" />',
    likes: 59,
    upVoted: false
   },
   {
    name: 'Marie Fons',
    userImage: 'https://pbs.twimg.com/profile_images/947105160064532480/D_WeQah4_400x400.jpg',
    handle: '@MarieFons2',
    timeLapsed: '1h',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">C&#8217;est la fin du  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMBPSYMP?src=hash\">#<b>IBMBPSYMP</b></a>... quelle semaine! <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/vJQyJc97Ql\">pic.twitter.com/vJQyJc97Ql</a></a></p> <img src=\"https://pbs.twimg.com/media/Dl7kxi6XcAAEhw_.jpg\" width=\"250\" />',
    likes: 36,
    upVoted: false
   },
   {
    name: 'IBM CCtr',
    userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg',
    handle: '@IBMCCtr',
    timeLapsed: '2h',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">Marie Th&#233;r&#232;se Mercier  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/MercierTherese\">@<b>MercierTherese</b></a>, regional council of Occitanie region &#38;  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/ADOCC_\">@<b>ADOCC_</b></a> teams at IBM Client Center Montpellier  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmccmpl?src=hash\">#<b>ibmccmpl</b></a> to see IBM Q and engage in quantum computing discussions with  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/OlivierHess1\">@<b>OlivierHess1</b></a> &#38; quantum team <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/pX2TsBbQc5\">pic.twitter.com/pX2TsBbQc5</a></a></p> <img src=\"https://pbs.twimg.com/media/Dl66rxZW0AE-x6S.jpg\" width=\"250\" />',
    likes: 22,
    upVoted: false
   },
   {
    name: 'IBM CCtr',
    userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg',
    handle: '@IBMCCtr',
    timeLapsed: '2018-08-31T09:59:16Z',
    description: '<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"fr\">Nicolas Sekkaki  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/nsekkaki\">@<b>nsekkaki</b></a> General Manager  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a> France fait la s&#233;ance de cl&#244;ture  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMBPsymp?src=hash\">#<b>IBMBPsymp</b></a> IBM BP Symposium France  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMCCMpl?src=hash\">#<b>IBMCCMpl</b></a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/4yQvVbXw3i\">pic.twitter.com/4yQvVbXw3i</a></a></p> <img src=\"https://pbs.twimg.com/media/Dl63yW6WsAAtw1q.jpg\" width=\"250\" />',
    likes: 59,
    upVoted: false
   }
];
*/
/*
 * 
OK, new tweets added: #2: {"name":"green_goddess","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@green_goddess)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Kudos to  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/Gillette\">@<b>Gillette</b></a> as they shift their 30 year old tagline  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/TheBestAManCanGet?src=hash\">#<b>TheBestAManCanGet</b></a> away from a close shave and give it real 21st century meaning:  <a href=\"https://www.adweek.com/brand-marketing/gillette-asks-how-we-define-masculinity-in-the-metoo-era-as-the-best-a-man-can-get-turns-30/\">https://www.adweek.com/brand-marketing/gillette-asks-how-we-define-masculinity-in-the-metoo-era-as-the-best-a-man-can-get-turns-30/&#160;&#8230;</a></p>","likes":11,"upVoted":false}

OK, new tweets added: #3: {"name":"IBMDeutschland","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMDeutschland)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"de\">Die  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/THINK2019?src=hash\">#<b>THINK2019</b></a> ist DIE Gelegenheit, das  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMQ?src=hash\">#<b>IBMQ</b></a> Team zu treffen und  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/QuantumComputing?src=hash\">#<b>QuantumComputing</b></a> hautnah zu erleben. Jetzt anmelden:   <a href=\"https://ibm.co/2D4mn20\">https://ibm.co/2D4mn20&#160;</a>  <a href=\"https://twitter.com/IBMResearch/status/1083770524352892928\">https://twitter.com/IBMResearch/status/1083770524352892928&#160;&#8230;</a></p>","likes":92,"upVoted":false}

OK, new tweets added: #4: {"name":"IBMCCtr","userImage":"https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg","handle":"(@IBMCCtr)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Think Lab Zurich on tour: Our very own Haig Peter at the IBM booth during  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/NRF2019?src=hash\">#<b>NRF2019</b></a> in New York this week discussing AI, blockchain, and other game-changers for retail with clients.We wish everyone a powerful Tuesday, full of inspiration and big ideas. <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmclientcenter?src=hash\">#<b>ibmclientcenter</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/ibmthinklab?src=hash\">#<b>ibmthinklab</b></a>  <a href=\"https://twitter.com/HaigAlexander/status/1084844582968352769\">https://twitter.com/HaigAlexander/status/1084844582968352769&#160;&#8230;</a></p>","likes":18,"upVoted":false}

OK, new tweets added: #5: {"name":"A_Ostertag","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@A_Ostertag)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">85% of  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/retail?src=hash\">#<b>retail</b></a> and 79% of  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/consumer?src=hash\">#<b>consumer</b></a> products companies surveyed plan to  use intelligent automation for supply chain planning by 2021 \nFind out more:  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/NRF2019?src=hash\">#<b>NRF2019</b></a> or   <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a> at  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/EuroCIS?src=hash\">#<b>EuroCIS</b></a> 2019 <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/VeKExuYK8x\">pic.twitter.com/VeKExuYK8x</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw7-YNNXQAEV4Zd.jpg\" width=\"50%\" />","likes":37,"upVoted":false}

OK, new tweets added: #6: {"name":"IBMCCtr","userImage":"https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_400x400.jpg","handle":"(@IBMCCtr)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">IBM Client Center Montpellier  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMCCMpl?src=hash\">#<b>IBMCCMpl</b></a> team at Higher Education Conference  <a href=\"https://twitter.com/VasquesXavier/status/1084810073724080128\">https://twitter.com/VasquesXavier/status/1084810073724080128&#160;&#8230;</a></p>","likes":28,"upVoted":false}

OK, new tweets added: #7: {"name":"IBMDeutschland","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMDeutschland)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\">Nicht verpassen: Live Tech Talk am 17. Januar mit  <a class=\"twitter-atreply pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/MissAmaraKay\">@<b>MissAmaraKay</b></a> - \"Build an Augmented Reality avatar for the iPhone\"   <a href=\"http://spr.ly/6017E3ckL\">http://spr.ly/6017E3ckL&#160;</a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/Unity?src=hash\">#<b>Unity</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBM?src=hash\">#<b>IBM</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/IBMDeveloper?src=hash\">#<b>IBMDeveloper</b></a>  <a class=\"twitter-hashtag pretty-link js-nav\"  dir=\"ltr\" href=\"https://twitter.com/hashtag/devtechtalk?src=hash\">#<b>devtechtalk</b></a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/VYUKMY9D67\">pic.twitter.com/VYUKMY9D67</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw4aqw5WkAAyP-8.jpg\" width=\"50%\" />","likes":80,"upVoted":false}

OK, new tweets added: #8: {"name":"IBMResearch","userImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKgu0FT7lKBK4kIRWje3uVNZQaFh56rZ7ayWKiS3MFIS1wOmqbQ","handle":"(@IBMResearch)","verified":true,"timeLapsed":"1 day ago","description":"<p class=\"TweetTextSize TweetTextSize--normal js-tweet-text tweet-text\"  lang=\"en\"><img alt=\"&#x1F389;\" aria-label=\"Emoji: Party popper\" class=\"Emoji Emoji--forText\" draggable=\"false\" src=\"https://abs.twimg.com/emoji/v2/72x72/1f389.png\" title=\"Party popper\"></img> Congratulations Dr. Chieko Asakawa, for her induction to the National Inventors Hall of Fame, recognizing decades of IBM leadership in accessibility research   <a href=\"https://ibm.co/2AKdpoZ\">https://ibm.co/2AKdpoZ&#160;</a> <a class=\"twitter-timeline-link u-hidden\"  dir=\"ltr\" href=\"https://pic.twitter.com/XCl2OTEl6G\">pic.twitter.com/XCl2OTEl6G</a></a></p> <img src=\"https://pbs.twimg.com/media/Dw4PcgSW0AATVVI.jpg\" width=\"50%\" />","likes":16,"upVoted":false}
 * 
 */

Vue.component('tweet-component', {
  template:
  `
   
    <div class="tweet" id="tweet">
    <input type="button" value="" style="display: none;" class="btn"> 
      <article class="media" id="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img class="user-image" :src="tweet.userImage">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{tweet.name}}</strong>
                <img class="verified-icon"
                     src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/twitter_verified.png"
                     v-if="tweet.verified" />
                <small>{{tweet.handle}}</small>
                <small class="time-lapsed">{{tweet.timeLapsed}}</small>
                <br>
                <span class="description" v-html="computedDescription"></span>
              </p>
            </div>
            <div v-if="tweet.tweetImage" class="tweet-image">
              <img :src="tweet.tweetImage" />
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item">
                  <span class="icon is-small"><i class="far fa-comment"></i></span>
                </a>
                <a class="level-item">
                  <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                </a>
                <a class="level-item heart" @click="like">
                  <span class="icon is-small">
                    <i class="far fa-heart"
                       :class="{'fas': this.tweet.upVoted}"></i>
                  </span>
                  <p :class="{'bold': this.tweet.upVoted}">
                    {{new Intl.NumberFormat().format(tweet.likes)}}
                  <p>

                </a>
              </div>
            </nav>
          </div>
         
        </article>
    </div>
    </div>
  `,
  props: ['tweet'],
  computed: {
    computedDescription() {
      return this.tweet.description.split(' ').map((word) => {
        if (word[0] === '@' || word[0] === '#') {
          word = `<span class="highlighted">${word}</span>`;
        }
        return word;
      }).join(' ');
    }
  },
  methods: {
    like() {
      this.tweet.upVoted ? this.tweet.likes-- : this.tweet.likes++;
      this.tweet.upVoted = !this.tweet.upVoted;
    }
  }
});

new Vue({
  el: "#app",
  data: {
    tweets,
    image: '',
    description: '',
    step: null,
    showDetails: false,
    fileInput: ''
  },
  created() {
    setTimeout(() => {
      this.step = 1;
    }, 1000);
  },
  methods: {
    fileUpload(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.image = files[0];
      this.createImage();
    },
    createImage() {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        this.image = e.target.result;
        this.step = 2;
      };
      reader.readAsDataURL(this.image);
    },
    uploadRandomImage() {
      const randomImages = [
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/twitter_mobile.png',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/cn-tower.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/prism-goggles-at-concert.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/working-at-night.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/busy-beach.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/grand-canyon.jpg',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1211695/carnival-lights-at-dusk.jpg'
      ];
      
      this.image = randomImages[Math.floor(Math.random() * randomImages.length)];
      this.step = 2;
    },
    goToHome() {
      this.image = '';
      this.description = '';
      this.step = 1;
      
      this.$nextTick(() => {
        const feed = document.getElementById('feed');
        if (feed) feed.scrollTop = 0;
        console.log("feed scrolltop");
      });
    },
    shareTweet() {
      const tweet = {
        name: 'IBMCCtr',
        userImage: 'https://pbs.twimg.com/profile_images/958258066377539584/-2zn2P57_bigger.jpg',
        handle: '@IBMCCtr',
        timeLapsed: '2m',
        tweetImage: this.image,
        description: this.description,
        likes: 1000,
        upVoted: false,
      };
      
      this.tweets.unshift(tweet);
      this.goToHome();
    }
   
  }
}
);

var flag = 0;

function autoType(elementClass, typingSpeed){
  var thhis = $(elementClass);
  thhis.show();
  thhis.css({
    "position": "relative",
    "display": "inline-block"
  });
  
  if (flag === 0) {
  	thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
  	flag = 1;
  }	
  thhis = thhis.find(".text-js");
  var text = thhis.text().trim().split('');
  var amntOfChars = text.length;
  var newString = "";
  thhis.text("|");
  setTimeout(function(){
    thhis.css("opacity",1);
    thhis.prev().removeAttr("style");
    thhis.text("");
    for(var i = 0; i < amntOfChars; i++){
      (function(i,char){
        setTimeout(function() {        
          newString += char;
          thhis.text(newString);
        },i*typingSpeed);
      })(i+1,text[i]);
    }
  },1500);
}
