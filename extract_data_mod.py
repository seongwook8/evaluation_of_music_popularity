import billboard
import spotipy
import pandas as pd
import random
import string
from spotipy.oauth2 import SpotifyClientCredentials
import re

# please make sure your spotify api is activated before running

auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)

start = 2020
end = 2020

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
        track = song[0]
        artist = song[1]

        track = re.sub(r"\([^()]*\)", "", track)
        artist = re.sub(r"\([^()]*\)", "", artist)

        track = track.replace('\'', ' ')
        artist = artist.replace('\'', ' ')

        track = track.replace('\"', ' ')
        artist = artist.replace('\"', ' ')

        track = track.replace('(', ' ')
        artist = artist.replace('(', ' ')

        track = track.replace(')', ' ')
        artist = artist.replace(')', ' ')

        track = track.replace('-', ' ')
        artist = artist.replace('-', ' ')

        track = track.replace('.', ' ')
        artist = artist.replace('.', ' ')

        track = track.replace('!', ' ')
        artist = artist.replace('!', ' ')

        track = track.split("/", 1)
        artist = artist.split("/", 1)
        track = track[0]
        artist = artist[0]

        track = track.split("&", 1)
        artist = artist.split("&", 1)
        track = track[0]
        artist = artist[0]

        track = track.split("From", 1)
        track = track[0]

        artist = artist.split("Featuring", 1)
        artist = artist[0]

        artist = artist.split("With", 1)
        artist = artist[0]

        results = sp.search(q = 'track:' + track + ' ' + 'artist:' + artist, type = 'track')
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
            if sp.audio_features(id)[0] != None:
                features = list(sp.audio_features(id)[0].values())
                output.append([name, artists, id] + features[0:11] + features[16:])
            else:
                output.append([name, artists, id])

# save the output into csv file
    df = pd.DataFrame(output)
    df.columns = ['track', 'artist', 'spotify_id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'duration_ms', 'time_signature']

    df.to_csv('years_mod/'+year+'.csv')