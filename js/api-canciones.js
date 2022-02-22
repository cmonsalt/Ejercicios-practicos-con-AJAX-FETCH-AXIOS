const d = document,
  $form = d.getElementById("song-search"),
  $loader = d.querySelector(".loader"),
  $error = d.querySelector(".error"),
  $main = d.querySelector(".main"),
  $artist = d.querySelector(".artist"),
  $song = d.querySelector(".song");

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    $loader.style.display = "block";
    let artist = e.target.artist.value.toLowerCase(),
      song = e.target.song.value.toLowerCase(),
      $artistTemplate = "",
      $songTemplate = "",
      artistFetch = fetch(
        `https://theaudiodb.com/api/v1/json/2/search.php?s=${artist}`
      ),
      songFetch = fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);

    [artistRes, songRes] = await Promise.all([artistFetch, songFetch]);

    let artistData = await artistRes.json(),
      songData = await songRes.json();
    console.log(artistData, songData);

    if (artistData.artists === null) {
      $artistTemplate = `<h2>No existe interprte para<mark>${artist} </mark></h2>`;
    } else {
      let artist = artistData.artists[0];
      $artistTemplate = `
      <h2>${artist.strArtist.toUpperCase()}</h2>
      <img src="${artist.strArtistThumb}" alt="${artist.strArtist}">
      <p>${artist.intBornYear} - ${artist.intDieadYear || "Presente"}<p/>
      <p>${artist.strCountry}<p/>
      <p>${artist.strGenre} - ${artist.strStyle}<p/>
      <p><a href="https//:${
        artist.strWebsite
      }" target="_blank">Sitio Web</a></p>
      <p>${artist.strBiographyEN}</p>
      `;
    }

    if (songData.error) {
      $songTemplate = `<h2>No existe la canción <mark>${song}</mark></h2>`;
    } else {
      $songTemplate = `
      <h2>${song.toUpperCase()}</h2>
      <blockquote>${songData.lyrics}</blockquote>
      `;
    }
    $loader.style.display = "none";
    $artist.innerHTML = $artistTemplate;
    $song.innerHTML = $songTemplate;
  } catch (err) {
    let message = err.statusText || "Ocurrio un error";
    $error.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    $loader.style.display = "none";
  }
});
