// my presentation logic

// optional, reduce the size of the restaurants loaded in memory
// restaurants.splice(100);

var search = new SearchPanel();
logic.token = 'BQA5Uv_YrZ-k7kmNM75SWCckaC65PItjcg-_GK9pTnZRZDXKsBZmZtsIiDIDo-AtTBtxbwrK6pLIwIxik04g7SSWqI9b1z7vZmzT8rfNEeYuNIWUun9I6hFFfXCUwZcBdjBzbvA_HtsTC2D-whU3t8WGCetDisRATAKPQJxH1LB-T-OMy-U-P258AwE47ynXRBuajnNqxyJ7zIKfDw0OBTvl3A'

search.onSearch(function (query) {
    
    logic.searchArtists(query)
        .then(function (artist) {
            resultsArtist.updateResults(artist.map(function (artist) {
                return {
                    id: artist.id,
                    text: artist.name
                };
            }));

            $detailContainer.empty();
        })
        .catch(function (error) {
            alert('Sorry, we have temporary problem, try again later.');
        });
});

var resultsArtist = new ResultsList();

resultsArtist.onItemClick(function (id) {
    logic.retrieveAlbumsByArtistId(id)

        .then(function (albums) {
            resultsAlbum.updateResults(albums.map(function (album) {
                return {
                    id: album.id,
                    text: album.name
                };
            }));

            $detailContainer.empty();
        })
        .catch(function (error) {
            alert('Sorry, we have temporary problem, try again later.');
        });
});

var resultsAlbum = new ResultsList();
var resultsTracks=new ResultsList();

resultsAlbum.onItemClick(function (id) {
    logic.retrieveTracksByAlbumId(id)

        .then(function (tracks) {
            resultsTracks.updateResults(tracks.map(function (track) {
                return {
                    id: track.id,
                    text: track.name
                };
            }));

            $detailContainer.empty();
        })
        .catch(function (error) {
            alert('Sorry, we have temporary problem, try again later.');
        });
});

resultsTracks.onItemClick(function (id) {
    logic.retrieveTrackById(id)
    
        .then(function (track) {
            var detail = new DetailPanel(track.name,track.image, track.preview_url,);

            $detailContainer.empty();
            $detailContainer.append(detail.element);
        })
        .catch(function (error) {
            alert('Sorry, we have temporary problem, try again later.');
        });
});



var $detailContainer = $('<div class="container"></div>'); ;

$detailContainer.clear = function () {
    this.innerHTML = '';
};

$('body').append(search.element);
$('body').append(resultsArtist.element);
$('body').append(resultsAlbum.element);
$('body').append(resultsTracks.element);
$('body').append($detailContainer);

