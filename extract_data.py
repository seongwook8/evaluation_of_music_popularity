import billboard
import spotipy
import pandas as pd
import random
import string
from spotipy.oauth2 import SpotifyClientCredentials

# please make sure your spotify api is activated before running

auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)

start = 1980
end = 1990

for i in range(start, end + 1):

    year = str(i)

# create chart for the given year
    chart = billboard.ChartData('hot-100', date = year+'-12-31')

# create a separate chart with just song title and song artist
    songs = [[song.title, song.artist] for song in chart]

    output = []
    hashmap = {}

# obtain song attributes from the spotify api and append the results into output
    for song in songs:
        results = sp.search(q = 'track:' + song[0] + ' ' + 'artist:' + song[1], type = 'track')
        try:
            name = results['tracks']['items'][0]['name']
            hashmap[name] = 1
            artists = [artist['name'] for artist in results['tracks']['items'][0]['artists']]
            id = results['tracks']['items'][0]['id']
            features = list(sp.audio_features(id)[0].values())
            output.append([name, artists, id] + features[0:11] + features[16:])
        except:
            output.append([song[0], song[1]])

# randomly choose 100 songs from spotify within the given year and append the results into output
    while len(output) < 200:
        alph = random.choice(string.ascii_letters)
        results = sp.search(q = 'year:' + year + ' ' + 'track:' + alph, limit = 50, type = 'track')
        tracks = results['tracks']['items']
        rand_num = random.randint(0, len(tracks)-1)
        name = tracks[rand_num]['name']
        if name not in hashmap:
            hashmap[name] = 1
            artists = [artist['name'] for artist in tracks[rand_num]['artists']]
            id = tracks[rand_num]['id']
            features = list(sp.audio_features(id)[0].values())
            output.append([name, artists, id] + features[0:11] + features[16:])

# save the output into csv file
    df = pd.DataFrame(output)
    df.columns = ['track', 'artist', 'spotify_id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'duration_ms', 'time_signature']

    df.to_csv('years/'+year+'.csv')