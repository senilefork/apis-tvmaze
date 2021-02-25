/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
let backUpImage = 'https://tinyurl.com/tv-missing'
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let showData = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  
  //console.log(showData.data[0])

  let showInfoArray = showData.data.map(function(el){
    return {
      id: el.show.id,
      name: el.show.name,
      summary: el.show.summary,
      image: el.show.image ? el.show.image.medium : backUpImage,
   // image: el.show.image.medium || backUpImage
    };
  });
  return showInfoArray
  /* return [
    {
      id: showData.data[0].show.id,
      name: showData.data[0].show.name,
      summary: showData.data[0].show.summary,
      image: showData.data[0].show.image.medium
    }
  ]  */
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class="episodes">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
 
}

function populateEpisodes(episodes){
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for(episode of episodes){
    let $name = (`<li>${episode.name}</li>`);
    $episodesList.append($name);
  }  
  $("#episodes-area").show()
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click",".episodes", async function handleClick(evt){
  //get the show id of the card that is clicked on
  console.log("clicked");
 // let showId = $(evt.target).closest(".card").data("data-show-id");
 let showId = $(evt.target).closest(".col-md-6").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes); 
})


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let epData = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(epData)
  let epArray = epData.data.map(function(el){
    let obj = {
      id: el.id,
      name: el.name,
      number: el.number,
      season:el.season
    
    }
    return obj
  })
  //console.log(epArray)
  return epArray;
}
