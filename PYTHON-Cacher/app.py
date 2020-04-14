from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import urllib.request, json
import datetime

app = Flask("celeb-cacher")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

celeb_cache = {}

def clean_cache():
    kill_list = []
    for name, details in celeb_cache.items():
        if (datetime.datetime.now() - details["time"]).seconds > 60:
            kill_list.append(name)
    for name in kill_list:
        del celeb_cache[name]

def generate_mock():
    return '{"birthdate":"1958|8|29","birthname":"Michael Joseph Jackson","birthplace":"Gary, Indiana, U.S.","desc":"American singer, songwriter, and dancer","educ":"","last_fetch":"fresh","occupation":"hlist|Singer|songwriter|dancer","relatives":"","thumb":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Michael_Jackson_signature.svg/200px-Michael_Jackson_signature.svg.png","title":"Michael Jackson"}'

@app.route('/')
def hello_world():
    return 'Hello Celeb-cache'


@app.route('/celeb-info/<lastname>/<firstname>', methods=['GET'])
def celeb_info(lastname, firstname):
    # return generate_mock()
    clean_cache()
    if f"{lastname}/{firstname}" in celeb_cache:
        info = celeb_cache[f"{lastname}/{firstname}"]["info"]
        info["last_fetch"] = str(celeb_cache[f"{lastname}/{firstname}"]["time"])
        return info

    info = {"title":"", "thumb":"", "desc":"", "birthname":"", "birthdate":"", "birthplace":"", "educ":"", "occupation":"", "relatives":""}
    # print(lastname, firstname)
    url_string = f"https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&prop=pageprops%7Cpageimages%7Cdescription&ppprop=displaytitle&piprop=thumbnail&pithumbsize=200&gpssearch={firstname}%20{lastname}"
    print("opening 1st link:", url_string)
    with urllib.request.urlopen(url_string) as url:
        data = json.loads(url.read().decode())

    if "query" not in data:
        info["last_fetch"] = "none"
        return info
    pages = data["query"]["pages"]

    for page_id, details in pages.items():
        if details["index"]==1:
            info["title"] = details["title"]
            if "thumbnail" in details and "source" in details["thumbnail"]:
                info["thumb"] = details["thumbnail"]["source"]
            if "description" in details:
                info["desc"] = details["description"]

            url2_string = f"https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&format=json&titles={ details['title'].replace(' ', '_') }"
            print("opening 2nd link:", url2_string)
            with urllib.request.urlopen(url2_string) as url:
                more_data = json.loads(url.read().decode())
                if "query" not in more_data:
                    return ""
                bio = more_data["query"]["pages"][page_id]["revisions"][0]["*"].split("\n")
                for line in bio:
                    if line.startswith("| birth_name") :
                        info["birthname"] = line.split("=")[1].strip()
                    elif line.startswith("| birth_date") :
                        info["birthdate"] = "|".join(line.split("=")[1].split("date")[1].split("}")[0].split("|")[1:3])
                    if line.startswith("| birth_place") :
                        info["birthplace"] = line.split("=")[1].replace("[[", "").replace("]]", "").strip()
                    if line.startswith("| education") :
                        info["educ"] = line.split("=")[1].replace("[[", "").replace("]]", "").strip()
                    if line.startswith("| occupation") :
                        info["occupation"] = line.split("=")[1].replace("{{", "").replace("}}", "").split("<!--")[0].strip()
                    if line.startswith("| relatives") :
                        info["relatives"] = line.split("=")[1].replace("[[", "").replace("]]", "").strip()

                celeb_cache[f"{lastname}/{firstname}"] = {"time":datetime.datetime.now(),"info":info}
                info["last_fetch"] = "fresh"
    return info
