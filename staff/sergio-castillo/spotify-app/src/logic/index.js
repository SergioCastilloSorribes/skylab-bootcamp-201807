var logic = {
    token: 'BQAyjO19M-gKxv1T1brGZ-j0DF7QnWEQwaL23t3aSkyHypvHk1DBv-XJIUdpHamKfy2oViIl0kCG5gjIBp2W0lbyuetW36AqwZaGBpOjMYGAH7uznFVYWcts7ekXmPdokAAE6eIsH1KbCg',

    // _callApi: function (path) {
    //     return $.ajax('https://api.spotify.com/v1' + path, {
    //         headers: {
    //             authorization: 'Bearer ' + this.token
    //         }
    //     })
    //     .catch(function(err) {
    //         throw Error('request error, status ' + err.status);
    //     });
    // },

    _callApi: function (path) {
        return fetch ('https://api.spotify.com/v1' + path, {
            headers: {
                authorization: 'Bearer ' + this.token
            }
        })
        .then (function (res){return res.json()})
        .catch(function(err) {
            throw Error('request error, status ' + err.status);
        });
    },

    searchArtists: function (query) {
        return this._callApi('/search?type=artist&query=' + query)
            .then(function(res) {
                return res.artists.items;
            });
    },

    retrieveAlbumsByArtistId(id) {
        return this._callApi('/artists/' + id + '/albums')
            .then(function(res) {
                return res.items;
            });
    },

    retrieveTracksByAlbumId(id) {
        return this._callApi('/albums/' + id + '/tracks')
            .then(function(res) {
                return res.items;
            });
    },

    retrieveTrackById(id) {
        return this._callApi('/tracks/' + id)
            .then(function(res) {
                return res;
            });
    }
};

// export default logic
if (typeof module !== 'undefined') module.exports = logic